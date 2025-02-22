<template>
  <auth-form
    mode="sign-up"
    @submit="$emit('sign-up', $event)"
    @update:name="$emit('update:name', $event)"
    @update:email="$emit('update:email', $event)"
    @update:password="$emit('update:password', $event)"
    @update:confirmPassword="$emit('update:confirmPassword', $event)"
  />
</template>

<script setup lang="ts">
import AuthForm from './AuthForm.vue'

interface SignUpForm {
  name: string
  email: string
  password: string
}

defineEmits<{
  (e: 'sign-up', form: SignUpForm): void
  (e: 'update:name', value: string): void
  (e: 'update:email', value: string): void
  (e: 'update:password', value: string): void
  (e: 'update:confirmPassword', value: string): void
}>()
</script>
