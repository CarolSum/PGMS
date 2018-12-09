import Vue from 'vue'
import Vuex from 'vuex'
import signin from './signin'
import bichoice from './bichoice'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

// 模块放置在此对象中
const modules = {
  signin,
  bichoice
}

const Store = new Vuex.Store({
  state: {
    isAuthenticated: true,
    name: '',
    userType: 'teacher',
    activeSubsystem: 'signIn'
  },
  modules,
  actions,
  mutations,
  getters
})

export default Store
