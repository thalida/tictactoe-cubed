<script setup lang="ts">
import { computed, defineProps, onMounted } from 'vue'
import { useGamesStore } from '@/stores/game'

const gamesStore = useGamesStore()
const props = defineProps({
  gameId: {
    type: String,
    required: true,
  },
})
const game = computed(() => gamesStore.games[props.gameId])
const myParticipant = computed(() => {
  if (!game.value) {
    return null
  }

  const myParticipantId = gamesStore.myAliases[props.gameId]

  if (!myParticipantId) {
    return null
  }

  return game.value.participants.find((p) => p.id === myParticipantId)
})

onMounted(async () => {
  await gamesStore.readGame(props.gameId)
})
</script>
<template>
  <div>
    <h1>This is an game</h1>
    {{ gameId }}
    {{ game }}
    {{ myParticipant }}
  </div>
</template>

<style></style>
