import { createRouter, createWebHistory } from 'vue-router'
import BulkImportView from '../views/BulkImportView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [


    {
      path: '/',
      component: () => import('@/layouts/default/Default.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          // route level code-splitting
          // this generates a separate chunk (Home-[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: BulkImportView,
        },

        {
          path: '/login',
          name: 'login',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/LoginView.vue')
        },

        {
          path: '/bulk',
          name: 'bulk',
       
          component: () => import('../views/BulkImportView.vue')
        }
      ],
    },


  
  ]
})

export default router
