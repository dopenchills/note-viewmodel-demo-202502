import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { paths } from 'shared__constants'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: paths.top,
      name: 'home',
      component: HomeView
    }
  ]
})

export default router
