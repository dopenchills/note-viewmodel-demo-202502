import { createRouter, createWebHistory } from 'vue-router'
import { HomeView } from 'features__top__views.web.vue'
import { paths } from 'shared__constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: paths.top,
      component: HomeView
    }
  ]
})

export default router
