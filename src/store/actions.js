import { getInfo } from '../api/p-user'
import * as mutations from '../store/mutations'

export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const GET_INFO = 'GET_INFO'
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD'

export default {
  [GET_INFO] ({commit}) {
    return getInfo().then(data => commit(mutations.SET_INFO, data))
  }
}
