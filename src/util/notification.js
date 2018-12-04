import { Notify } from 'quasar'

import 'quasar-extras/animate/bounceInDown.css'
import 'quasar-extras/animate/bounceOutUp.css'

// Notify Example
// this.$q.notify({
//   // only required parameter is the message:
//   message: `A text with your alert's awesome message`,

//   /*
//    * All parameters below are optional:
//    */

//   timeout: 3000, // in milliseconds; 0 means no timeout

//   // "type" adds a color and icon,
//   // so you don't need to specify them.
//   // Available values: 'positive', 'negative', 'warning', 'info'
//   type: 'positive',

//   color: 'positive',
//   textColor: 'black', // if default 'white' doesn't fits

//   icon: 'wifi',
//   // or
//   avatar: 'statics/boy-avatar.png',

//   detail: 'Optional detail message.',
//   position: 'top-right', // 'top', 'left', 'bottom-left' etc

//   actions: [
//     {
//       label: 'Snooze',
//       icon: 'timer', // optional
//       noDismiss: true, // optional, v0.15.11+
//       handler: () => {
//         console.log('acting')
//       }
//     },
//     {
//       label: 'Dismiss',
//       handler: () => {
//         console.log('dismissed')
//       }
//     }
//   ],

//   onDismiss () { // v0.15.11+
//     //...
//   }
// })

export function lostConnection () {
  fail({info: '连接失败', timeout: 2000})
}

export function fail ({info, icon, timeout}) {
  icon = icon || 'error_outline'
  timeout = timeout || 2000
  Notify.create({
    message: info,
    type: 'negative',
    icon,
    timeout
  })
}

export function succeed ({info, icon, timeout}) {
  icon = icon || 'check'
  timeout = timeout || 2000
  Notify.create({
    message: info,
    type: 'positive',
    icon,
    timeout
  })
}

export function warn ({info, icon, timeout}) {
  icon = icon || 'priority_high'
  timeout = timeout || 2000
  Notify.create({
    message: info,
    type: 'warning',
    icon,
    timeout
  })
}

export function inform ({info, icon, timeout}) {
  icon = icon || 'info'
  timeout = timeout || 2000
  Notify.create({
    message: info,
    type: 'info',
    icon,
    timeout
  })
}

export function failAlert ({info, icon}) {
  Notify.create({
    message: info,
    type: 'negative',
    icon,
    position: 'top',
    enter: 'bounceInDown',
    leave: 'bounceOutUp'
  })
}

// export function addDialog ({info, icon}) {
//   Dialog.create({
//     title: '请假详情',
//     message: `asd`,
//     buttons: [
//       '取消',
//       {
//         label: '否决',
//         color: 'negative',
//         raised: true
//       },
//       {
//         label: '批准',
//         color: 'positive',
//         raised: true
//       }
//     ]
//   })
// }
