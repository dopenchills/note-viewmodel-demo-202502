import { createRouter, createWebHistory } from 'vue-router'
import { HomeView } from 'features__top__views.web.vue'

import { paths } from 'shared__constants'
import { AuthView } from 'features__user__views.web.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: paths.top,
      component: HomeView
    },
    {
      path: paths.auth,
      component: AuthView
    }
  ]
})

export default router
