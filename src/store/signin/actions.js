import {
  getRecord,
  getFeedback,
  getLectureList,
  addLecture,
  getLectureInfo,
  deleteLecture,
  getPosition,
  getLeavingSummary,
  setInterval,
  permitLeaving
} from '../../api/sign-in'

import * as mutations from './mutations'

export const GET_RECORD = 'GET_RECORD'
export const GET_FEEDBACK = 'GET_FEEDBACK'
export const GET_LECTURE_LIST = 'GET_LECTURE_LIST'
export const GET_LECTURE_INFO = 'GET_LECTURE_INFO'
export const ADD_LECTURE = 'ADD_LECTURE'
export const DELETE_LECTURE = 'DELETE_LECTURE'
export const GET_POSITION = 'GET_POSITION'
export const GET_LEAVING_SUMMARY = 'GET_LEAVING_SUMMARY'
export const SET_INTERVAL = 'SET_INTERVAL'
export const PERMIT_LEAVING = 'PERMIT_LEAVING'

export default {
  [GET_RECORD] ({commit, rootState}) {
    let userType = rootState.userType
    return getRecord(userType).then(response => {
      console.log(response)
      if (userType === 'student' || userType === 'assistant') {
        commit(mutations.SET_STUDENT_RECORDS, response.data)
      } else {
        commit(mutations.SET_TEACHER_STUDENTS_MAP, response.data)
      }
      commit(mutations.SET_UPDATE_DATE, response.updateDate)
    })
  },

  [GET_FEEDBACK] ({commit, rootState}) {
    let userType = rootState.userType
    return getFeedback(userType).then(response => {
      commit(mutations.SET_UPDATE_DATE, response.updateDate)
      if (userType === 'student' || userType === 'assistant') {
        commit(mutations.SET_STUDENT_LAST_REGISTER, response.lastRegister)
      }
      commit(mutations.SET_FEEDBACK, response.message)
    })
  },

  [GET_LECTURE_LIST] ({commit}) {
    return getLectureList().then(list => commit(mutations.SET_LECTURE_LIST, list))
  },

  [GET_LECTURE_INFO] ({commit, state}, lecture) {
    if (state.cachedLectureInfo.id) {
      return
    }
    return getLectureInfo(lecture).then(lecture => {
      commit(mutations.CACHE_LECTURE_INFO, lecture)
    })
  },

  [ADD_LECTURE] ({commit, dispatch, state}, lecture) {
    return addLecture(lecture).then(response => {
      let positionsMap = state.positions

      lecture.id = response.id
      lecture.pos = lecture.pos.map(value => positionsMap[value].name).join(', ')
      commit(mutations.CACHE_LECTURE_INFO, lecture)
      commit(mutations.ADD_LECTURE, lecture)
    })
  },

  [DELETE_LECTURE] ({dispatch, commit}, lecture) {
    return deleteLecture(lecture).then(() => commit(mutations.DELETE_LECTURE, lecture.id))
  },

  [GET_POSITION] ({commit}) {
    return getPosition().then(positions => {
      commit(mutations.SET_POSITIONS, positions)
    })
  },

  [GET_LEAVING_SUMMARY] ({commit}, all) {
    return getLeavingSummary(all).then(summary => commit(mutations.SET_LEAVING_SUMMARY, summary))
  },

  [SET_INTERVAL] ({commit, state}, {ids, newInterval}) {
    return setInterval(ids, newInterval).then(() => {
      ids.forEach(id => {
        let student = {}
        Object.assign(student, state.teacher.studentsMap[id])
        student.interval = newInterval
        commit(mutations.RENEW_STUDENT, student)
      })
    })
  },

  [PERMIT_LEAVING] ({commit}, {id, value}) {
    return permitLeaving(id, value)
      .then(() => commit(mutations.RENEW_LEAVING_PERMISSION, {id, permission: value}))
  }
}
