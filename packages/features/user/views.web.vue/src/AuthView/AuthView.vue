<template>
  <top-bar-layout>
    <div class="auth-container">
      <tab-group
        v-model="type"
        :tabs="tabs"
        label="Authentication options"
      />
      <div class="tab-content" role="tabpanel">
        <sign-in v-if="type === 'sign-in'" />
        <sign-up v-else />
      </div>
    </div>
  </top-bar-layout>
</template>

<script setup lang="ts">
import { TopBarLayout } from 'features__shared__views.web.vue/layouts'
import { ref } from 'vue'
import SignIn from './SignIn.vue'
import SignUp from './SignUp.vue'
import TabGroup from './TabGroup.vue'

type AuthType = 'sign-in' | 'sign-up'
const type = ref<AuthType>('sign-in')

const tabs: { label: string; value: AuthType }[] = [
  { label: 'Sign In', value: 'sign-in' },
  { label: 'Sign Up', value: 'sign-up' }
]
</script>

<style scoped lang="scss">
.auth-container {
  margin: 2rem auto;
  padding: 0 1rem;
}

.tab-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
}
</style>
