<script>
import EventBus from '../event-bus';
import Cell from './Cell';

export default {
  name: 'InnerBoard',
  props: ['index', 'board'],
  components: {
    Cell,
  },
  methods: {
    onClick() {
      if (!this.board.selectable) {
        return;
      }

      EventBus.$emit('innerboard-click', this.index);
    },
  },
};
</script>

<template>
  <div 
    class="inner-board"
    v-bind:class="{ 
      active: board.active,
      selectable: board.selectable,
    }"
    v-on:click="onClick()">
    <Cell 
      v-for="(cell, cellIndex) in board.cells" 
      :key="cellIndex" 
      v-bind:parent-index="index"
      v-bind:parent-board="board"
      v-bind:index="cellIndex"
      v-bind:move="cell" />
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables';

.inner-board {
  display: flex;
  position: relative;
  flex-wrap: wrap;
  color: red;

  flex: 0 1 auto;
  width: 33.3%;
  height: 33.3%;
  background: $bg-color;
  border: 2px solid $innerboard_border-color;
  box-shadow: 0px 0px 0px 0px transparent;
  transition: border 300ms, box-shadow 300ms;

  &:hover {
    cursor: pointer;
  }

  &.active {
    border: 2px solid $highlight-color;
    box-shadow: 0px 0px 0px 3px $bg-color;
    z-index: 2;
  }

  &.selectable:after {
    content: "";
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
