import { atom } from 'recoil'

import { ListItem } from 'share/types/listItem'

export const selectedListItemState = atom<ListItem | null>({
  key: 'selectedListItem',
  default: null,
})
