import fs from 'fs-extra'
import moment from 'moment'

import { ListItem } from 'share/types/listItem'
import { SiType } from 'share/types/siType'
import { PromiseUtil } from 'share/utils/promise'

import { getGeo } from '../kakaoMap/geocoderAPI'
import { createListReceiver } from './listAPI'

export const writeList = async () => {
  const filePath = `../share/data/${moment().format('YYYYMMDD')}.json`

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

  for (const key of Object.keys(itemMap)) {
    const item = itemMap[key]
    if (!item && !item.geo) {
      return
    }

    const geo = await getGeo(item.address)
    item.geo = geo
    itemMap[key] = item
  }

  await writeItemMap()
}
