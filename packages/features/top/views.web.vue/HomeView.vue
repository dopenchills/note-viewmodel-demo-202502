<template>
  <top-bar-layout>
    <p>Welcome to the Note App!</p>
    <button @click="router.push(paths.notes)">Your Notes</button>
  </top-bar-layout>
</template>

<script setup lang="ts">
import { TopBarLayout } from 'features__shared__views.web.vue/layouts'
import { paths } from 'shared__constants'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>
