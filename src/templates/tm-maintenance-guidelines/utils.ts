import { MlHorizontalVariant } from '@gac/core-components'
import { ContentfulMlHorizontal, SitesNames } from '../../types'
import { MaintenanceBrand } from '../../types/contentful/content-model/tm-maintenance-guidelines'

export const getBrandsNames = (brands: MaintenanceBrand[] | undefined) => {
  if (!brands) {
    return []
  }

  return brands.map((brand) => brand.brandName).sort()
}

export const formatMlHorizontal = (
  mlHorizontal: ContentfulMlHorizontal | undefined,
  site: SitesNames
) => {
  if (!mlHorizontal) {
    return null
  }

  const link = {
    target: mlHorizontal?.link?.target,
    label: mlHorizontal?.link?.label,
    href: mlHorizontal?.link?.file?.file?.url,
    site
  }

  return {
    title: mlHorizontal.title,
    description: mlHorizontal.description,
    variant: MlHorizontalVariant.MAINTENANCE,
    site,
    link
  }
}

export const fomartModelGuidelines = (brand: MaintenanceBrand) => {
  if (!brand.guidelinesByModel) {
    return null
  }

  return brand.guidelinesByModel.map((el) => {
    return {
      brandName: brand.brandName,
      title: el.title,
      url: el.file.file.url
    }
  })
}
