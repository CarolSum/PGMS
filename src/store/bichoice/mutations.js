import Vue from 'vue'

export const SET_TEACHER_LIST = 'SET_TEACHER_LIST'
export const SET_STUDENT_LIST = 'SET_STUDENT_LIST'
export const SET_TEAHCER_INFO = 'SET_TEAHCER_INFO'
export const SET_STUDENT_INFO = 'SET_STUDENT_INFO'
export const SET_SELECTED_LIST = 'SET_SELECTED_LIST'
export const SET_STUDENT_MAX_SELECT_NUM = 'SET_STUDENT_MAX_SELECT_NUM'
export const SET_TEACHER_CHOOSABLE_ID = 'SET_TEACHER_CHOOSABLE_ID'
export const SET_STUDENT_CHOOSABLE_ID = 'SET_STUDENT_CHOOSABLE_ID'
export const SET_PERSON_INFO = 'SET_PERSON_INFO'
export const UPDATE_PERSON_INFO = 'UPDATE_PERSON_INFO'
export const ADMIN_SET_TEACHER_SELECTED_LIST = 'ADMIN_SET_TEACHER_SELECTED_LIST'
export const ADMIN_SET_STUDENT_SELECTED_LIST = 'ADMIN_SET_STUDENT_SELECTED_LIST'
export const ADMIN_SET_TEACHER_CHOOSABLE_LIST = 'ADMIN_SET_TEACHER_CHOOSABLE_LIST'
export const ADMIN_SET_STUDENT_CHOOSABLE_LIST = 'ADMIN_SET_STUDENT_CHOOSABLE_LIST'
export const ADMIN_SET_TEACHER_INFO = 'ADMIN_SET_TEACHER_INFO'
export const ADMIN_SET_STUDENT_INFO = 'ADMIN_SET_STUDENT_INFO'
export const ADMIN_UPDATE_TEACHER_PERSON_INFO = 'ADMIN_UPDATE_TEACHER_PERSON_INFO'
export const ADMIN_UPDATE_STUDENT_PERSON_INFO = 'ADMIN_UPDATE_STUDENT_PERSON_INFO'
export const STUDENT_SET_FILE_LIST = 'STUDENT_SET_FILE_LIST'
export const ADMIN_SET_RECRUIT_LIST = 'ADMIN_SET_RECRUIT_LIST'

export default {
  [SET_TEACHER_LIST] (state, list) {
    state.teacherList = list
  },

  [SET_STUDENT_LIST] (state, list) {
    state.studentList = list
  },

  [SET_TEAHCER_INFO] (state, teacher) {
    let index = state.teacherList.map(value => value.id).indexOf(teacher.id)
    Vue.set(state.teacherList, index, teacher)
  },

  [SET_STUDENT_INFO] (state, student) {
    let index = state.studentList.map(value => value.id).indexOf(student.id)
    Vue.set(state.studentList, index, student)
  },

  [SET_SELECTED_LIST] (state, selectedList) {
    Vue.set(state, 'selectedList', selectedList)
  },

  [SET_STUDENT_MAX_SELECT_NUM] (state, Max) {
    state.studentMaxSelectedNum = Max
  },

  [SET_TEACHER_CHOOSABLE_ID] (state, Ids) {
    Vue.set(state, 'teacherChoosableId', Ids)
  },

  [SET_STUDENT_CHOOSABLE_ID] (state, Ids) {
    Vue.set(state, 'studentChoosableId', Ids)
  },

  [SET_PERSON_INFO] (state, info) {
    Vue.set(state, 'personinfo', info)
  },

  [UPDATE_PERSON_INFO] (state, [name, info]) {
    Vue.set(state.personinfo.data, name, info)
  },

  [ADMIN_SET_TEACHER_SELECTED_LIST] (state, [id, list]) {
    let tmpTeacher = state.teacherList.find(ele => ele.id === id)
    if (tmpTeacher) {
      Vue.set(tmpTeacher, 'selectedList', list)
    }
  },

  [ADMIN_SET_STUDENT_SELECTED_LIST] (state, [id, list]) {
    let tmpStudent = state.studentList.find(ele => ele.id === id)
    if (tmpStudent) {
      Vue.set(tmpStudent, 'selectedList', list)
    }
  },

  [ADMIN_SET_TEACHER_CHOOSABLE_LIST] (state, [id, list]) {
    let tmpTeacher = state.teacherList.find(ele => ele.id === id)
    if (tmpTeacher) {
      Vue.set(tmpTeacher, 'choosableList', list)
    }
  },

  [ADMIN_SET_STUDENT_CHOOSABLE_LIST] (state, [id, list]) {
    let tmpStudent = state.studentList.find(ele => ele.id === id)
    if (tmpStudent) {
      Vue.set(tmpStudent, 'choosableList', list)
    }
  },

  [ADMIN_SET_TEACHER_INFO] (state, [id, info]) {
    let tmpTeacher = state.teacherList.find(ele => ele.id === id)
    if (tmpTeacher) {
      Vue.set(tmpTeacher, 'personinfo', info)
    }
  },

  [ADMIN_SET_STUDENT_INFO] (state, [id, info]) {
    let tmpStudent = state.studentList.find(ele => ele.id === id)
    if (tmpStudent) {
      Vue.set(tmpStudent, 'personinfo', info)
    }
  },

  [ADMIN_UPDATE_STUDENT_PERSON_INFO] (state, [id, name, info]) {
    let tmpStudent = state.studentList.find(ele => ele.id === id)
    if (tmpStudent) {
      Vue.set(tmpStudent.personinfo, name, info)
    }
  },

  [ADMIN_UPDATE_TEACHER_PERSON_INFO] (state, [id, name, info]) {
    let tmpTeacher = state.teacherList.find(ele => ele.id === id)
    if (tmpTeacher) {
      Vue.set(tmpTeacher.personinfo, name, info)
    }
  },

  [STUDENT_SET_FILE_LIST] (state, list) {
    Vue.set(state.personinfo.data, 'files', list)
  },

  [ADMIN_SET_RECRUIT_LIST] (state, [id, data]) {
    let tmpTeacher = state.teacherList.find(ele => ele.id === id)
    if (tmpTeacher) {
      Vue.set(tmpTeacher, 'recruitList', data)
    }
  }

}
