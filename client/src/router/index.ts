import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

import { getProduct } from '@/data/products'
import HomePage from '@/views/HomePage.vue'
import NotFound from '@/views/NotFound.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import ProductsPage from '@/views/ProductsPage.vue'
import SupportPage from '@/views/SupportPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { title: 'Home' },
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductsPage,
    meta: { title: 'Collections' },
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta: { title: 'Piece' },
    beforeEnter: (to) => (getProduct(String(to.params.id)) ? true : { name: 'NotFound' }),
  },
  {
    path: '/support',
    name: 'Support',
    component: SupportPage,
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
  const productTitle =
    to.name === 'ProductDetail' ? getProduct(String(to.params.id))?.name : undefined
  const title = productTitle ?? (typeof to.meta.title === 'string' ? to.meta.title : '')

  document.title = title ? `${title} · Diamond Shop` : 'Diamond Shop'
})

export default router
