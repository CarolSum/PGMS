
const routes = [
  {
    path: '/login',
    component: () => import('components/share/Login.vue')
  },
  {
    path: '/signin',
    component: () => import('layouts/Layout'),
    meta: {
      requireAuth: true,
      subsystemName: 'signIn'
    },
    children: [
      {path: 'home', component: () => import('components/signin/Home.vue')},
      {path: 'leave', component: () => import('components/signin/Leave.vue')},
      {path: 'record', component: () => import('components/signin/Record.vue')},
      {path: 'personal', component: () => import('components/signin/Personal.vue')},
      {path: '', redirect: 'home'}
    ]
  },
  {path: '/', redirect: '/login'}
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
