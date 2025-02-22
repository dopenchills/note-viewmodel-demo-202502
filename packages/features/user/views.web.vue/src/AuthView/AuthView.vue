<template>
  <top-bar-layout>
    <div class="auth-container">
      <tab-group
        v-model="type"
        :tabs="tabs"
        label="Authentication options"
      />
      <div class="tab-content" role="tabpanel">
        <sign-in 
          v-if="type === 'sign-in'" 
          @sign-in="handleSignIn"
          @update:name="handleNameUpdate"
          @update:email="handleEmailUpdate"
          @update:password="handlePasswordUpdate"
        />
        <sign-up 
          v-else 
          @sign-up="handleSignUp"
          @update:name="handleNameUpdate"
          @update:email="handleEmailUpdate"
          @update:password="handlePasswordUpdate"
          @update:confirmPassword="handleConfirmPasswordUpdate"
        />
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

interface AuthForm {
  name: string
  email: string
  password: string
}

const handleSignIn = (form: AuthForm) => {
  // TODO: Implement sign in logic
  console.log('Sign in:', form)
}

const handleSignUp = (form: AuthForm) => {
  // TODO: Implement sign up logic
  console.log('Sign up:', form)
}

const handleNameUpdate = (value: string) => {
  console.log('Name updated:', value)
}

const handleEmailUpdate = (value: string) => {
  console.log('Email updated:', value)
}

const handlePasswordUpdate = (value: string) => {
  console.log('Password updated:', value)
}

const handleConfirmPasswordUpdate = (value: string) => {
  console.log('Confirm password updated:', value)
}
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
