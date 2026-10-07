import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'
import Products from '@/views/Products.vue'
import Support from '@/views/Support.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { title: 'Home' },
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { title: 'Collections' },
  },
  {
    path: '/support',
    name: 'Support',
    component: Support,
    meta: { title: 'Support' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { title: 'Page not found' },
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

router.afterEach((to) => {
  const title = typeof to.meta.title === 'string' ? to.meta.title : ''
  document.title = title ? `${title} · Diamond Shop` : 'Diamond Shop'
})

export default router
