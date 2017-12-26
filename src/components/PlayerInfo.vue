<script>
import PlayerSymbol from './PlayerSymbol';

export default {
  name: 'PlayerInfo',
  props: ['player'],
  components: {
    PlayerSymbol,
  },
};
</script>

<template>
  <div 
    class="player-info"
    v-bind:class="{ 
      active: player.turn,
      winner: player.hasWon,
    }">
    <span class="player">
      <PlayerSymbol v-bind:symbol="player.key" />
    </span>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/_variables';

.player-info {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 20vh;
  color: white;

  .player {
    border: 1px solid transparent;
    padding: 12px 12px 10px 12px;
  }

  &.active .player {
    border: 4px solid $highlight-color;
    border-radius: 50%;
  }

  &.winner .player {
    border: 4px solid $win-color;
    border-radius: 50%;
  }
}
</style>
