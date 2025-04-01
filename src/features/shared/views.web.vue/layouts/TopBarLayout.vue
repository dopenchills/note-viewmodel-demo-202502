<template>
  <div class="top-bar-layout">
    <div class="top-bar">
      <h1 @click="router.push(paths.top)">{{ title }}</h1>
    </div>
    <div class="content">
      <main>
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { paths } from 'src/shared/constants'

const router = useRouter()

withDefaults(
  defineProps<{
    title?: string
  }>(),
  {
    title: 'Note App (ViewModel Demo)',
  }
)
</script>

<style scoped>
.top-bar-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.top-bar {
  background-color: #ffffff;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-bar h1 {
  margin: 0;
  font-size: 1.5rem;
  color: #2c3e50;
  cursor: pointer;
}

.content {
  display: flex;
  justify-content: center;
  flex: 1;
  padding: 2rem 1rem;
}

.content main {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .top-bar {
    padding: 1rem;
  }

  .content {
    padding: 1rem 0.5rem;
  }
}
</style>
