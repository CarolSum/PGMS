
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
