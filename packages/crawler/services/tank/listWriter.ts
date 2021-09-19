import fs from 'fs-extra'
import moment from 'moment'

import { ListItem } from 'share/types/listItem'
import { PromiseUtil } from 'share/utils/promise'

import { getGeo } from '../kakaoMap/geocoderAPI'
import { createListReceiver } from './listAPI'

export const writeList = async () => {
  const filePath = `../share/data/tank-${moment().format('YYYYMMDD')}.json`

  const itemMap: { [key: string]: ListItem } = (await fs.pathExists(filePath)) ? await fs.readJson(filePath) : {}

  const writeItemMap = async () => fs.writeJSON(filePath, itemMap)

  if (Object.keys(itemMap).length === 0) {
    const receiver = createListReceiver()
    for (let i = 0; i < 10000; i++) {
      console.log(i)
      const { items, hasNext } = await receiver()
      items.forEach((item) => {
        itemMap[item.editionNo] = item
      })
      if (!hasNext) {
        break
      }
      await PromiseUtil.wait(500)
    }

    await writeItemMap()
  }

  for (const key of Object.keys(itemMap)) {
    const item = itemMap[key]
    if (!item && !item.geo) {
      return
    }

    const result = /(\d+)(-(\d+))?([\s,외번$])/.exec(item.address)

    const shortAddress = result
      ? item.address
          .slice(0, result.index + result[0].length)
          .trim()
          .replace(/[,외번]$/, '')
          .split('(')[0]
      : item.address

    const geo = await getGeo(shortAddress)

    if (!geo) {
      console.error('Geo Fail', item.address, '>', shortAddress)
    }

    item.geo = geo
    itemMap[key] = item
  }

  await writeItemMap()
}
