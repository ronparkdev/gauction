import throlttle from 'lodash/throttle'
const LOCAL_STORAGE_KEY = 'GAUCTION_LOCAL_DATA'

export const LocalStorage = (() => {
  const valueMap = (() => {
    try {
      const jsonString = localStorage.getItem(LOCAL_STORAGE_KEY)
      return (jsonString && JSON.parse(jsonString)) || {}
    } catch {
      return {}
    }
  })()

  const get = (key: string): any => {
    return valueMap[key] || null
  }

  const set = (key: string, value: any) => {
    valueMap[key] = value
    flush()
  }

  const remove = (key: string) => set(key, undefined)

  // 성능을 위해 저장은 1초에 한번만 한다 (변경이 없으면 발생하지 않음)
  const flush = throlttle(() => {
    try {
      const jsonString = JSON.stringify(valueMap)
      localStorage.setItem(LOCAL_STORAGE_KEY, jsonString)
    } catch {}
  }, 1000)

  return { get, set, remove }
})()
