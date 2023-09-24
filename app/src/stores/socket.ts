import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { io } from "socket.io-client";


export const useSocketStore = defineStore('socket', () => {
  const socketURL = import.meta.env.VITE_SOCKET_URL as string;
  const socket = io(socketURL);
  const connected = ref(false)

  socket.on("connect", () => {
    connected.value = true;
  });

  socket.on("disconnect", () => {
    connected.value = false;
  });


  return { socket, connected }
})
