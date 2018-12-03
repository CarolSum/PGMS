import axios from 'axios'
import { stringify } from 'querystring'
import { throwErrorIfExists } from '../util/apiHelper'

const ROOT = '/api/puser/'

/**
 * Login with a post to login url with the data {username, password, remember}.
 * If login succeeds, the promise will be resolved.
 * Otherwise the promise will be rejected.
 * @param {string} username The username of the user.
 * @param {string} password The password of the user.
 * @param {boolean} [remember=false]
 * Tell the server whether to remember the session.
 * Session will be deprecated in 30 minutes if this parameter is set to false or left blank.
 * @return {Promise}
 */
// 异步操作
export async function login (username, password, remember = true) {
  let response = await axios.post(ROOT + 'login/', stringify({username, password, remember}))
  throwErrorIfExists(response)
}

/**
 * Logout current session.
 * If logout successfully, the promise will be resolved.
 * Otherwise the promise will be rejected.
 * @return {Promise}
 */
export async function logout () {
  return axios.get(ROOT + 'logout/')
}

/**
 * Fetch the basic information of the user bound to current session, including the user's name and type.
 * @returns {Promise}
 */
export async function getInfo () {
  let response = await axios.get(ROOT + 'info/')
  console.log(response)
  return {
    isAuthenticated: response.data['is_authenticated'],
    name: response.data['name'],
    userType: response.data['user_type']
  }
}

/**
 * Reserved API for new user's registration.
 * Register with a post to register url with the data {username, password, name, email}.
 * If registration succeeds, the promise will be resolved.
 * Otherwise the promise will be rejected.
 * @param {string} username The username of new user.
 * @param {string} password The password of new user.
 * @param {string} name The name of new user.
 * @param {string} email The email of new user.
 * @return {Promise}
 */
export async function userRegister (username, password, name, email) {
  let response = await axios.post(ROOT + 'register/', stringify({username, password, name, email}))
  throwErrorIfExists(response)
}

/**
 * Change password of current user with a post to change-password url with the data {oldPassword, newPassword}.
 * If password changing succeeds, the promise will be resolved.
 * Otherwise the promise will be rejected.
 * @param {string} oldPassword The current password of user.
 * @param {string} newPassword The password to be used after change.
 * @return {Promise}
 */
export async function changePassword (oldPassword, newPassword) {
  let response = await axios.post(ROOT + 'change_password/', stringify({
    'old_password': oldPassword,
    'new_password': newPassword
  }))
  throwErrorIfExists(response)
}

/**
 * Set new email for current user with a post to set-email url with the data {email}.
 * If new email is set successfully, the promise will be resolved.
 * Otherwise the promise will be rejected.
 * @param {string} email The new e-mail to be set.
 * @return {Promise}
 */
export async function setEmail (email) {
  let response = await axios.post(ROOT + 'set_email/', stringify({email}))
  throwErrorIfExists(response)
}
