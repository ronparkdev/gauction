import { MenuItem } from '@blueprintjs/core'
import { MultiSelect } from '@blueprintjs/select'
import React, { useCallback } from 'react'
import { useRecoilState } from 'recoil'

import { filterProductTypesState } from 'service/stores/atoms/filterState'
import { PRODUCT_TYPES } from 'service/types/productType'
import { styling, StylingProps } from 'service/utils/hoc/styling'

type Props = StylingProps

const ProductTypeSelector = ({ cx }: Props) => {
  const [productTypes, setProductTypes] = useRecoilState(filterProductTypesState)

  const handleRemove = useCallback(
    (type: string) => {
      setProductTypes((productTypes) => productTypes.filter((productType) => type != productType))
    },
    [setProductTypes],
  )

  const handleToggle = useCallback(
    (type: string) => {
      setProductTypes((productTypes) =>
        productTypes.includes(type)
          ? productTypes.filter((productType) => productType !== type)
          : [...productTypes, type],
      )
    },
    [setProductTypes],
  )

  return (
    <>
      <div>물건 종류</div>
      <MultiSelect
        items={PRODUCT_TYPES}
        popoverProps={{ popoverClassName: cx('popover') }}
        selectedItems={productTypes}
        tagRenderer={(t) => t}
        itemRenderer={(productType) => (
          <MenuItem
            active={productTypes.includes(productType)}
            key={productType}
            text={productType}
            onClick={() => handleToggle(productType)}
          />
        )}
        onItemSelect={(t) => alert(t)}
        onRemove={handleRemove}
      />
    </>
  )
}

export default styling(require('./ProductTypeSelector.module.scss'))(ProductTypeSelector)
