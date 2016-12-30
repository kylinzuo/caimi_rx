import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'ts',
      component: require('components/Tschart')
    },
    {
      path: '/k',
      name: 'k',
      component: require('components/Kchart')
    },
    {
      path: '/9k',
      name: '9k',
      component: require('components/Kchart9')
    }
  ]
})

window.router = router

export default router
