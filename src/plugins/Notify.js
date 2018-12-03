import { Notify } from '../../node_modules/quasar-framework/dist/quasar.mat.esm.js'

export default ({ Vue }) => {
  Vue.prototype.$notify = Notify
  // Vue.use(Quasar, { plugins: { Notify } })
}
