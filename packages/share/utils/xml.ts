import { Element as XMLElement } from 'xml-js'

const getJsonFromElement = (element: XMLElement): any => {
  const keys = getElementChildKeys(element)
  if (!keys.length) {
    return null
  }
  return keys.reduce((obj, key) => {
    const valueMap = getValueFromKey<XMLElement>(element, key)?.elements?.[0] || {}
    const keyForValue = Object.keys(valueMap).find((key) => key !== 'type')
    const value = valueMap[keyForValue]

    return { ...obj, [key]: value }
  }, {})
}

const getElementChildKeys = (element: XMLElement): string[] =>
  element.elements?.map((element) => element.name).filter((name) => !!name) || []

const getValueFromKey = <T>(element: XMLElement, key: string): T | null =>
  element.elements?.find((element) => element.name === key) as T

export const XMLUtils = {
  getJsonFromElement,
  getElementChildKeys,
  getValueFromKey,
}
