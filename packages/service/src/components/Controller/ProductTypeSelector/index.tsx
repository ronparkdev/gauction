import { MenuItem } from '@blueprintjs/core'
import { MultiSelect } from '@blueprintjs/select'
import React, { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { filterState } from 'service/stores/atoms/filterState'
import { PRODUCT_TYPES } from 'service/types/productType'
import { styling, StylingProps } from 'service/utils/hoc/styling'

type Props = StylingProps

const ProductTypeSelector = ({ cx }: Props) => {
  const [filter, setFilter] = useRecoilState(filterState)

  const handleRemove = useCallback(
    (type: string) => {
      setFilter((filter) => {
        return { ...filter, productTypes: filter.productTypes.filter((productType) => type != productType) }
      })
    },
    [setFilter],
  )

  const handleToggle = useCallback(
    (type: string) => {
      setFilter((filter) => {
        const included = filter.productTypes.includes(type)
        return {
          ...filter,
          productTypes: included
            ? filter.productTypes.filter((productType) => productType !== type)
            : [...filter.productTypes, type],
        }
      })
    },
    [setFilter],
  )

  return (
    <>
      <div>물건 종류</div>
      <MultiSelect
        items={PRODUCT_TYPES}
        popoverProps={{ popoverClassName: cx('popover') }}
        selectedItems={filter.productTypes}
        tagRenderer={(item) => item}
        itemsEqual={(item1, item2) => item1 === item2}
        itemPredicate={(query, item) => item.includes(query)}
        itemRenderer={(productType, { modifiers, handleClick }) => {
          if (!modifiers.matchesPredicate) {
            return null
          }
          return (
            <MenuItem
              selected={modifiers.active}
              icon={filter.productTypes.includes(productType) ? 'tick' : 'blank'}
              key={productType}
              text={productType}
              onClick={() => handleToggle(productType)}
            />
          )
        }}
        noResults={<MenuItem disabled={true} text="No results." />}
        onItemSelect={(productType) => handleToggle(productType)}
        onRemove={handleRemove}
      />
    </>
  )
}

export default styling(require('./ProductTypeSelector.module.scss'))(ProductTypeSelector)
