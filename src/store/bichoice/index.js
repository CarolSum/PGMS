import actions from './actions'
import mutations from './mutations'

const module = {
  state: {
    teacherList: [],
    studentList: [],
    selectedList: {},
    studentMaxSelectedNum: 0,
    teacherChoosableId: [],
    personinfo: {},
    selectedId: -1
  },
  actions,
  mutations
}

export default module
