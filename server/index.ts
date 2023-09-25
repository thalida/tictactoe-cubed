import express, { Express, Request, Response } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { ulid } from 'ulid'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import Joi from 'joi';
import {Level} from 'level';

interface IGame {
  id: string;
  participants: (IPlayer | ISpectator)[];
  currentPlayer: 'X' | 'O';
  moves: string[];
  lastMove: number | null;
}

interface IBaseParticipant {
  id: string;
  name: string;
}

interface IPlayer extends IBaseParticipant {
  role: "player";
  playerSymbol: 'X' | 'O';
}

interface ISpectator extends IBaseParticipant {
  role: "spectator";
}

type IParticipant = IPlayer | ISpectator;

type IResData = Record<string, any> | null;
type IResErrors = IError[] | null;
interface IError {
  code: string;
  message: string;
}

const app: Express = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
    ]
  }
});

// DATABASE
const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_DIR = join(__dirname, '../db')
const db = new Level<string, IGame>(DB_DIR, { valueEncoding: 'json' })

// GAME RULES
const MAX_PLAYERS = 2;
const BOARD_SIZE = 9;
const NUM_POSITIONS = BOARD_SIZE * BOARD_SIZE;

// VALIDATION
const participantSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  role: Joi.string()
    .valid('player', 'spectator')
    .required(),
})

const gameSchema = Joi.object({
  id: Joi.string()
    .alphanum()
    .required(),
});

const idSchema = Joi.string().alphanum().required();
const moveSchema = Joi.number().min(0).max(NUM_POSITIONS - 1).required();


