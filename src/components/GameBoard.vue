<script>
import InnerBoard from './InnerBoard';

export default {
  name: 'GameBoard',
  props: ['players', 'currentPlayer', 'board'],
  components: {
    InnerBoard,
  },
};
</script>

<template>
  <div class="gameboard">
    <div class="gameboard-content">
      <InnerBoard 
        v-for="(innerBoard, innerBoardIndex) in board" 
        :key="innerBoardIndex"
        v-bind:index="innerBoardIndex"
        v-bind:board="innerBoard" />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '../assets/styles/variables';

.gameboard {
  position: relative;
  width: 60vh;
  max-width: 90%;
  margin: auto;
  border: 1px solid $gameboard_border-color;

  &:after {
    content: "";
    display: block;
    padding-bottom: 100%;
  }
  
  &-content {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    width: 100%;
    height: 100%;

    background: $gameboard_border-color;
  }
}
</style>
