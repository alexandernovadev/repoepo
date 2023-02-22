import { ContentfulBrandProps } from '../../../types'
import { USED, NEW } from '../../../utils/brandButtonColors'

export const searchByFilter = (filters: any): string | undefined => {
  let usedValidation: boolean =
    filters?.Usado &&
    filters?.Usado?.label?.toLocaleLowerCase() === USED.toLocaleLowerCase()

  let newValidation: boolean =
    filters?.Nuevo &&
    filters?.Nuevo?.label?.toLocaleLowerCase() === NEW.toLocaleLowerCase() &&
    filters['brand-model-Marca'] === undefined

  switch (true) {
    case usedValidation:
      return filters?.Usado?.label?.toLocaleLowerCase()
    case newValidation:
      return filters?.Nuevo?.label?.toLocaleLowerCase()
    case filters['brand-model-Marca'] !== undefined:
      return filters['brand-model-Marca']?.label?.toLowerCase()
    default:
      return undefined
  }
}

export const searchContentfulBrand = ({ brands, filters }: any) => {
  let brand = null

  brands?.forEach((item: ContentfulBrandProps) => {
    let searchValidation: boolean =
      item.title.toLocaleLowerCase() === searchByFilter(filters)

    if (searchValidation) {
      brand = {
        bannerBrand: item.bannerBrand,
        brand: item?.brand,
        description: item?.description,
        name: item?.name,
        title: item?.title,
        bigBannerBrand: item?.bigBannerBrand
      }
    }
  })

  return brand
}
