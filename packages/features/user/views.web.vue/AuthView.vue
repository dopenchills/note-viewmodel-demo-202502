<template>
  <top-bar-layout>
    <div>
      <div class="tab">
        <div
          class="tab-item"
          :class="{ active: type === 'sign-in' }"
          @click="type = 'sign-in'"
        >
          Sign In
        </div>
        <div
          class="tab-item"
          :class="{ active: type === 'sign-up' }"
          @click="type = 'sign-up'"
        >
          Sign Up
        </div>
      </div>
      <sign-in v-if="type === 'sign-in'" />
      <sign-up v-else/>
    </div>
  </top-bar-layout>
</template>

<style scoped lang="scss">
.tab {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.tab-item {
  text-align: center;
  padding: 10px;
  cursor: pointer;
}
</style>

<script setup lang="ts">
import { TopBarLayout } from 'features__shared__views.web.vue/layouts'
import { ref } from 'vue';
import SignIn from './SignIn.vue'
import SignUp from './SignUp.vue'

const type = ref<'sign-in' | 'sign-up'>('sign-in')
</script>
