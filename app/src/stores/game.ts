import { ref, computed, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { useLocalStorage, useSessionStorage } from '@vueuse/core'

export interface IGames {
  [key: string]: IGame
}

export interface IGame {
  id: string
  participants: IParticipant[]
  moves: string[]
  lastMove: number | null
  currentPlayer: 'X' | 'O'
}

type IParticipant = IPlayer | ISpectator

interface IPlayer extends IBaseParticipant {
  role: 'player'
  playerSymbol: 'X' | 'O'
}

interface ISpectator extends IBaseParticipant {
  role: 'spectator'
}

interface IBaseParticipant {
  id: string
  name: string
}

export const useGamesStore = defineStore('games', () => {
  const socketURL = import.meta.env.VITE_SOCKET_URL as string
  const socket = io(`${socketURL}/games`)
  const socketConnected = ref(false)
  const myAliases: Ref<Record<string, string>> = useLocalStorage('t3/me', {})
  const games: Ref<IGames> = useLocalStorage('t3/games', {})

  socket.on('connect', () => {
    socketConnected.value = true
  })

  socket.on('disconnect', () => {
    socketConnected.value = false
  })

  async function readGame(gameId: string) {
    return new Promise((resolve, reject) => {
      socket.emit('game:read', { gameId }, (response: any) => {
        if (response.error) {
          reject(response.error)
        } else {
          const game: IGame = {
            id: response.data.game.id,
            participants: response.data.game.participants,
            currentPlayer: response.data.game.currentPlayer,
            moves: response.data.game.moves,
            lastMove: response.data.game.lastMove,
          }
          games.value[game.id] = game

          const gameAlias = myAliases.value[game.id]
          const hasParticipant = game.participants.some(
            (participant) => participant.id === gameAlias,
          )

          if (gameAlias && !hasParticipant) {
            delete myAliases.value[game.id]
          }

          resolve({ game })
        }
      })
    })
  }

  async function createGame(participantName: string, participantRole: 'player' | 'spectator') {
    return new Promise((resolve, reject) => {
      socket.emit('game:create', { participantName, participantRole }, (response: any) => {
        if (response.error) {
          reject(response.error)
        } else {
          const game: IGame = {
            id: response.data.game.id,
            participants: response.data.game.participants,
            currentPlayer: response.data.game.currentPlayer,
            moves: response.data.game.moves,
            lastMove: response.data.game.lastMove,
          }
          games.value[game.id] = game
          myAliases.value[game.id] = response.data.me.id
          resolve({ game })
        }
      })
    })
  }

  return {
    socketConnected,
    games,
    myAliases,
    readGame,
    createGame,
  }
})
