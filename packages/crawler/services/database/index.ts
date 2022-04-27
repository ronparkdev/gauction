import Low from 'lowdb'
import FileAsync from 'lowdb/adapters/FileAsync'

interface DatabaseGeoItem {
  value: { latitude: number; longitude: number } | 'FAILED'
  createdDate: number
  readDate: number
}

interface DatabaseModel {
  geoMap: { [address: string]: DatabaseGeoItem }
}

const DEFAULT_MODEL: DatabaseModel = {
  geoMap: {},
}

const adapter = new FileAsync<DatabaseModel>('../share/data/db.json')

const getDB = (() => {
  let cachedDB: Low.LowdbAsync<DatabaseModel>
  return async () => {
    if (cachedDB) {
      return cachedDB
    }

    // eslint-disable-next-line new-cap
    const db = await Low(adapter)
    await db.defaults(DEFAULT_MODEL).write()
    cachedDB = db
    return db
  }
})()

export const readGeoCache = async (
  address: string,
): Promise<{ latitude: number; longitude: number } | 'FAILED' | null> => {
  const db = await getDB()
  const chainItem = db.get('geoMap').get(address)
  const item = chainItem.value()
  if (!item) {
    return null
  }

  const now = new Date().getTime()

  await db.get('geoMap').get(address).assign({ readDate: now }).write()

  return item.value
}

export const writeGeoCache = async (
  data: {
    address: string
    latitude: number
    longitude: number
  } | null,
): Promise<boolean> => {
  const db = await getDB()
  const now = new Date().getTime()

  const item: DatabaseGeoItem = {
    value: data ? { latitude: data.latitude, longitude: data.longitude } : 'FAILED',
    readDate: now,
    createdDate: now,
  }

  await db.get('geoMap').set(data.address, item).write()

  return true
}
