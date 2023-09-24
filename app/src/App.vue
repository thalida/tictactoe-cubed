<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useSocketStore } from './stores/socket';
import { computed } from 'vue';

const socketStore = useSocketStore();
const isConnected = computed(() => socketStore.connected);
</script>

<template>
  <RouterView v-if="isConnected" />
  <div v-else>
    <h1>Connecting...</h1>
  </div>
</template>

<style scoped>
</style>
