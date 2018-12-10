import store from '../store/index'

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
      {path: 'lecture-manage', component: () => import('components/signin/LectureManage.vue')},
      {path: 'personal', component: () => import('components/signin/Personal.vue')},
      {path: '', redirect: 'home'}
    ]
  },
  {
    path: '/bichoice',
    component: () => import('layouts/Layout'),
    meta: {requireAuth: true, subsystemName: 'bichoice'},
    children: [
      {path: 'studentHome', component: () => import('components/bichoice/StudentHome.vue')},
      {path: 'teacherHome', component: () => import('components/bichoice/TeacherHome.vue')},
      // {path: 'adminStudent', component: () => import('bichoice/AdminStudent.vue')},
      // {path: 'adminTeacher', component: () => import('bichoice/AdminTeacher.vue')},
      // {path: 'adminHome', component: () => import('bichoice/AdminHome.vue')},
      {path: 'studentSetting', component: () => import('components/bichoice/StudentSetting.vue')},
      {path: 'teacherSetting', component: () => import('components/bichoice/TeacherSetting.vue')},
      {
        path: '',
        redirect: to => {
          if (store.state.userType === 'bistudent') {
            return 'studentHome'
          } else if (store.state.userType === 'biadmin') {
            return 'adminStudent'
          }
          return 'teacherHome'
        }
      }
    ]
  },
  {path: '/', redirect: '/login'},
  {path: '*', component: () => import('pages/Error404.vue')} // 404 Not found, always leave this statement at last.
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
