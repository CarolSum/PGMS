import { getInfo, login, logout, changePassword } from '../api/p-user'
import * as mutations from '../store/mutations'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const GET_INFO = 'GET_INFO'
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD'

export default {
  [LOGIN] ({commit, dispatch}, {username, password, remember}) {
    return login(username, password, remember).then(() => dispatch(GET_INFO))
  },

  [LOGOUT] ({commit}) {
    return logout().then(() => commit(mutations.CLEAN_INFO))
  },

  [GET_INFO] ({commit}) {
    return getInfo().then(data => commit(mutations.SET_INFO, data))
  },

  [CHANGE_PASSWORD] ({commit, dispatch}, {oldPassword, newPassword}) {
    return changePassword(oldPassword, newPassword)
  }
}
