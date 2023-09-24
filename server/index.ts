import express, { Express, Request, Response } from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { ulid } from 'ulid'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'
import lodash from 'lodash'

class LowSyncWithLodash<T> extends LowSync<T> {
  chain: lodash.ExpChain<this['data']> = lodash.chain(this).get('data')
}

interface Data {
  games: Game[];
}

interface Game {
  id: string;
  players: Player[];
  state: string;
}

interface Player {
  id: string;
  name: string;
}


const app: Express = express();
const server = createServer(app);
const io = new Server(server);

// DATABASE
const __dirname = dirname(fileURLToPath(import.meta.url))
const DB_FILE = join(__dirname, 'db/data.json')
const defaultData = { games: [] }
const adapter = new JSONFileSync<Data>(DB_FILE)
const db = new LowSyncWithLodash(adapter, defaultData)

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

io.of("/games").on("connection", (socket) => {
  socket.on("game:create", (payload, callback) => {
    const game = {
      id: ulid(),
      players: [],
      state: "waiting",
    }
    db.data.games.push(game);
    db.write()

    socket.join(game.id);
    callback({
      status: 200,
      data: {
        game,
      },
    });
  });

  socket.on("game:join", (payload, callback) => {
    const { gameId } = payload;

    const game = db.chain.get('games').find({ id: gameId }).value()
    if (!game) {
      callback({
        status: 404,
        message: "Game not found",
      });
      return;
    }

    socket.join(game.id);
    callback({
      status: 200,
      data: {
        game,
      },
    });
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});


// // Read data from JSON file, this will set db.data content
// // If JSON file doesn't exist, defaultData is used instead
// await db.read()

// // Create and query items using plain JavaScript
// db.data.posts.push('hello world')
// const firstPost = db.data.posts[0]

// // If you don't want to type db.data everytime, you can use destructuring assignment
// const { posts } = db.data
// posts.push('hello world')

// // Finally write db.data content to file
// await db.write()
