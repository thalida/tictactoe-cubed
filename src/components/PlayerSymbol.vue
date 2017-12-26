<script>
export default {
  name: 'PlayerSymbol',
  props: ['symbol'],
};
</script>

<template>
  <svg v-if="symbol === 'x'" class="player-symbol player-x" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g class="path" stroke="none" stroke-width="1" fill="#000000" fill-rule="evenodd">
      <path d="M20,12 L28,12 C30.209139,12 32,13.790861 32,16 C32,18.209139 30.209139,20 28,20 L20,20 L20,28 C20,30.209139 18.209139,32 16,32 C13.790861,32 12,30.209139 12,28 L12,20 L4,20 C1.790861,20 0,18.209139 0,16 C0,13.790861 1.790861,12 4,12 L12,12 L12,4 C12,1.790861 13.790861,4.05812251e-16 16,0 C18.209139,-4.05812251e-16 20,1.790861 20,4 L20,12 Z" id="Combined-Shape" transform="translate(16.000000, 16.000000) rotate(-315.000000) translate(-16.000000, -16.000000) "></path>
    </g>
  </svg>
  <svg v-else-if="symbol === 'o'" class="player-symbol player-o" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g id="Symbols" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="shape/o" stroke="#46FFCB" stroke-width="8">
            <circle id="Oval" cx="16" cy="16" r="12"></circle>
        </g>
    </g>
  </svg>
</template>

<style scoped lang="scss">
@import '../assets/styles/_variables';

.player-symbol {
    height: $player-symbol_height;
    width: $player-symbol_width;
    
    &.player-x .path {
      fill: $player-x_color;
    }

    &.player-o .path {
      fill: $player-o_color;
    }

    &.is-game-piece {
      height: 50%;
      width: 50%;
    }
}
</style>
