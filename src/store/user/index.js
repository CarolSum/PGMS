import {
  IS_LOGIN,
  LOG_IN,
  MODIFY_ROLE
} from './contants'


export default {
  namespaced: true,
  state: () => ({
    isLogin: true
  }),
  mutations: {
    [MODIFY_ROLE] (state, payload) {

    }
  },
  getters: {
    [IS_LOGIN] (state) {
      return state.isLogin;
    }
  },
  actions: {
    [LOG_IN] ({ commit, state, dispatch }, payload) {

    }
  }
}
