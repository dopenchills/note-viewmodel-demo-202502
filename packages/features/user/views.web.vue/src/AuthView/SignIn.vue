<template>
  <auth-form
    mode="sign-in"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import AuthForm from './AuthForm.vue'

const handleSubmit = (form: { name: string; email: string; password: string }) => {
  // TODO: Implement sign in logic
  console.log('Sign in:', form)
}
</script>
