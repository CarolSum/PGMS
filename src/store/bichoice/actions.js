import {
  getTeacherList,
  getStudentList,
  getTeacherInfo,
  getStudentInfo,
  getSelectedList,
  getStuMaxSelectNum,
  teacherChoosableId,
  studentChoosableId,
  getInfo,
  chooseTeacher,
  chooseStudent,
  cancelTeacher,
  cancelStudent,
  updateInfo,
  adminGetStudentSelectedList,
  adminGetTeacherSelectedList,
  adminGetStudentChoosabelList,
  adminGetTeacherChoosableList,
  adminStudentChooseTeacher,
  adminStudentCancelTeacher,
  adminGetStudentInfo,
  adminGetTeacherInfo,
  adminUpdateStudentInfo,
  adminUpdateTeacherInfo,
  adminTeacherChooseStudent,
  adminTeacherCancelStudent,
  studentGetFileList,
  studentDeleteFile,
  getTeacherRecruitList
} from '../../api/bichoice'

import * as mutations from './mutations'

export const GET_TEACHER_LIST = 'GET_TEACHER_LIST'
export const GET_STUDENT_LIST = 'GET_STUDENT_LIST'
export const GET_TEACHER_INFO = 'GET_TEACHER_INFO'
export const GET_STUDENT_INFO = 'GET_STUDNET_INFO'
export const GET_SELECTED_LIST = 'GET_SELECTED_LIST'
export const GET_STUDENT_MAX_SELECT_NUM = 'GET_STUDENT_MAX_SELECT_NUM'
export const GET_TEACHER_CHOOSABLE_ID = 'GET_TEACHER_CHOOSABLE_ID'
export const GET_STUDENT_CHOOSABLE_ID = 'GET_STUDENT_CHOOSABLE_ID'
export const GET_PERSON_INFO = 'GET_PERSON_INFO'
export const CHOOSE_TEACHER = 'CHOOSE_TEACHER'
export const CHOOSE_STUDENT = 'CHOOSE_STUDENT'
export const CANCEL_TEACHER = 'CANCEL_TEACHER'
export const CANCEL_STUDENT = 'CANCEL_STUDENT'
export const UPLOAD_PERSON_INFO = 'UPLOAD_PERSON_INFO'
export const ADMIN_GET_TEACHER_SELECTED_LIST = 'ADMIN_GET_TEACHER_SELECTED_LIST'
export const ADMIN_GET_STUDENT_SELECTED_LIST = 'ADMIN_GET_STUDENT_SELECTED_LIST'
export const ADMIN_GET_TEACHER_CHOOSABLE_LIST = 'ADMIN_GET_TEACHER_CHOOSABLE_LIST'
export const ADMIN_GET_STUDENT_CHOOSABLE_LIST = 'ADMIN_GET_STUDENT_CHOOSABLE_LIST'
export const ADMIN_STUDENT_CHOOSE_TEACHER = 'ADMIN_STUDENT_CHOOSE_TEACHER'
export const ADMIN_STUDENT_CANCEL_TEACHER = 'ADMIN_STUDENT_CANCEL_TEACHER'
export const ADMIN_TEACHER_CHOOSE_STUDENT = 'ADMIN_TEACHER_CHOOSE_STUDENT'
export const ADMIN_TEACHER_CANCEL_STUDENT = 'ADMIN_TEACHER_CANCEL_STUDENT'
export const ADMIN_GET_TEACHER_INFO = 'ADMIN_GET_TEACHER_INFO'
export const ADMIN_GET_STUDENT_INFO = 'ADMIN_GET_STUDENT_INFO'
export const ADMIN_UPDATE_TEACHER_INFO = 'ADMIN_UPDATE_TEACHER_INFO'
export const ADMIN_UPDATE_STUDENT_INFO = 'ADMIN_UPDATE_STUDENT_INFO'
export const STUDENT_GET_FILE_LIST = 'STUDENT_GET_FILE_LIST'
export const STUDENT_DELETE_FILE = 'STUDENT_DELETE_FILE'
export const ADMIN_GET_RECRUIT_LIST = 'ADMIN_GET_RECRUIT_LIST'

