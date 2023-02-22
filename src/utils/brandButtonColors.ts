import { CSSProperties } from 'react'
import { ContentfulBrandProps } from '../types'

export const USED = 'usado'
export const NEW = 'nuevo'

export const getBrandButtonColors = (
  brands: ContentfulBrandProps[] | undefined | null,
  brandName: string,
  isNewCar: boolean
) => {
  if (!brands) {
    return {} as CSSProperties
  }

  const brand = !isNewCar
    ? brands.find((item) => item.title.toLowerCase() === USED)
    : brands.find(
        (item) => item.title.toLowerCase() === brandName.toLocaleLowerCase()
      )

  if (!brand) {
    return {} as CSSProperties
  }

  return {
    background: brand.buttonBackgroundColor,
    color: brand.buttonTextColor
  } as CSSProperties
}
