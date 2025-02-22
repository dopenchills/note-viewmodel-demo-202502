<template>
  <auth-form
    mode="sign-up"
    @submit="handleSubmit"
  />
</template>

<script setup lang="ts">
import AuthForm from './AuthForm.vue'

const handleSubmit = (form: { name: string; email: string; password: string }) => {
  // TODO: Implement sign up logic
  console.log('Sign up:', form)
}
</script>
