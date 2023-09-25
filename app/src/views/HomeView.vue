<script setup lang="ts">
import { computed, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/vue/24/outline'
import { useGamesStore } from '@/stores/game'
import router from '@/router'

const gamesStore = useGamesStore()

const isCreateModalShown = ref(false)

const createForm = ref({
  errors: null as Record<string, string>[] | null,
  data: {
    participantName: '',
    participantRole: 'player' as 'player' | 'spectator',
  },
})

const createFormHasErrors = computed(() => {
  if (!createForm.value.errors) {
    return false
  }

  return createForm.value.errors.length > 0
})

function showCreateModal() {
  isCreateModalShown.value = true
}

function hideCreateModal() {
  isCreateModalShown.value = false
}

async function handleCreateSubmit() {
  const res: any = await gamesStore.createGame(
    createForm.value.data.participantName,
    createForm.value.data.participantRole,
  )
  createForm.value.errors = res.errors

  if (!res.errors) {
    hideCreateModal()
    router.push({ name: 'game', params: { gameId: res.game.id } })
  }
}

function handleCreateCancel() {
  hideCreateModal()
}
</script>

<template>
  <main>
    <div>
      <h1>TicTacToe Cubed</h1>

      <button @click="showCreateModal">Create a game</button>

      <TransitionRoot
        as="template"
        :show="isCreateModalShown"
      >
        <Dialog
          as="div"
          class="relative z-10"
          @close="handleCreateCancel"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="ease-in duration-200"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 sm:p-0">
              <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enter-to="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leave-from="opacity-100 translate-y-0 sm:scale-100"
                leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel
                  class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                >
                  <div
                    class="flex flex-col items-center gap-4 bg-white px-4 pb-4 pt-5 sm:flex-row sm:items-start sm:p-6 sm:pb-4"
                  >
                    <div
                      class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                    >
                      <ExclamationTriangleIcon
                        class="h-6 w-6 text-red-600"
                        aria-hidden="true"
                      />
                    </div>
                    <div class="flex flex-col grow w-full items-center sm:items-start">
                      <DialogTitle
                        as="h3"
                        class="text-base font-semibold leading-6 text-gray-900"
                      >
                        Create a game
                      </DialogTitle>
                      <div class="flex flex-col grow w-full space-y-4">
                        <div
                          v-if="createFormHasErrors"
                          id="participantName-error"
                          class="mt-2 text-sm text-red-600"
                        >
                          <ul class="list-disc pl-5 space-y-1">
                            <li
                              v-for="error in createForm.errors"
                              :key="error.field"
                            >
                              {{ error.message }}
                            </li>
                          </ul>
                        </div>

                        <div>
                          <label
                            for="participantName"
                            class="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Your Name
                          </label>
                          <div class="relative mt-2 rounded-md shadow-sm">
                            <input
                              v-model="createForm.data.participantName"
                              type="text"
                              name="participantName"
                              id="participantName"
                              class="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                              :class="{
                                'text-gray-900 ring-gray-300 placeholder:text-gray-400 focus:ring-indigo-600 ':
                                  !createFormHasErrors,
                                'text-red-900 ring-red-300 placeholder:text-red-300 focus:ring-red-500':
                                  createFormHasErrors,
                              }"
                              placeholder="icebear"
                              :aria-invalid="createFormHasErrors"
                              :aria-describedby="
                                createFormHasErrors ? 'participantName-error' : undefined
                              "
                            />
                            <div
                              v-if="createFormHasErrors"
                              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                              <ExclamationCircleIcon
                                class="h-5 w-5 text-red-500"
                                aria-hidden="true"
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label
                            for="participantRole"
                            class="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Role
                          </label>
                          <select
                            v-model="createForm.data.participantRole"
                            id="participantRole"
                            name="participantRole"
                            class="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          >
                            <option
                              value="player"
                              selected
                            >
                              Player
                            </option>
                            <option value="spectator">Spectator</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                      @click="handleCreateSubmit"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      @click="handleCreateCancel"
                      ref="cancelButtonRef"
                    >
                      Cancel
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </main>
</template>
