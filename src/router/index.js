import Vue from 'vue'
import VueRouter from 'vue-router'
import SketchMask from '../views/SketchMask.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: SketchMask
  }
]

const router = new VueRouter({
  routes
})

export default router
