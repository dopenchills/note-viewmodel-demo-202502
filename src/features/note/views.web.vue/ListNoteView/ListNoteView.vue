<template>
  <top-bar-layout>
    <div class="note-list-container">
      <div class="search-bar">
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search notes..."
          class="search-input"
          @input="
            (event: Event) => {
              listNoteViewModel.setSearchQuery((event.target as HTMLInputElement).value)
              listNoteViewModel.search()
            }
          "
        />
      </div>

      <div v-if="isBusy" class="loading">Loading...</div>

      <div v-else class="notes-grid">
        <div v-for="note in notes" :key="note.id" class="note-card">
          <h3>{{ note.title }}</h3>
          <p>{{ note.content }}</p>
          <div class="note-footer">
            <span class="author">By {{ note.userName }}</span>
            <span class="date">{{ formatDate(note.createdAt) }}</span>
          </div>
        </div>
      </div>

      <button class="create-button" @click="router.push(paths.createNote)">Create New Note</button>
    </div>
  </top-bar-layout>
</template>

<script setup lang="ts">
import { diContainer } from 'src/di/inversify.config.ts'
import type { IListNoteViewModel } from 'src/features/note/view-models'
import { NoteTypes } from 'src/features/note/view-models'
import { useObservableProps } from 'src/features/shared/views.web.vue/composables'
import { TopBarLayout } from 'src/features/shared/views.web.vue/layouts'
import { paths } from 'src/shared/constants'
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const listNoteViewModel = diContainer.get<IListNoteViewModel>(NoteTypes.ListNoteViewModel)

const searchQuery = useObservableProps(listNoteViewModel, 'searchQuery$')
const notes = useObservableProps(listNoteViewModel, 'notes$')
const isBusy = useObservableProps(listNoteViewModel, 'isBusy$')

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}

onMounted(async () => {
  await listNoteViewModel.load()
})

onUnmounted(async () => {
  await listNoteViewModel.unload()
})
</script>

<style scoped lang="scss">
.note-list-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.search-bar {
  margin-bottom: 2rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  font-size: 1rem;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.note-card {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 1rem;
    font-size: 1.25rem;
  }

  p {
    margin: 0 0 1rem;
    color: #666;
  }
}

.note-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #666;
}

.create-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  padding: 1rem 2rem;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 2rem;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: #45a049;
  }
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
