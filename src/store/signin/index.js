import actions from './actions'
import mutations from './mutations'

const module = {
  state: {
    lectureList: [],
    positions: {},
    student: {
      records: [],
      lastRegister: {},
      isLeaving: false
    },
    teacher: {
      studentsMap: {}
    },
    feedback: '',
    cachedLectureInfo: {},
    recordUpdateDate: {},
    leavingRecords: []
  },
  actions,
  mutations
}

export default module

// export default {
//   namespaced: true,
//   state: () => ({
//     isLogin: true
//   }),
//   mutations: {

//   },
//   getters: {

//   },
//   actions: {

//   }
// }
