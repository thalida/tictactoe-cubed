<script>
import EventBus from './event-bus';
import PlayerInfo from './components/PlayerInfo';
import GameBoard from './components/GameBoard';

export default {
  name: 'app',
  components: {
    PlayerInfo,
    GameBoard,
  },
  data() {
    const boardSize = 3;
    const players = [
      { index: 0, key: 'x', turn: true, hasWon: false },
      { index: 1, key: 'o', turn: false, hasWon: false },
    ];
    const gameBoard = [];
    for (let i = 0; i < (boardSize * boardSize); i += 1) {
      gameBoard.push({
        active: true,
        cells: new Array(9).fill(null),
        lastMove: null,
        winner: null,
        numUsedCells: 0,
        isFilled: false,
      });
    }

    return {
      boardSize,
      gameBoard,
      players,
      totalPlayers: players.length,
      isStart: true,
      gameOver: false,
      winner: null,
      opponentPicksInnerBoard: false,
    };
  },
  computed: {
    currentPlayer() {
      return this.players.find(player => player.turn === true);
    },
  },
  mounted() {
    EventBus.$on('innerboard-click', this.onInnerBoardClick);
    EventBus.$on('cell-click', this.onCellClick);
  },
  methods: {
    getBoardCoords(index) {
      return {
        x: Math.floor(index / this.boardSize),
        y: index % this.boardSize,
      };
    },
    getNestedBoard(flatBoard) {
      const board = [[], [], []];

      for (let j = 0; j < flatBoard.length; j += 1) {
        const pos = this.getBoardCoords(j);
        const hasPlayer = flatBoard[j] && flatBoard[j].player;
        board[pos.x][pos.y] = (hasPlayer) ? flatBoard[j].player.key : null;
      }

      return board;
    },
    getBoardWinners() {
      const board = [];

      for (let i = 0; i < this.gameBoard.length; i += 1) {
        board.push({ player: this.gameBoard[i].winner });
      }

      return board;
    },
    getWinner(board, lastMove) {
      let winner = null;
      const checks = {
        col: 0,
        row: 0,
        diag: 0,
        rdiag: 0,
      };
      const move = this.getBoardCoords(lastMove.index);
      const cells = this.getNestedBoard(board);

      for (let i = 0; i < this.boardSize; i += 1) {
        if (cells[move.x][i] === lastMove.player.key) {
          checks.col += 1;
        }
        if (cells[i][move.y] === lastMove.player.key) {
          checks.row += 1;
        }
        if (cells[i][i] === lastMove.player.key) {
          checks.diag += 1;
        }
        if (cells[i][(4 - i)] === lastMove.player.key) {
          checks.rdiag += 1;
        }
      }

      if (Object.values(checks).indexOf(this.boardSize) >= 0) {
        winner = lastMove.player;
      }

      return winner;
    },
    setNextPlayer() {
      let nextPlayer = this.currentPlayer.index + 1;
      nextPlayer = (nextPlayer >= this.totalPlayers) ? 0 : nextPlayer;

      this.currentPlayer.turn = false;
      this.players[nextPlayer].turn = true;
    },
    unsetPlayerTurns() {
      this.players.map((p) => {
        const player = p;
        player.turn = false;
        return player;
      });
    },
    setInnerBoardsActive() {
      this.gameBoard.map((b) => {
        const board = b;
        board.active = true;
        return board;
      });
    },
    setInnerBoardsInactive() {
      this.gameBoard.map((b) => {
        const board = b;
        board.active = false;
        return board;
      });
    },
    onInnerBoardClick(innerBoardIndex) {
      if (!this.opponentPicksInnerBoard) {
        return;
      }

      if (!this.gameBoard[innerBoardIndex].isFilled) {
        this.opponentPicksInnerBoard = false;
        this.setInnerBoardsInactive();
        this.gameBoard[innerBoardIndex].active = true;
        this.setNextPlayer();
      }
    },
    onCellClick(innerBoardIndex, cellIndex) {
      if (this.gameOver) {
        return;
      }

      const move = { index: cellIndex, player: this.currentPlayer };

      if (this.isStart) {
        this.setInnerBoardsInactive();
        this.isStart = false;
      } else {
        this.gameBoard[innerBoardIndex].active = false;
      }

      this.gameBoard[innerBoardIndex].lastMove = move;
      this.gameBoard[innerBoardIndex].cells.splice(cellIndex, 1, move);
      this.gameBoard[innerBoardIndex].numUsedCells += 1;

      const numUsedCells = this.gameBoard[innerBoardIndex].numUsedCells;
      const totalCells = this.gameBoard[innerBoardIndex].cells.length;
      this.gameBoard[innerBoardIndex].isFilled = numUsedCells === totalCells;

      if (this.gameBoard[innerBoardIndex].winner === null) {
        this.gameBoard[innerBoardIndex].winner = this.getWinner(
          this.gameBoard[innerBoardIndex].cells,
          this.gameBoard[innerBoardIndex].lastMove,
        );

        this.winner = this.getWinner(
          this.getBoardWinners(),
          {
            index: innerBoardIndex,
            player: this.gameBoard[innerBoardIndex].lastMove.player,
          },
        );
      }

      if (this.winner) {
        this.winner.hasWon = true;
        this.gameOver = true;
        this.setInnerBoardsInactive();
        return;
      }

      this.gameBoard[cellIndex].active = true;

      if (this.gameBoard[cellIndex].isFilled) {
        this.opponentPicksInnerBoard = true;
        this.setInnerBoardsInactive();
        EventBus.$emit('opponent-picks-inner-board');
      } else {
        this.setNextPlayer();
      }
    },
  },
};
</script>

<template>
  <div id="app">
    <PlayerInfo 
      v-bind:player="players[1]" />
    <GameBoard 
      v-bind:players="players" 
      v-bind:currentPlayer="currentPlayer"
      v-bind:board="gameBoard" />
    <PlayerInfo 
      v-bind:player="players[0]" />
  </div>
</template>

<style lang="scss">
@import './assets/styles/variables';

html,
body,
#app {
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: auto;
}

html {
  box-sizing: border-box;
}

*, *:before, *:after {
  box-sizing: inherit;
}

body {
  margin: 0;
  padding: 0;
  background: $bg-color;
}

#app {
  display: flex;
  flex-direction: column;
}
</style>
