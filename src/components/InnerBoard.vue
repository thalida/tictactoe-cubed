<script>
import EventBus from '../event-bus';
import Cell from './Cell';

export default {
  name: 'InnerBoard',
  props: ['index', 'board'],
  components: {
    Cell,
  },
  data() {
    return {
      forceClickable: false,
    };
  },
  mounted() {
    EventBus.$on('opponent-picks-inner-board', this.onOpponentPicksInnerBoard);
  },
  methods: {
    onOpponentPicksInnerBoard() {
      this.forceClickable = true;
    },
    onClick() {
      if (!this.forceClickable) {
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
      hover: forceClickable,
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
  border: 1px solid $innerboard_border-color;
  box-shadow: 0px 0px 0px 0px transparent;
  transition: border 1000ms, box-shadow 1000ms;

  &.hover:hover {
    transition: border 300ms, box-shadow 300ms;
    cursor: pointer;
  }

  &.hover:hover,
  &.active {
    border: 1px solid $highlight-color;
    box-shadow: 0px 0px 0px 3px $highlight-color;
    z-index: 2;
  }
}
</style>
