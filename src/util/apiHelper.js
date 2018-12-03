const ERROR_REMINDER = '连接失败'

export function throwErrorIfExists (response) {
  if (!response.data || !response.data['result']) {
    throw new Error('来自服务端的返回信息：' + response.data['message'] || ERROR_REMINDER)
  }
}
// 大小写
export function snakeToCamel (str) {
  return str.replace(/_(\w)/g, groups => groups[1].toUpperCase())
}

export function camelToSnake (str) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase()
}

export function MapPropertyNameStyle (obj, mapper, targets) {
  let ret = {}
  if (!obj) {
    return ret
  }
  for (let property in obj) {
    if (obj.hasOwnProperty(property) && targets.includes(property)) {
      ret[mapper(property)] = obj[property] === undefined ? '' : obj[property]
    }
  }
  return ret
}

export function statusCodeHandler (response) {
  const ERROR_MESSAGE = {
    '500': '服务器发生错误'
  }
  if (response.status !== 200) {
    throw new Error(ERROR_MESSAGE[response.status] || ERROR_REMINDER)
  }
}
