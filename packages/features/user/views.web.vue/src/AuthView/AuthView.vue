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
          @sign-in="signInViewModel.signIn()"
          @update:name="signInViewModel.setName($event)"
          @update:email="signInViewModel.setEmail($event)"
          @update:password="signInViewModel.setPassword($event)"
        />
        <sign-up 
          v-else 
          @sign-up="signUpViewModel.signUp()"
          @update:name="signUpViewModel.setName($event)"
          @update:email="signUpViewModel.setEmail($event)"
          @update:password="signUpViewModel.setPassword($event)"
          @update:confirmPassword="signUpViewModel.setConfirmPassword($event)"
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
import { diContainer } from 'di'
import { IAuthViewModel, ISignInViewModel, ISignUpViewModel, UserTypes } from 'features__user__view-models'

type AuthType = 'sign-in' | 'sign-up'
const type = ref<AuthType>('sign-in')

const tabs: { label: string; value: AuthType }[] = [
  { label: 'Sign In', value: 'sign-in' },
  { label: 'Sign Up', value: 'sign-up' }
]

const authViewModel = diContainer.get<IAuthViewModel>(UserTypes.AuthViewModel)
const signInViewModel = diContainer.get<ISignInViewModel>(UserTypes.SignInViewModel)
const signUpViewModel = diContainer.get<ISignUpViewModel>(UserTypes.SignUpViewModel)
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
