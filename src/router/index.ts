import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/btree',
      name: 'btree',
      component: () => import('../views/BTreeView.vue'),
    },
    {
      path: '/bst',
      name: 'bst',
      component: () => import('../views/BSTView.vue'),
    },
  ],
})

export default router
