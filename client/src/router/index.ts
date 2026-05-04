import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Home from '@/views/Home.vue'
import Products from '@/views/Products.vue'
import Support from '@/views/Support.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
  },
  {
    path: '/support',
    name: 'Support',
    component: Support,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    if (to.hash) {
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          const element = document.querySelector(to.hash)

          if (element) {
            resolve({
              el: to.hash,
              behavior: from.fullPath ? 'smooth' : 'auto',
              top: 0,
            })
            return
          }

          resolve({ top: 0 })
        })
      })
    }

    return { top: 0 }
  },
})

export default router
