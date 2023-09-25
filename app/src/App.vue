<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { computed } from 'vue'
import { useGamesStore } from './stores/game'

const gamesStore = useGamesStore()
const isConnected = computed(() => gamesStore.socketConnected)
</script>

<template>
  <RouterView v-if="isConnected" />
  <div v-else>
    <h1>Connecting...</h1>
  </div>
</template>

<style scoped></style>
