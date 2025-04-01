<template>
  <top-bar-layout>
    <div class="home-content">
      <h2>Welcome to Note App!</h2>
      <p class="description">
        A simple and intuitive note-taking application to help you organize your thoughts.
      </p>
      <div class="action-buttons">
        <button class="primary-button" @click="router.push(paths.notes)">View Your Notes</button>
      </div>
    </div>
  </top-bar-layout>
</template>

<script setup lang="ts">
import { TopBarLayout } from 'src/features/shared/views.web.vue/layouts'
import { paths } from 'src/shared/constants'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style scoped>
.home-content {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.description {
  color: #5c6c7c;
  font-size: 1.2rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.action-buttons {
  margin-top: 2rem;
}

.primary-button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  border-radius: 6px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.2s;
}

.primary-button:hover {
  background-color: #2980b9;
  transform: translateY(-1px);
}

.primary-button:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .home-content {
    padding: 1.5rem;
  }

  h2 {
    font-size: 2rem;
  }

  .description {
    font-size: 1rem;
    padding: 0 1rem;
  }
}
</style>
