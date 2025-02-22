<template>
  <div class="top-bar-layout">
    <div class="top-bar">
      <h1>{{ title }}</h1>
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
}>(), {
  title: 'Note App (ViewModel Demo)'
})
</script>

<style scoped>
.top-bar-layout {
  display: flex;
  flex-direction: column;
}

.top-bar {
  background-color: #f8f9fa;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.top-bar h1 {
  margin: 0;
  font-size: 1.5rem;
}
</style>