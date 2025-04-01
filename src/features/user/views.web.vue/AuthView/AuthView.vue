<template>
  <top-bar-layout>
    <div class="auth-container">
      <tab-group v-model="type" :tabs="tabs" label="Authentication options" />
      <div class="tab-content" role="tabpanel">
        <sign-in
          v-if="type === 'sign-in'"
          :error-messages="signInErrorMessages"
          @sign-in="signInViewModel.signIn()"
          @update:name="signInViewModel.setName($event)"
          @update:password="signInViewModel.setPassword($event)"
        />
        <sign-up
          v-else
          @sign-up="
            () => {
              signUpViewModel.signUp()
              type = 'sign-in'
            }
          "
          @update:name="signUpViewModel.setName($event)"
          @update:password="signUpViewModel.setPassword($event)"
        />
      </div>
    </div>
  </top-bar-layout>
</template>

<script setup lang="ts">
import { diContainer } from 'src/di/inversify.config.ts'
import { useObservableProps } from 'src/features/shared/views.web.vue/composables'
import { TopBarLayout } from 'src/features/shared/views.web.vue/layouts'
import type {
  IAuthViewModel,
  ISignInViewModel,
  ISignUpViewModel,
} from 'src/features/user/view-models'
import { UserTypes } from 'src/features/user/view-models'
import { paths } from 'src/shared/constants'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import SignIn from 'src/features/user/views.web.vue/AuthView/SignIn.vue'
import SignUp from 'src/features/user/views.web.vue/AuthView/SignUp.vue'
import TabGroup from 'src/features/user/views.web.vue/AuthView/TabGroup.vue'

type AuthType = 'sign-in' | 'sign-up'
const type = ref<AuthType>('sign-in')

const tabs: { label: string; value: AuthType }[] = [
  { label: 'Sign In', value: 'sign-in' },
  { label: 'Sign Up', value: 'sign-up' },
]

const router = useRouter()

const authViewModel = diContainer.get<IAuthViewModel>(UserTypes.AuthViewModel)
const signInViewModel = diContainer.get<ISignInViewModel>(UserTypes.SignInViewModel)
const signUpViewModel = diContainer.get<ISignUpViewModel>(UserTypes.SignUpViewModel)

const isSignedIn = useObservableProps(authViewModel, 'isSignedIn$')
const signInErrorMessages = useObservableProps(signInViewModel, 'errorMessages$')
watch(
  isSignedIn,
  (_isSignedIn) => {
    if (_isSignedIn) {
      router.push(paths.top)
    }
  },
  { immediate: true }
)

onMounted(async () => {
  await authViewModel.load()
  await signInViewModel.load()
  await signUpViewModel.load()
})

onUnmounted(async () => {
  await authViewModel.unload()
  await signInViewModel.unload()
  await signUpViewModel.unload()
})
</script>

<style scoped lang="scss">
.auth-container {
  margin: 2rem auto;
  padding: 0 1rem;
  max-width: 480px;
  width: 100%;
}

.tab-content {
  background-color: white;
  border-radius: 0.5rem;
  padding: 2rem;
}
</style>
