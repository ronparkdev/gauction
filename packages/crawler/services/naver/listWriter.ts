import fs from 'fs-extra'
import moment from 'moment'

import { ListItem } from 'share/types/listItem'
import { SiType } from 'share/types/siType'
import { PromiseUtil } from 'share/utils/promise'

import { getCachedGeo } from '../kakaoMap/geocoderAPI'
import { createListReceiver } from './listAPI'

export const writeList = async () => {
  const filePath = `../share/data/naver-${moment().format('YYYYMMDD')}.json`

  const itemMap: { [key: string]: ListItem } = (await fs.pathExists(filePath)) ? await fs.readJson(filePath) : {}

  const writeItemMap = async () => fs.writeJSON(filePath, itemMap)

  if (Object.keys(itemMap).length === 0) {
    for (const siType of SiType.keys) {
      const index = SiType.keys.indexOf(siType) + 1
      console.log(`${SiType.getName(siType)} 수집중.. (${index}/${SiType.keys.length})`)

      const receiver = createListReceiver(siType)
      while (true) {
        const { items, hasNext } = await receiver()
        items.forEach((item) => {
          itemMap[`${item.editionNo}_${item.productNo}`] = item
        })
        if (!hasNext) {
          break
        }
        await PromiseUtil.wait(100)
      }
    }

    await writeItemMap()
  }

  const keys = Object.keys(itemMap)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const item = itemMap[key]
    if (!item) {
      continue
    }

    if (!item.geo) {
      const geo = await getCachedGeo(item.address)
      item.geo = geo
      itemMap[key] = item
    }

    if (i % 100 === 0) {
      console.log(`Geo 수집중... (${i} / ${keys.length})`)
      await writeItemMap()
    }
  }

  await writeItemMap()
  console.log(`Done!`)
}
