
const routes = [
  {
    path: '/login',
    component: () => import('components/share/Login.vue')
  },
  // {
  //   path: '/signin',
  //   component: load('basic/Layout'),
  //   meta: {requireAuth: true, subsystemName: 'signIn'},
  //   children: [
  //     {path: 'home', component: load('sign-in/Home')},
  //     {path: 'lecture-manage', component: load('sign-in/LectureManage')},
  //     {path: 'record', component: load('sign-in/Record')},
  //     {path: 'leave', component: load('sign-in/Leave')},
  //     {path: 'personal', component: load('sign-in/Personal')},
  //     {path: '', redirect: 'home'}
  //   ]
  // },
  // {
  //   path: '/bichoice',
  //   component: load('basic/Layout'),
  //   meta: {requireAuth: true, subsystemName: 'bichoice'},
  //   children: [
  //     {path: 'studentHome', component: load('bichoice/StudentHome')},
  //     {path: 'teacherHome', component: load('bichoice/TeacherHome')},
  //     {path: 'adminStudent', component: load('bichoice/AdminStudent')},
  //     {path: 'adminTeacher', component: load('bichoice/AdminTeacher')},
  //     {path: 'adminHome', component: load('bichoice/AdminHome')},
  //     {path: 'studentSetting', component: load('bichoice/StudentSetting')},
  //     {path: 'teacherSetting', component: load('bichoice/TeacherSetting')},
  //     {
  //       path: '',
  //       redirect: to => {
  //         if (store.state.userType === 'bistudent') {
  //           return 'studentHome'
  //         } else if (store.state.userType === 'biadmin') {
  //           return 'adminStudent'
  //         }
  //         return 'teacherHome'
  //       }
  //     }
  //   ]
  // },
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
