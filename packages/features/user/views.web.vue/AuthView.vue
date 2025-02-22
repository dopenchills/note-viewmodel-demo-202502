<template>
  <top-bar-layout>
    <div>
      <h1>{{ title }}</h1>
    </div>
  </top-bar-layout>
</template>

<script setup lang="ts">
import { TopBarLayout } from 'features__shared__views.web.vue/layouts'
import { computed, ref } from 'vue';

const type = ref<'sign-in' | 'sign-up'>('sign-in')
const title = computed(() => type.value === 'sign-in' ? 'Sign In' : 'Sign Up')
</script>
