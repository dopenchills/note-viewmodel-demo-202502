import { firstValueFrom } from 'rxjs'
import HomeView from 'src/features/top/views.web.vue/HomeView.vue'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalizedGeneric,
} from 'vue-router'

import { diContainer } from 'src/di/inversify.config.ts'
import CreateNoteView from 'src/features/note/views.web.vue/CreateNoteView/CreateNoteView.vue'
import ListNoteView from 'src/features/note/views.web.vue/ListNoteView/ListNoteView.vue'
import { UserTypes } from 'src/features/user/view-models/di/UserTypes'
import type { IAuthViewModel } from 'src/features/user/view-models/interfaces/IAuthViewModel'
import AuthView from 'src/features/user/views.web.vue/AuthView/AuthView.vue'
import { paths } from 'src/shared/constants/paths'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: paths.top,
      component: HomeView,
    },
    {
      path: paths.auth,
      name: 'auth',
      component: AuthView,
    },
    {
      path: paths.notes,
      component: ListNoteView,
    },
    {
      path: paths.createNote,
      component: CreateNoteView,
    },
  ],
})

const redirectIfNotSignedIn = async (
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
  next: NavigationGuardNext
): Promise<void> => {
  const authViewModel = diContainer.get<IAuthViewModel>(UserTypes.AuthViewModel)

  try {
    await authViewModel.load()

    const isSignedIn = await firstValueFrom(authViewModel.isSignedIn$)

    // Allow access to auth page when not signed in
    if (to.path === paths.auth) {
      if (isSignedIn) {
        next(paths.top)
      } else {
        next()
      }
      return
    }

    // Protect all other routes
    if (!isSignedIn) {
      next(paths.auth)
      return
    }
  } finally {
    await authViewModel.unload()
  }
}

router.beforeEach(async (to, from, next) => {
  await redirectIfNotSignedIn(to, from, next)
  next()
})

export default router
