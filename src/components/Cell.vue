<script>
import EventBus from '../event-bus';
import PlayerSymbol from './PlayerSymbol';

export default {
  name: 'Cell',
  props: ['parent-index', 'parent-board', 'index', 'move'],
  components: {
    PlayerSymbol,
  },
  methods: {
    onClick() {
      if (this.move || !this.parentBoard.active) {
        return;
      }
      EventBus.$emit('cell-click', this.parentIndex, this.index);
    },
  },
};
</script>

<template>
  <div 
    class="cell" 
    v-bind:class="{ 
      clickable: !move && parentBoard.active,
      winner: parentBoard.winner,
      'x-winner': parentBoard.winner && parentBoard.winner.key === 'x',
      'o-winner': parentBoard.winner && parentBoard.winner.key === 'o',
    }"
    v-on:click.stop="onClick()">
    <PlayerSymbol 
      v-if="move" 
      v-bind:symbol="move.player.key"
      class="is-game-piece" />
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables';

.cell {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;

  flex: 0 1 auto;
  width: 33.3%;
  height: 33.3%;

  background: $bg-color;
  border: 1px solid $cell_border-color;

  &.clickable {
    cursor: pointer;
    
    &:hover {
      background: lighten($bg-color, 10%);
    }
  }
  
  &.x-winner {
    background: rgba($player-x_win-color, 0.3);
    border: 1px solid rgba($player-x_win-color, 0.2);
    
    &.clickable:hover {
      background: rgba(lighten($player-x_win-color, 3%), 0.5);
    }
  }

  &.o-winner {
    background: rgba($player-o_win-color, 0.3);
    border: 1px solid rgba($player-o_win-color, 0.2);
    
    &.clickable:hover {
      background: rgba(lighten($player-o_win-color, 3%), 0.5);
    }
  }
}
</style>
