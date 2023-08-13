import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'default',
      component: () => import('../views/DefaultView.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '/',
          name: 'dashboard',
          component: () => import('../views/HomeView.vue')
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('../views/UsersView.vue')
        },
        {
          path: '/suites',
          name: 'suites',
          component: () => import('../views/SuiteView.vue')
        },
        {
          path: '/reports',
          name: 'reports',
          component: () => import('../views/ReportsView.vue')
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('../views/ProfileView.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { loginRedirect: true }
    }
  ]
})

router.beforeEach(async (to) => {
  await store.dispatch("onStart");
  if (to.meta.requiresAuth && !store.state.isAuthenticated) {
    return {
      path: '/login'
    }
  }
  if (to.meta.loginRedirect && store.state.isAuthenticated) {
    return {
      path: '/'
    }
  }
})

export default router
