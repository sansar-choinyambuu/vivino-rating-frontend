import Vue from 'vue'
import Router from 'vue-router'
import WineRater from '@/components/WineRater'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'WineRater',
      component: WineRater
    }
  ]
})
