import axios from 'axios'
import { stringify } from 'querystring'
import { MapPropertyNameStyle, snakeToCamel, camelToSnake, throwErrorIfExists } from '../util/apiHelper'

const ROOT = '/api/signin/'
// object.assign将所有可枚举属性的值从一个或多个源对象复制到目标对象
function assignCamelWithSnake (obj, src, properties) {
  Object.assign(obj, MapPropertyNameStyle(src, snakeToCamel, properties))
}

class Student {
  constructor (item) {
    assignCamelWithSnake(this, item, ['id', 'name', 'interval', 'is_leaving'])
  }
}

class RegisterEntry {
  constructor (item) {
    assignCamelWithSnake(this, item, ['date', 'place', 'register_name'])
    this.date = new Date(this.date)
  }
}

class Lecture {
  constructor (item) {
    assignCamelWithSnake(this, item, ['title', 'id', 'start_time', 'end_time', 'pos'])
  }
}

class Position {
  constructor (item) {
    assignCamelWithSnake(this, item, ['id', 'name'])
  }
}

class LeavingRecord {
  constructor (item) {
    assignCamelWithSnake(this, item, ['id', 'name', 'from_date', 'to_date', 'permission', 'reason'])
  }
}

class VacationRecord {
  constructor (item) {
    assignCamelWithSnake(this, item, ['id', 'name', 'from_date', 'to_date'])
  }
}

/**
 * Get the record with a get to register_data url.
 * The result object contains 2 members, update_date and data.
 * If record is got successfully, the promise will be resolved.
 * Otherwise the promise will be rejected.
 * @param {string} userType The type of current user. Only student and teacher are considered.
 * @return {Promise}
 */
export async function getRecord (userType) {
  function parseData (rawData) {
    let ret = {}
    ret.updateDate = new Date(rawData['update_date'])
    ret.data = []
    if (userType === 'teacher') {
      for (let item of rawData['data']) {
        ret.data.push({
          student: new Student(item['student']),
          lastRegister: new RegisterEntry(item['last_register'])
        })
      }
    } else {
      for (let item of rawData['data']) {
        console.log(item)
        ret.data.push(new RegisterEntry(item))
      }
    }
    return ret
  }

  let response = await axios.get(ROOT + 'register_data/')
  return parseData(response.data)
}

/**
 * Get the feedback.
 * Teacher will get a simple message shows whether absence occurs among his students.
 * Student will get a message shows whether he was absent during past a few days, the recent register information, and register time in total.
 * @param {string} userType The type of current user. Only student and teacher are considered.
 * @return {Promise}
 */
export async function getFeedback (userType) {
  function parseData (rawData) {
    let ret = {}
    if (!rawData) {
      return ret
    }

    ret.updateDate = new Date(rawData['update_date'])
    ret.message = rawData['message']
    if (userType === 'student') {
      ret.lastRegister = new RegisterEntry(rawData['last_register'])
      ret.registerTime = rawData['register_time']
    }
    return ret
  }

  let response = await axios.get(ROOT + 'register_feedback/')
  return parseData(response.data)
}

/**
 * Get all lectures for current assistant.
 * An array of lectures will be passed if server works properly.
 * @return {Promise}
 */
export async function getLectureList () {
  function parseData (rawData) {
    let ret = []
    if (rawData && rawData['lectures']) {
      for (let item of rawData['lectures']) {
        ret.push(new Lecture(item))
      }
    }
    return ret
  }

  let response = await axios.get(ROOT + 'list_lecture/')
  return parseData(response.data)
}

/**
 * Add a lecture with proper information.
 * @param lecture The lecture to be added.
 * @return {Promise}
 */
export async function addLecture (lecture) {
  let postData = MapPropertyNameStyle(lecture, camelToSnake, ['title', 'introduction', 'startTime', 'endTime', 'pos'])

  let response = await axios.post(ROOT + 'add_lecture/', stringify(postData))
  throwErrorIfExists(response)
  return response.data['data']
}

/**
 * Get the introduction of a lecture.
 * @param {Lecture} lecture The lecture to get introduction from.
 * @return {Promise}
 */
