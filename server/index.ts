import express, { Express, Request, Response } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { ulid } from 'ulid'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import lodash from 'lodash'
import sanitize from 'sanitize'
import _ from 'lodash';

class LowSyncWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

interface IData {
  games: IGame[];
}

interface IGame {
  id: string;
  participants: (IPlayer | ISpectator)[];
  currentPlayer: 'X' | 'O';
  lastMove: number | null;
  moves: string[];
}

interface IParticipant {
  id: string;
  name: string;
}

interface IPlayer extends IParticipant {
  role: "player";
  playerSymbol: 'X' | 'O';
}

interface ISpectator extends IParticipant {
  role: "spectator";
}

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
const DB_FILE = join(__dirname, 'db/data.json')
const defaultData = { games: [] }
const adapter = new JSONFileSync<IData>(DB_FILE)
const db = new LowSyncWithLodash(adapter, defaultData)

// GAME RULES
const MAX_PLAYERS = 2;
const BOARD_SIZE = 9;
const NUM_POSITIONS = BOARD_SIZE * BOARD_SIZE;

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on("game:create", (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null
    const { participantName } = payload;
    const validatedData = sanitize.object({
      participantName: sanitize.value(participantName, "string"),
    });

    const participant: IPlayer = {
      id: ulid(),
      name: validatedData.participantName,
      role: "player",
      playerSymbol: "X",
    }

    const game: IGame = {
      id: ulid(),
      participants: [ participant ],
      currentPlayer: 'X',
      lastMove : null,
      moves: [],
    }

    db.data.games.push(game);
    db.write()

    socket.join(game.id);

    data = {
      game,
      participant,
    }

    callback({
      status: 200,
      data,
      errors,
    });
  });

  socket.on("game:join", (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null;

    const { gameId, participantName, participantRole } = payload;
    const validatedData = sanitize.object({
      gameId: sanitize.value(gameId, "string"),
      participantName: sanitize.value(participantName, "string"),
      participantRole: sanitize.value(participantRole, "string"),
    });

    const game = db.chain.get('games').find({ id: validatedData.gameId }).value()
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

    const existingParticipant = game.participants.find((participant) => participant.name === validatedData.participantName);
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
        participant: existingParticipant,
      }

      callback({
        status: 200,
        data,
        errors,
      });

      return;
    }

    const numPlayers = game.participants.filter((participant) => participant.role === "player").length;
    if (validatedData.participantRole === "player" && numPlayers >= MAX_PLAYERS) {
      errors = [{
        code: "GAME_IS_FULL",
        message: "Game is full. Joining as spectator instead.",
      }];
      validatedData.participantRole = "spectator";
    }

    let participant: IPlayer | ISpectator;
    if (validatedData.participantRole === "player") {
      const hasXPlayer = game.participants.find((participant) => participant.role === "player" && participant.playerSymbol === "X");
      participant = {
        id: ulid(),
        name: validatedData.participantName,
        role: validatedData.participantRole,
        playerSymbol: hasXPlayer ? "O" : "X",
      }
    } else {
      participant = {
        id: ulid(),
        name: validatedData.participantName,
        role: validatedData.participantRole,
      }
    }

    game.participants.push(participant);
    db.write()

    socket.join(game.id);
    socket.to(game.id).emit("game:participant:joined", {
      participant,
    });

    data = {
      game,
      participant,
    }

    callback({
      status: 200,
      data,
      errors,
    });
  });

  socket.on("game:leave", (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null;

    const { gameId, participantId } = payload;
    const validatedData = sanitize.object({
      gameId: sanitize.value(gameId, "string"),
      participantId: sanitize.value(participantId, "string"),
    });

    const game = db.chain.get('games').find({ id: validatedData.gameId }).value()
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

    const participant = game.participants.find((participant) => participant.id === validatedData.participantId);
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

    game.participants = game.participants.filter((participant) => participant.id !== validatedData.participantId);
    db.write()

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

  socket.on("game:move", (payload, callback) => {
    let data: IResData = null;
    let errors: IResErrors = null;

    const { gameId, participantId, move } = payload;
    const validatedData = sanitize.object({
      gameId: sanitize.value(gameId, "string"),
      participantId: sanitize.value(participantId, "string"),
      move: sanitize.value(move, "number"),
    });

    const game = db.chain.get('games').find({ id: validatedData.gameId }).value()
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

    const participant = game.participants.find((participant) => participant.id === validatedData.participantId);
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

    if (validatedData.move < 0 || validatedData.move >= NUM_POSITIONS) {
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
    db.write()

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
