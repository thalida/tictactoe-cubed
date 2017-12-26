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
    const players = [
      { index: 0, key: 'x', turn: true },
      { index: 1, key: 'o', turn: false },
    ];
    const gameBoard = [];
    for (let i = 0; i < 9; i += 1) {
      gameBoard.push({
        active: true,
        cells: new Array(9).fill(null),
      });
    }

    return {
      gameBoard,
      players,
      totalPlayers: players.length,
      isStart: true,
    };
  },
  computed: {
    currentPlayer() {
      return this.players.find(player => player.turn === true);
    },
  },
  mounted() {
    EventBus.$on('cell-click', this.onCellClick);
  },
  methods: {
    setNextPlayer() {
      let nextPlayer = this.currentPlayer.index + 1;
      nextPlayer = (nextPlayer >= this.totalPlayers) ? 0 : nextPlayer;

      this.currentPlayer.turn = false;
      this.players[nextPlayer].turn = true;
    },
    onCellClick(innerBoardIndex, cellIndex) {
      const move = { player: this.currentPlayer };

      if (this.isStart) {
        this.gameBoard.map((b) => {
          const board = b;
          board.active = false;
          return board;
        });
        this.isStart = false;
      } else {
        this.gameBoard[innerBoardIndex].active = false;
      }

      this.gameBoard[innerBoardIndex].cells.splice(cellIndex, 1, move);

      this.gameBoard[cellIndex].active = true;

      this.setNextPlayer();
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
