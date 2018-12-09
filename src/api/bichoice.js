import axios from 'axios'
import { stringify } from 'querystring'
import { MapPropertyNameStyle, snakeToCamel } from '..//util/apiHelper'

const ROOT = '/api/bichoice/'

function assignCamelWithSnake (obj, src, properties) {
  Object.assign(obj, MapPropertyNameStyle(src, snakeToCamel, properties))
}

class Teacher {
  constructor (item) {
    assignCamelWithSnake(this, item, ['id', 'name', 'belong_to', 'research_area', 'personal_page', 'gender', 'degree_type'])
  }
}

class BiStudent {
  constructor (item) {
    assignCamelWithSnake(this, item, ['id', 'name', 'score', 'graduation_university', 'graduation_major', 'household_register', 'ethnic_group', 'phone', 'mail', 'image', 'gender'])
  }
}

export async function getTeacherList () {
  function parseData (rawData) {
    let ret = []
    if (rawData && rawData['data']) {
      for (let item of rawData['data']) {
        ret.push(new Teacher(item))
      }
    }
    return ret
  }

  let response = await axios.get(ROOT + 'teachers/')
  return parseData(response.data)
}

export async function getStudentList () {
  function parseData (rawData) {
    let ret = []
    if (rawData && rawData['data']) {
      for (let item of rawData['data']) {
        ret.push(new BiStudent(item))
      }
    }
    return ret
  }

  let response = await axios.get(ROOT + 'students/')
  return parseData(response.data)
}

export async function getTeacherInfo (id) {
  let response = await axios.get(ROOT + `teachers/${id}/`)
  return response.data
}

export async function getStudentInfo (id) {
  let response = await axios.get(ROOT + `students/${id}/`)
  return response.data
}

export async function chooseTeacher (id) {
  let response = await axios.post(ROOT + `teachers/${id}/`)
  return response.code
}

export async function chooseStudent (id) {
  let response = await axios.post(ROOT + `students/${id}/`)
  return response.code
}

export async function getSelectedList () {
  let response = await axios.get(ROOT + 'selectedList/')
  return response.data.data
}

export async function getStuMaxSelectNum () {
  let response = await axios.get(ROOT + 'studentMaxSelectedNum/')
  return response.data.Max
}

export async function cancelTeacher (id) {
  let response = await axios.delete(ROOT + `teachers/${id}/`)
  return response.code
}

export async function cancelStudent (id) {
  let response = await axios.delete(ROOT + `/students/${id}/`)
  return response.code
}

export async function teacherChoosableId () {
  let response = await axios.get(ROOT + 'choosabelId/teacher/')
  return response.data.data
}

export async function studentChoosableId () {
  let response = await axios.get(ROOT + 'choosableId/student/')
  return response.data.data
}

export async function getInfo () {
  let response = await axios.get(ROOT + 'info/')
  return response.data
}

export async function updateInfo (info) {
  let response = await axios.put(ROOT + 'info/', stringify(info))
  return response.code
}

export async function adminGetStudentSelectedList (id) {
  let response = await axios.get(ROOT + `selectedList/students/${id}/`)
  return response.data.data
}

export async function adminGetTeacherSelectedList (id) {
  let response = await axios.get(ROOT + `selectedList/teachers/${id}/`)
  return response.data.data
}

export async function adminGetStudentChoosabelList (id) {
  let response = await axios.get(ROOT + `choosabelId/students/${id}/`)
  return response.data.data
}

export async function adminGetTeacherChoosableList (id) {
  let response = await axios.get(ROOT + `choosabelId/teachers/${id}/`)
  return response.data.data
}

export async function adminStudentChooseTeacher (stuId, teaId) {
  let response = await axios.post(ROOT + `students/${stuId}/teachers/${teaId}/`)
  return response.code
}

export async function adminStudentCancelTeacher (stuId, teaId) {
  let response = await axios.delete(ROOT + `students/${stuId}/teachers/${teaId}/`)
  return response.code
}

export async function adminTeacherChooseStudent (teaId, stuId) {
  let response = await axios.post(ROOT + `teachers/${teaId}/students/${stuId}/`)
  return response.code
}

export async function adminTeacherCancelStudent (teaId, stuId) {
  let response = await axios.delete(ROOT + `teachers/${teaId}/students/${stuId}/`)
  return response.code
}

export async function adminGetStudentInfo (stuId) {
  let response = await axios.get(ROOT + `info/students/${stuId}/`)
  return response.data.data
}

export async function adminGetTeacherInfo (teaId) {
  let response = await axios.get(ROOT + `info/teachers/${teaId}/`)
  return response.data.data
}

export async function adminUpdateStudentInfo (stuId, info) {
  let response = await axios.put(ROOT + `info/students/${stuId}/`, stringify(info))
  return response.code
}

export async function adminUpdateTeacherInfo (teaId, info) {
  let response = await axios.put(ROOT + `info/teachers/${teaId}/`, stringify(info))
  return response.code
}

export async function studentGetFileList () {
  let response = await axios.get(ROOT + 'files/')
  return response.data.data
}

export async function studentDeleteFile ({file}) {
  let response = await axios.put(ROOT + 'files/', stringify({file}))
  return response.code
}

export async function getSystemInfo () {
  let response = await axios.get(ROOT + 'systemInfo/')
  return response.data.data
}

export async function getTeacherRecruitList (id) {
  let response = await axios.get(ROOT + `recruitList/${id}/`)
  return response.data.data
}

export async function addTeacherRecruitList (id, data) {
  let response = await axios.post(ROOT + `recruitList/${id}/`, stringify(data))
  return response.code
}

export async function putTeacherRecruitList (id, data) {
  let response = await axios.put(ROOT + `recruitList/${id}/`, stringify(data))
  return response.code
}
