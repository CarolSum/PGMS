import Quasar, { Dialog } from 'quasar-framework/dist/quasar.mat.esm'
// import Quasar, { Dialog } from '../../node_modules/quasar-framework/dist/quasar.mat.esm.js'

export default ({ Vue }) => {
  // Vue.prototype.$dialog = Dialog
  import(`quasar-framework/i18n/zh-hans`).then(lang => {
    Quasar.i18n.set(lang.default)
  })
  Vue.use(Quasar, { plugins: [Dialog] })
}
