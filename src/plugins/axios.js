import axios from 'axios'

// axios CSRF configuration.
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.xsrfCookieName = 'csrftoken'

export default ({ Vue }) => {
  Vue.prototype.$axios = axios
}
