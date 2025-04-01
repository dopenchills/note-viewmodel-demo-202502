<template>
  <auth-form
    mode="sign-in"
    @submit="$emit('sign-in', $event)"
    @update:name="$emit('update:name', $event)"
    @update:password="$emit('update:password', $event)"
  />
</template>

<script setup lang="ts">
import AuthForm from 'src/features/user/views.web.vue/AuthView/AuthForm.vue'

interface SignInForm {
  name: string
  password: string
}

defineEmits<{
  (e: 'sign-in', form: SignInForm): void
  (e: 'update:name', value: string): void
  (e: 'update:password', value: string): void
}>()
</script>
