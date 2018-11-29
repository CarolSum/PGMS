import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

import SignIn from './signin'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      isAuthenticated: true,
      name: '',
      userType: 'teacher',
      activeSubsystem: 'signIn'
    },
    getters,
    modules: {
      SignIn
    }
  })

  return Store
}