export default {
  [GET_TEACHER_LIST] ({commit}) {
    return getTeacherList().then(teachers => {
      commit(mutations.SET_TEACHER_LIST, teachers)
    })
  },

  [GET_STUDENT_LIST] ({commit}) {
    return getStudentList().then(students => {
      commit(mutations.SET_STUDENT_LIST, students)
    })
  },

  [GET_TEACHER_INFO] ({commit}, {id}) {
    return getTeacherInfo(id).then(teacher => {
      commit(mutations.SET_TEAHCER_INFO, teacher)
    })
  },

  [GET_STUDENT_INFO] ({commit}, {id}) {
    return getStudentInfo(id).then(student => {
      commit(mutations.SET_STUDENT_INFO, student)
    })
  },

  [GET_SELECTED_LIST] ({commit}) {
    return getSelectedList().then(selectedList => {
      commit(mutations.SET_SELECTED_LIST, selectedList)
    })
  },

  [GET_STUDENT_MAX_SELECT_NUM] ({commit}) {
    return getStuMaxSelectNum().then(Max => {
      commit(mutations.SET_STUDENT_MAX_SELECT_NUM, Max)
    })
  },

  [GET_TEACHER_CHOOSABLE_ID] ({commit}) {
    return teacherChoosableId().then(Ids => {
      commit(mutations.SET_TEACHER_CHOOSABLE_ID, Ids)
    })
  },

  [GET_STUDENT_CHOOSABLE_ID] ({commit}) {
    return studentChoosableId().then(Ids => {
      commit(mutations.SET_STUDENT_CHOOSABLE_ID, Ids)
    })
  },

  [GET_PERSON_INFO] ({commit}) {
    return getInfo().then(info => {
      commit(mutations.SET_PERSON_INFO, info)
    })
  },

  [CHOOSE_TEACHER] ({commit}, {id}) {
    return chooseTeacher(id)
  },

  [CHOOSE_STUDENT] ({commit}, {id}) {
    return chooseStudent(id)
  },

  [CANCEL_TEACHER] ({commit}, {id}) {
    return cancelTeacher(id)
  },

  [CANCEL_STUDENT] ({commit}, {id}) {
    return cancelStudent(id)
  },

  [UPLOAD_PERSON_INFO] ({commit}, info) {
    return updateInfo(info)
  },

  [ADMIN_GET_TEACHER_SELECTED_LIST] ({commit}, id) {
    return adminGetTeacherSelectedList(id).then(list => {
      commit(mutations.ADMIN_SET_TEACHER_SELECTED_LIST, [id, list])
    })
  },

  [ADMIN_GET_STUDENT_SELECTED_LIST] ({commit}, id) {
    return adminGetStudentSelectedList(id).then(list => {
      commit(mutations.ADMIN_SET_STUDENT_SELECTED_LIST, [id, list])
    })
  },

  [ADMIN_GET_TEACHER_CHOOSABLE_LIST] ({commit}, id) {
    return adminGetTeacherChoosableList(id).then(list => {
      commit(mutations.ADMIN_SET_TEACHER_CHOOSABLE_LIST, [id, list])
    })
  },

  [ADMIN_GET_STUDENT_CHOOSABLE_LIST] ({commit}, id) {
    return adminGetStudentChoosabelList(id).then(list => {
      commit(mutations.ADMIN_SET_STUDENT_CHOOSABLE_LIST, [id, list])
    })
  },

  [ADMIN_STUDENT_CHOOSE_TEACHER] ({commit}, [stuId, teaId]) {
    return adminStudentChooseTeacher(stuId, teaId)
  },

  [ADMIN_STUDENT_CANCEL_TEACHER] ({commit}, [stuId, teaId]) {
    return adminStudentCancelTeacher(stuId, teaId)
  },

  [ADMIN_TEACHER_CHOOSE_STUDENT] ({commit}, [teaId, stuId]) {
    return adminTeacherChooseStudent(teaId, stuId)
  },

  [ADMIN_TEACHER_CANCEL_STUDENT] ({commit}, [teaId, stuId]) {
    return adminTeacherCancelStudent(teaId, stuId)
  },

  [ADMIN_GET_TEACHER_INFO] ({commit}, id) {
    return adminGetTeacherInfo(id).then(data => {
      commit(mutations.ADMIN_SET_TEACHER_INFO, [id, data])
    })
  },

  [ADMIN_GET_STUDENT_INFO] ({commit}, id) {
    return adminGetStudentInfo(id).then(data => {
      commit(mutations.ADMIN_SET_STUDENT_INFO, [id, data])
    })
  },

  [ADMIN_UPDATE_TEACHER_INFO] ({commit}, [id, info]) {
    return adminUpdateTeacherInfo(id, info)
  },

  [ADMIN_UPDATE_STUDENT_INFO] ({commit}, [id, info]) {
    return adminUpdateStudentInfo(id, info)
  },

  [STUDENT_GET_FILE_LIST] ({commit}) {
    return studentGetFileList().then(list => {
      commit(mutations.STUDENT_SET_FILE_LIST, list)
    })
  },

  [STUDENT_DELETE_FILE] ({commit}, {file}) {
    return studentDeleteFile({file})
  },

  [ADMIN_GET_RECRUIT_LIST] ({commit}, id) {
    return getTeacherRecruitList(id).then(data => {
      commit(mutations.ADMIN_SET_RECRUIT_LIST, [id, data])
    })
  }

}
