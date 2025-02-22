import { HomeView } from 'features__top__views.web.vue'
import { firstValueFrom } from 'rxjs'
import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalizedGeneric,
} from 'vue-router'

import { diContainer } from 'di'
import { type IAuthViewModel, UserTypes } from 'features__user__view-models'
import { AuthView } from 'features__user__views.web.vue'
import { paths } from 'shared__constants'

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
  ],
})

const redirectIfNotSignedIn = async (
  to: RouteLocationNormalizedGeneric,
  from: RouteLocationNormalizedGeneric,
  next: NavigationGuardNext
): Promise<void> => {
  const authViewModel = diContainer.get<IAuthViewModel>(UserTypes.AuthViewModel)
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
}

router.beforeEach(async (to, from, next) => {
  await redirectIfNotSignedIn(to, from, next)
  next()
})

export default router
