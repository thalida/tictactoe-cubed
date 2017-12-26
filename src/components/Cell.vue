<script>
import EventBus from '../event-bus';
import PlayerSymbol from './PlayerSymbol';

export default {
  name: 'Cell',
  props: ['parent-index', 'parentActive', 'index', 'move'],
  components: {
    PlayerSymbol,
  },
  methods: {
    onClick() {
      if (this.move || !this.parentActive) {
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
    v-bind:class="{ clickable: !move && parentActive }"
    v-on:click="onClick()">
    <PlayerSymbol v-if="move" v-bind:symbol="move.player.key" />
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables';

.cell {
  display: flex;
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
      background: lighten($bg-color, 3%);
    }
  }

}
</style>
