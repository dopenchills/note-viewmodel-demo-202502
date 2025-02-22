<template>
  <top-bar-layout>
    <div class="auth-container">
      <nav class="tab" role="tablist" aria-label="Authentication options">
        <button
          class="tab-item"
          role="tab"
          :aria-selected="type === 'sign-in'"
          :class="{ active: type === 'sign-in' }"
          @click="type = 'sign-in'"
        >
          Sign In
        </button>
        <button
          class="tab-item"
          role="tab"
          :aria-selected="type === 'sign-up'"
          :class="{ active: type === 'sign-up' }"
          @click="type = 'sign-up'"
        >
          Sign Up
        </button>
      </nav>
      <div class="tab-content" role="tabpanel">
        <sign-in v-if="type === 'sign-in'" />
        <sign-up v-else />
      </div>
    </div>
  </top-bar-layout>
</template>

<style scoped lang="scss">
.auth-container {
  margin: 2rem auto;
  padding: 0 1rem;
}

.tab {
  display: grid;
  grid-template-columns: 1fr 1fr;
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

.tab-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
}
</style>

<script setup lang="ts">
import { TopBarLayout } from 'features__shared__views.web.vue/layouts'
import { ref } from 'vue';
import SignIn from './SignIn.vue'
import SignUp from './SignUp.vue'

type AuthType = 'sign-in' | 'sign-up'
const type = ref<AuthType>('sign-in')
</script>
