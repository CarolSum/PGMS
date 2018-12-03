import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import store from '../store/index'
import { SWITCH_SYSTEM } from '../store/mutations'
import { GET_INFO } from '../store/actions'
import { failAlert } from '../util/notification'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes,
  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE
})

router.beforeEach((to, from, next) => {
  store.dispatch(GET_INFO)
    .catch(() => {
      failAlert({info: '获取用户信息失败'})
    })
    .finally(() => {
      for (let matched of to.matched) {
        if (matched.meta && matched.meta['subsystemName'] &&
          matched.meta['subsystemName'] !== store.state.activeSubsystem) {
          store.commit(SWITCH_SYSTEM, matched.meta['subsystemName'])
        }
      }
      if (to.matched.some(record => record.meta['requireAuth'])) {
        if (!store.state.isAuthenticated) {
          next({
            path: '/login'
          })
        }
      }
      next()
    })
})

export default router
