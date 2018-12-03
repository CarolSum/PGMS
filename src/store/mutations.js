export const SET_INFO = 'SET_INFO'
export const CLEAN_INFO = 'CLEAN_INFO'
export const SWITCH_SYSTEM = 'SWITCH_SYSTEM'

export default {
  [SET_INFO] (state, info) {
    console.log(info)
    state.isAuthenticated = info.isAuthenticated || null
    state.userType = info.userType || null
    state.name = info.name || null
  },

  [CLEAN_INFO] (state) {
    state.isAuthenticated = false
    state.userType = undefined
    state.name = undefined
  },

  [SWITCH_SYSTEM] (state, theNew) {
    state.activeSubsystem = theNew
  }
}
