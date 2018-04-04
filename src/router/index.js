import Vue from 'vue'
import Router from 'vue-router'
import Login from '../Login'
import MainnPage from '../MainPage.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    }, {
      path: '/MainPage',
      name: 'MainPage',
      component: MainnPage
    }
  ]
})