io
.of("/games")
.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on("game:create", async (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null
    const { participantName, participantRole } = payload;
    const validatedData = participantSchema.validate({
      name: participantName,
      role: participantRole,
    });

    if (validatedData.error) {
      errors = [{
        code: "INVALID_PARTICIPANT",
        message: validatedData.error.message,
      }];
      callback({
        status: 400,
        data,
        errors,
      });
      return;
    }

    let participant: IParticipant;
    if (validatedData.value.role === "player") {
      participant = {
        id: ulid(),
        name: validatedData.value.name,
        role: validatedData.value.role,
        playerSymbol: "X",
      }
    } else {
      participant = {
        id: ulid(),
        name: validatedData.value.name,
        role: validatedData.value.role,
      }
    }

    const game: IGame = {
      id: ulid(),
      participants: [ participant ],
      currentPlayer: 'X',
      lastMove : null,
      moves: [],
    }

    await db.put(`games/${game.id}`, game)

    socket.join(game.id);

    data = {
      game,
      me: participant,
    }

    callback({
      status: 200,
      data,
      errors,
    });
  });

  socket.on("game:read", async (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null;

    const { gameId } = payload;
    const validatedData = idSchema.validate(gameId);

    if (validatedData.error) {
      errors = [{
        code: "INVALID_GAME",
        message: validatedData.error.message,
      }];
      callback({
        status: 400,
        data,
        errors,
      });
      return;
    }

    const game = await db.get(`games/${validatedData.value}`)
    if (!game) {
      errors = [{
        code: "GAME_NOT_FOUND",
        message: "Game not found",
      }];
      callback({
        status: 404,
        data,
        errors,
      });
      return;
    }

    data = {
      game,
    }

    callback({
      status: 200,
      data,
      errors,
    });
  });

  socket.on("game:join", async (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null;

    const { gameId, participantName, participantRole } = payload;
    const validatedParticipantData = participantSchema.validate({
      name: participantName,
      role: participantRole,
    });
    const validatedGameData = gameSchema.validate({
      id: gameId,
    });

    if (validatedParticipantData.error || validatedGameData.error) {
      errors = []

      if (validatedParticipantData.error) {
        errors.push({
          code: "INVALID_PARTICIPANT",
          message: validatedParticipantData.error.message,
        });
      }

      if (validatedGameData.error) {
        errors.push({
          code: "INVALID_GAME",
          message: validatedGameData.error.message,
        });
      }

      callback({
        status: 400,
        data,
        errors,
      });
      return;
    }


    const game = await db.get(`games/${validatedGameData.value}`)
    if (!game) {
      errors = [{
        code: "GAME_NOT_FOUND",
        message: "Game not found",
      }];
      callback({
        status: 404,
        data,
        errors,
      });
      return;
    }

    const existingParticipant = game.participants.find((participant) => participant.name === validatedParticipantData.value.name);
    if (existingParticipant) {
      errors = [{
        code: "PARTICIPANT_ALREADY_EXISTS",
        message: "Participant already exists",
      }];

      socket.join(game.id);
      socket.to(game.id).emit("game:participant:joined", {
        participant: existingParticipant,
      });

      data = {
        game,
        me: existingParticipant,
      }

      callback({
        status: 200,
        data,
        errors,
      });

      return;
    }

    const numPlayers = game.participants.filter((participant) => participant.role === "player").length;
    if (validatedParticipantData.value.role === "player" && numPlayers >= MAX_PLAYERS) {
      errors = [{
        code: "GAME_IS_FULL",
        message: "Game is full. Joining as spectator instead.",
      }];
      validatedParticipantData.value.role = "spectator";
    }

    let participant: IPlayer | ISpectator;
    if (validatedParticipantData.value.role === "player") {
      const hasXPlayer = game.participants.find((participant) => participant.role === "player" && participant.playerSymbol === "X");
      participant = {
        id: ulid(),
        name: validatedParticipantData.value.name,
        role: validatedParticipantData.value.role,
        playerSymbol: hasXPlayer ? "O" : "X",
      }
    } else {
      participant = {
        id: ulid(),
        name: validatedParticipantData.value.name,
        role: validatedParticipantData.value.role,
      }
    }

    game.participants.push(participant);
    await db.put(`games/${game.id}`, game)

    socket.join(game.id);
    socket.to(game.id).emit("game:participant:joined", {
      participant,
    });

    data = {
      game,
      me: participant,
    }

    callback({
      status: 200,
      data,
      errors,
    });
  });

  socket.on("game:leave", async (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null;

    const { gameId, participantId } = payload;
    const validatedParticipantData = idSchema.validate(participantId);
    const validatedGameData = gameSchema.validate(gameId);

    if (validatedParticipantData.error || validatedGameData.error) {
      errors = []

      if (validatedParticipantData.error) {
        errors.push({
          code: "INVALID_PARTICIPANT",
          message: validatedParticipantData.error.message,
        });
      }

      if (validatedGameData.error) {
        errors.push({
          code: "INVALID_GAME",
          message: validatedGameData.error.message,
        });
      }

      callback({
        status: 400,
        data,
        errors,
      });
      return;
    }

    const game = await db.get(`games/${validatedGameData.value}`)
    if (!game) {
      errors = [{
        code: "GAME_NOT_FOUND",
        message: "Game not found",
      }];
      callback({
        status: 404,
        data,
        errors,
      });
      return;
    }

    const participant = game.participants.find((participant) => participant.id === validatedParticipantData.value);
    if (!participant) {
      errors = [{
        code: "PARTICIPANT_NOT_FOUND",
        message: "Participant not found",
      }];
      callback({
        status: 404,
        data,
        errors,
      });
      return;
    }

    game.participants = game.participants.filter((participant) => participant.id !== validatedParticipantData.value);
    await db.put(`games/${game.id}`, game)

    socket.leave(game.id);
    socket.to(game.id).emit("game:participant:left", {
      participant,
    });

    callback({
      status: 204,
      data,
      errors,
    });
  });

  socket.on("game:move", async (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null;

    const { gameId, participantId, move } = payload;
    const validatedGameData = idSchema.validate(gameId);
    const validatedParticipantData = idSchema.validate(participantId);
    const validatedMoveData = moveSchema.validate(move);

    if (validatedGameData.error || validatedParticipantData.error || validatedMoveData.error) {
      errors = []

      if (validatedGameData.error) {
        errors.push({
          code: "INVALID_GAME",
          message: validatedGameData.error.message,
        });
      }

      if (validatedParticipantData.error) {
        errors.push({
          code: "INVALID_PARTICIPANT",
          message: validatedParticipantData.error.message,
        });
      }

      if (validatedMoveData.error) {
        errors.push({
          code: "INVALID_MOVE",
          message: validatedMoveData.error.message,
        });
      }

      callback({
        status: 400,
        data,
        errors,
      });
      return;
    }


    const game = await db.get(`games/${validatedGameData.value}`)
    if (!game) {
      errors = [{
        code: "GAME_NOT_FOUND",
        message: "Game not found",
      }];
      callback({
        status: 404,
        data,
        errors,
      });
      return;
    }

    const participant = game.participants.find((participant) => participant.id === validatedParticipantData.value);
    if (!participant) {
      errors = [{
        code: "PARTICIPANT_NOT_FOUND",
        message: "Participant not found",
      }];
      callback({
        status: 404,
        data,
        errors,
      });
      return;
    }

    if (participant.role !== "player") {
      errors = [{
        code: "NOT_A_PLAYER",
        message: "Only players can make moves",
      }];
      callback({
        status: 403,
        data,
        errors,
      });
      return;
    }

    if (participant.playerSymbol !== game.currentPlayer) {
      errors = [{
        code: "NOT_YOUR_TURN",
        message: "It is not your turn",
      }];
      callback({
        status: 403,
        data,
        errors,
      });
      return;
    }

    if (typeof game.moves[move] !== "undefined") {
      errors = [{
        code: "INVALID_MOVE",
        message: "Invalid move",
      }];
      callback({
        status: 400,
        data,
        errors,
      });
      return;
    }

    game.moves[move] = participant.playerSymbol;
    game.lastMove = move;
    game.currentPlayer = participant.playerSymbol === "X" ? "O" : "X";

    await db.put(`games/${game.id}`, game)

    socket.to(game.id).emit("game:move", {
      game,
      participant,
    });

    callback({
      status: 204,
      data,
      errors,
    });
  });

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
