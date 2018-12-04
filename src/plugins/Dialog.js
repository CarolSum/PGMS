import Quasar, { Dialog } from 'quasar-framework/dist/quasar.mat.esm'
// import Quasar, { Dialog } from '../../node_modules/quasar-framework/dist/quasar.mat.esm.js'

export default ({ Vue }) => {
  // Vue.prototype.$dialog = Dialog
  Vue.use(Quasar, { plugins: [Dialog] })
}
