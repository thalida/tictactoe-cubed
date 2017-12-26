<script>
import Cell from './Cell';

export default {
  name: 'InnerBoard',
  props: ['index', 'board'],
  components: {
    Cell,
  },
};
</script>

<template>
  <div 
    class="inner-board"
    v-bind:class="{ active: board.active }">
    <Cell 
      v-for="(cell, cellIndex) in board.cells" 
      :key="cellIndex" 
      v-bind:parent-index="index"
      v-bind:parent-active="board.active"
      v-bind:index="cellIndex"
      v-bind:move="cell" />
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables';

.inner-board {
  display: flex;
  flex-wrap: wrap;

  flex: 0 1 auto;
  width: 33.3%;
  height: 33.3%;
  background: $bg-color;
  border: 1px solid $innerboard_border-color;
  box-shadow: 0px 0px 0px 0px transparent;
  transition: border 1000ms, box-shadow 1000ms;

  &.active {
    border: 1px solid $highlight-color;
    box-shadow: 0px 0px 0px 3px $highlight-color;
    z-index: 2;
  }
}
</style>
