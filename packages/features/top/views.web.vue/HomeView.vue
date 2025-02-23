<template>
  <main>
    <h1>Note App</h1>
    <p>Welcome to the Note App!</p>
    <button @click="router.push(paths.notes)">Your Notes</button>
  </main>
</template>

<script setup lang="ts">
import { paths } from 'shared__constants'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
