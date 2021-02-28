import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import RegisterToEvent from './views/RegisterToEvent.vue'
import AddEvent from './views/AddEvent.vue'
import RegisterUser from './views/RegisterUser.vue'
import LoginUser from './views/LoginUser.vue'
import EventRegistrationActivity from './views/EventRegistrationActivity.vue'
import GetRelatedWorkers from './views/GetRelatedWorkers.vue'

import HomeMongo from './views/HomeMongo.vue'
import RegisterToEventMongo from './views/RegisterToEventMongo.vue'
import AddEventMongo from './views/AddEventMongo.vue'
import EventRegistrationActivityMongo from './views/EventRegistrationActivityMongo.vue'
import GetRelatedWorkersMongo from './views/GetRelatedWorkersMongo.vue'



Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/registertoevent',
      name: 'registertoevent',
      component: RegisterToEvent
      // meta: { requiresAuth: true }
    },
    {
      path: '/addanevent',
      name: 'addanevent',
      component: AddEvent
      // meta: { requiresAuth: true }
    },
    {
      path: '/mongohome',
      name: 'mongohome',
      component: HomeMongo
    },
    {
      path: '/registertoeventmongo',
      name: 'registertoeventmongo',
      component: RegisterToEventMongo
      // meta: { requiresAuth: true }
    },
    {
      path: '/addaneventmongo',
      name: 'addaneventmongo',
      component: AddEventMongo
      // meta: { requiresAuth: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterUser
    },
    {
      path: '/login',
      name: 'login',
      component: LoginUser
    },
    {
      path: '/registrationactivity',
      name: 'registrationactivity',
      component: EventRegistrationActivity
    },
    {
      path: '/relatedworkers',
      name: 'relatedworkers',
      component: GetRelatedWorkers
    },
    {
      path: '/registrationactivitymongo',
      name: 'registrationactivitymongo',
      component: EventRegistrationActivityMongo
    },
    {
      path: '/relatedworkersmongo',
      name: 'relatedworkersmongo',
      component: GetRelatedWorkersMongo
    }
  ]
})

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user')

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/')
  }
  next()
})

export default router
