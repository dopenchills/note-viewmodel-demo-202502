<template>
  <form class="form" @submit.prevent="emit('submit', form)">
    <div class="form-group">
      <label for="name">Name</label>
      <input
        id="name"
        v-model="form.name"
        type="text"
        required
        class="input"
        placeholder="Enter your name"
        @input="emit('update:name', form.name)"
      />
    </div>
    <div v-if="mode === 'sign-up'" class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        required
        class="input"
        placeholder="Enter your email"
        @input="emit('update:email', form.email)"
      />
    </div>
    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        required
        class="input"
        :placeholder="mode === 'sign-up' ? 'Create a password' : 'Enter your password'"
        @input="emit('update:password', form.password)"
      />
    </div>
    <div v-if="errorMessages?.length" class="error-messages">
      <p v-for="(error, index) in errorMessages" :key="index" class="error-message">
        {{ error }}
      </p>
    </div>
    <button type="submit" class="submit-button">
      {{ submitText }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'

const props = withDefaults(
  defineProps<{
    mode: 'sign-in' | 'sign-up'
    errorMessages?: string[]
  }>(),
  {
    errorMessages: () => [],
  }
)

interface AuthForm {
  name: string
  email: string
  password: string
}

const form = reactive<AuthForm>({
  name: '',
  email: '',
  password: '',
})

const submitText = computed(() => (props.mode === 'sign-up' ? 'Sign Up' : 'Sign In'))

const emit = defineEmits<{
  (e: 'submit', form: AuthForm): void
  (e: 'update:name', value: string): void
  (e: 'update:email', value: string): void
  (e: 'update:password', value: string): void
}>()
</script>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
  }
}

.input {
  padding: 0.625rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }
}

.error-messages {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin: 0;
}

.submit-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #2563eb;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
  }
}
</style>
