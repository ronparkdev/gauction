let itemMap = {}

const makeResult = (type, request) => {
  switch (type) {
    case 'LOAD': {
      itemMap = Object.keys(request).reduce((map, key) => {
        map[key] = { ...request[key], key }
        return map
      }, {})
      return
    }
    case 'READ': {
      const { viewport, filter } = request

      const centerLatitude = (viewport.startLatitude + viewport.endLatitude) / 2
      const centerLongitude = (viewport.startLongitude + viewport.endLongitude) / 2

      return Object.keys(itemMap)
        .map((key) => itemMap[key])
        .filter((item) => item.geo)
        .filter((item) => {
          const pricePerArea = item.lowPrice / item.groundSize

          const isInsideViewport =
            viewport.startLatitude <= item.geo.latitude &&
            viewport.endLatitude >= item.geo.latitude &&
            viewport.startLongitude <= item.geo.longitude &&
            viewport.endLongitude >= item.geo.longitude

          const includeAppraisedPrice =
            !item.appraisedPrice ||
            (filter.appraisedPriceRange.min <= item.appraisedPrice / 10000 &&
              filter.appraisedPriceRange.max >= item.appraisedPrice / 10000)

          const includeLowPrice =
            filter.lowPriceRange.min <= item.lowPrice / 10000 && filter.lowPriceRange.max >= item.lowPrice / 10000

          const includePricePerArea =
            filter.pricePerAreaRange.min <= pricePerArea / 10000 && filter.pricePerAreaRange.max >= pricePerArea / 10000

          const includeProductType = filter.productTypes.includes(item.productType)

          return (
            isInsideViewport && includeAppraisedPrice && includeLowPrice && includePricePerArea && includeProductType
          )
        })
        .map((item) => {
          const x = centerLatitude - item.geo.latitude
          const y = centerLongitude - item.geo.longitude
          const distanceFromCenter = Math.sqrt(x * x + y * y)
          return { ...item, distanceFromCenter }
        })
        .sort((item1, item2) => {
          return item1.distanceFromCenter - item2.distanceFromCenter
        })
        .slice(0, 100)
    }
  }
}

self.addEventListener('message', ({ data }) => {
  const { type, id, request } = data
  try {
    const result = makeResult(type, request)
    return self.postMessage({ id, result })
  } catch (error) {
    return self.postMessage({ id, error })
  }
})