export async function getLectureInfo ({id}) {
  let response = await axios.get(ROOT + `get_lecture/${id}/`)
  return response.data
}

/**
 * Delete the lecture with a post to delete_lecture api.
 * @param id The id of the lecture to be deleted.
 * @return {Promise}
 */
export async function deleteLecture ({id}) {
  let response = await axios.post(ROOT + `delete_lecture/`, stringify({id}))
  throwErrorIfExists(response)
}

/**
 * Set new interval for the student passed in.
 * @param {Array<int>} student The student for the new interval to apply to.
 * @param {int} newInterval The new interval to apply.
 * @return {Promise}
 */
export async function setInterval (student, newInterval) {
  let response = await axios.post(ROOT + 'set_interval/', {username: student, interval: newInterval})
  throwErrorIfExists(response)
}

/**
 * Get all positions for lecture to be held.
 * @return {Promise}
 */
export async function getPosition () {
  function parseData (rawData) {
    let ret = []
    if (!rawData) {
      return ret
    }
    for (let item of rawData) {
      ret.push(new Position(item))
    }
    return ret
  }

  let response = await axios.get(ROOT + 'list_pos/')
  return parseData(response.data && response.data['positions'])
}

/**
 * Get leaving summary to show in home page.
 * @return {Promise}
 */
export async function getLeavingSummary (all) {
  function parseData (rawData) {
    let ret = []
    if (!rawData) {
      return ret
    }
    for (let item of rawData) {
      ret.push(new LeavingRecord(item))
    }
    return ret
  }

  let response = await axios.get(ROOT + 'leaving_summary/', {params: {all: +all}})
  return parseData(response.data && response.data['data'])
}

/**
 * Function to send request to leaving service.
 * @param action add delete permit modify
 * @param param
 * @return {Promise<>}
 */
async function requestLeavingService (action, param = {}) {
  let response = await axios.post(ROOT + 'leaving_service/', stringify({action, ...param}))
  throwErrorIfExists(response)
  return response.data['data']
}

export async function applyForLeaving (leavingRecord) {
  return requestLeavingService('add',
    MapPropertyNameStyle(leavingRecord, camelToSnake, ['fromDate', 'toDate', 'reason']))
}

export async function deleteLeavingRecord ({id}) {
  return requestLeavingService('delete', {id})
}

export async function modifyLeavingRecord (leavingRecord) {
  return requestLeavingService('modify',
    MapPropertyNameStyle(leavingRecord, camelToSnake, ['id', 'fromDate', 'toDate', 'reason']))
}

export async function permitLeaving (recordId, newValue) {
  return requestLeavingService('permit', {
    id: recordId,
    value: +newValue
  })
}

export async function getLeavingRecord (recordId) {
  let responseData = await requestLeavingService('query', {id: recordId})
  return new LeavingRecord(responseData)
}

async function requestVacationService (action, param = {}) {
  let response = await axios.post(ROOT + 'vacation_service', stringify({action, ...param}))
  throwErrorIfExists(response)
  return response.data
}

export async function queryNormalVacation () {
  let responseData = await requestVacationService('query_normal')
  return responseData['data'].map(record => new VacationRecord(record))
}

export async function createNormalVacation (vacationRecord) {
  let responseData = await requestVacationService('create_normal',
    MapPropertyNameStyle(vacationRecord, camelToSnake, ['name', 'fromDate', 'toDate']))
  vacationRecord['id'] = responseData['id']
  return vacationRecord
}

export async function deleteNormalVacation ({recordId}) {
  return requestVacationService('delete_normal', recordId)
}

export async function queryExceptionVacation (username) {
  let responseData = await requestVacationService('query_exception', {username})
  return responseData['data'].map(record => new VacationRecord(record))
}

export async function createExceptionVacation (vacationRecord) {
  let responseDate = await requestVacationService('create_exception',
    MapPropertyNameStyle(vacationRecord, camelToSnake, ['name', 'fromDate', 'toDate']))
  vacationRecord['id'] = responseDate['id']
  return vacationRecord
}

export async function deleteExceptionVacation ({recordId}) {
  return requestVacationService('delete_exception', recordId)
}
