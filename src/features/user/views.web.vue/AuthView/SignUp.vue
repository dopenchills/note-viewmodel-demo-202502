<template>
  <auth-form
    mode="sign-up"
    @submit="$emit('sign-up', $event)"
    @update:name="$emit('update:name', $event)"
    @update:password="$emit('update:password', $event)"
  />
</template>

<script setup lang="ts">
import AuthForm from 'src/features/user/views.web.vue/AuthView/AuthForm.vue'

interface SignUpForm {
  name: string
  password: string
}

defineEmits<{
  (e: 'sign-up', form: SignUpForm): void
  (e: 'update:name', value: string): void
  (e: 'update:password', value: string): void
}>()
</script>
