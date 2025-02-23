<template>
  <top-bar-layout>
    <div class="create-note-container">
      <h2>Create New Note</h2>

      <form class="note-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Title</label>
          <input
            id="title"
            :value="title"
            type="text"
            :disabled="isBusy"
            class="form-control"
            @input="
              (event: Event) =>
                createNoteViewModel.setTitle((event.target as HTMLInputElement).value)
            "
          />
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea
            id="content"
            :value="content"
            :disabled="isBusy"
            class="form-control"
            rows="6"
            @input="
              (event: Event) =>
                createNoteViewModel.setContent((event.target as HTMLTextAreaElement).value)
            "
          ></textarea>
        </div>

        <div v-if="errorMessages.length > 0" class="error-messages">
          <p v-for="(error, index) in errorMessages" :key="index" class="error">
            {{ error }}
          </p>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" @click="cancel">Cancel</button>
          <button type="submit" :disabled="isBusy" class="submit-button">
            {{ isBusy ? 'Creating...' : 'Create Note' }}
          </button>
        </div>
      </form>
    </div>
  </top-bar-layout>
</template>

<script setup lang="ts">
import { diContainer } from 'di'
import type { ICreateNoteViewModel } from 'features__note__view-models'
import { NoteTypes } from 'features__note__view-models'
import { useObservableProps } from 'features__shared__views.web.vue/composables'
import { TopBarLayout } from 'features__shared__views.web.vue/layouts'
import { paths } from 'shared__constants'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const createNoteViewModel = diContainer.get<ICreateNoteViewModel>(NoteTypes.CreateNoteViewModel)

const title = useObservableProps(createNoteViewModel, 'title$')
const content = useObservableProps(createNoteViewModel, 'content$')
const errorMessages = useObservableProps(createNoteViewModel, 'errorMessages$')
const isBusy = useObservableProps(createNoteViewModel, 'isBusy$')

const handleSubmit = async () => {
  await createNoteViewModel.createNote()
  if (errorMessages.value.length === 0) {
    router.push(paths.notes)
  }
}

const cancel = () => {
  router.push(paths.notes)
}

onMounted(async () => {
  await createNoteViewModel.load()
})

onUnmounted(async () => {
  await createNoteViewModel.unload()
})
</script>

<style scoped lang="scss">
.create-note-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;

  h2 {
    margin-bottom: 2rem;
    text-align: center;
  }
}

.note-form {
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
}

.form-control {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
}

.error-messages {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #ffebee;
  border-radius: 0.5rem;

  .error {
    color: #d32f2f;
    margin: 0.25rem 0;
  }
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.submit-button,
.cancel-button {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.submit-button {
  background-color: #4caf50;
  color: white;
  border: none;

  &:hover:not(:disabled) {
    background-color: #45a049;
  }
}

.cancel-button {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #666;

  &:hover {
    background-color: #f5f5f5;
  }
}
</style>
