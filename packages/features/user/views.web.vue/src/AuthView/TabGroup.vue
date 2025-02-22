<template>
  <nav class="tab" role="tablist" :aria-label="label">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      class="tab-item"
      role="tab"
      :aria-selected="modelValue === tab.value"
      :class="{ active: modelValue === tab.value }"
      @click="$emit('update:modelValue', tab.value)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>

<script setup lang="ts" generic="T extends PropertyKey">
interface Tab<T> {
  label: string
  value: T
}

defineProps<{
  modelValue: T
  tabs: Tab<T>[]
  label: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: T): void
}>()
</script>

<style scoped lang="scss">
.tab {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  gap: 1px;
  background-color: #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.25rem;
  margin-bottom: 2rem;
}

.tab-item {
  text-align: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  background: none;
  border: none;
  border-radius: 0.375rem;
  color: #4b5563;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(.active) {
    background-color: rgba(255, 255, 255, 0.5);
    color: #3b82f6;
  }

  &.active {
    background-color: white;
    color: #3b82f6;
    font-weight: 600;
  }
}
</style>
