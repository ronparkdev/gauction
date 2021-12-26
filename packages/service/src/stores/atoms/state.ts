import { atom } from 'recoil'

export const selectedKeyState = atom<string | null>({
  key: 'selectedKey',
  default: null,
})
