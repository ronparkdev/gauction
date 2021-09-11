import { DefaultValue } from 'recoil'

import { LocalStorage } from 'service/stores/permanent/localStorage'

export const localForageEffect =
  (key) =>
  ({ setSelf, onSet }) => {
    setSelf(LocalStorage.get(key) || new DefaultValue())
    onSet((newValue) => {
      if (newValue instanceof DefaultValue) {
        LocalStorage.remove(key)
      } else {
        LocalStorage.set(key, newValue)
      }
    })
  }
