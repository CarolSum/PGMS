import Vue from 'vue'

export const SET_LECTURE_LIST = 'SET_LECTURE_LIST'
export const SET_POSITIONS = 'SET_POSITIONS'
export const SET_STUDENT_RECORDS = 'SET_STUDENT_RECORDS'
export const SET_FEEDBACK = 'SET_FEEDBACK'
export const SET_STUDENT_LAST_REGISTER = 'SET_STUDENT_LAST_REGISTER'
export const SET_TEACHER_STUDENTS_MAP = 'SET_TEACHER_STUDENTS_MAP'
export const SET_UPDATE_DATE = 'SET_UPDATE_DATE'
export const RENEW_STUDENT = 'RENEW_STUDENT'
export const RENEW_LEAVING_PERMISSION = 'RENEW_LEAVING_PERMISSION'
export const CACHE_LECTURE_INFO = 'CACHE_LECTURE_INFO'
export const SET_LEAVING_SUMMARY = 'SET_LEAVING_SUMMARY'
export const ADD_LEAVING_RECORD = 'ADD_LEAVING_RECORD'
export const DELETE_LEAVING_RECORD = 'DELETE_LEAVING_RECORD'
export const RENEW_LEAVING_RECORD = 'RENEW_LEAVING_RECORD'
export const ADD_LECTURE = 'ADD_LECTURE'
export const DELETE_LECTURE = 'DELETE_LECTURE'

export default {
  [SET_LECTURE_LIST] (state, list) {
    state.lectureList = list
  },

  [SET_POSITIONS] (state, positions) {
    positions.forEach(data => {
      if (data && data.id) {
        Vue.set(state.positions, data.id, data)
      }
    })
  },

  [SET_STUDENT_RECORDS] (state, records) {
    state.student.records = records
  },

  [SET_FEEDBACK] (state, feedback) {
    state.feedback = feedback
  },

  [SET_STUDENT_LAST_REGISTER] (state, register) {
    state.student.lastRegister = register
  },

  [SET_TEACHER_STUDENTS_MAP] (state, students) {
    students.forEach(data => {
      if (data && data.student && data.student.id) {
        Vue.set(state.teacher.studentsMap, data.student.id, {
          ...data.student,
          ...data.lastRegister
        })
      }
    })
  },

  [SET_UPDATE_DATE] (state, date) {
    state.recordUpdateDate = date
  },

  [CACHE_LECTURE_INFO] (state, lecture) {
    Vue.set(state.cachedLectureInfo, lecture.id, lecture.introduction)
  },

  [RENEW_STUDENT] (state, student) {
    state.teacher.studentsMap[student.id] = student
  },

  [RENEW_LEAVING_PERMISSION] (state, {id, permission}) {
    let index = state.leavingRecords.map(value => value.id).indexOf(id)
    state.leavingRecords[index].permission = permission
  },

  [SET_LEAVING_SUMMARY] (state, summary) {
    state.leavingRecords = summary
  },

  [ADD_LEAVING_RECORD] (state, record) {
    state.leavingRecords.push(record)
  },

  [DELETE_LEAVING_RECORD] (state, id) {
    let index = state.leavingRecords.map(value => value.id).indexOf(id)
    if (index !== -1) {
      state.leavingRecords.splice(index, 1)
    }
  },

  [RENEW_LEAVING_RECORD] (state, record) {
    let index = state.leavingRecords.map(value => value.id).indexOf(record.id)
    if (index !== -1) {
      state.leavingRecords[index].fromDate = record.fromDate
      state.leavingRecords[index].toDate = record.toDate
    }
  },

  [ADD_LECTURE] (state, lecture) {
    state.lectureList.push(lecture)
  },

  [DELETE_LECTURE] (state, id) {
    let index = state.lectureList.map(value => value.id).indexOf(id)
    if (index !== -1) {
      state.lectureList.splice(index, 1)
    }
  }
}
