import { MlRichTextVariant } from '@gac/core-components'
import { CertifiedUsedData } from '../../templates/tm-pdp/common/types'
import { ContentfulBrandProps, ContentfulTags } from '../../types'
import { Car } from '../../types/contentful/car'
import { getUsedCertifiedTag } from '../formatMostViewsData'

export const findPdpBrand = (
  car: Car,
  brands: ContentfulBrandProps[] | null
) => {
  if (!brands) {
    return null
  }

  const brandName = car.carBrandType.value.toLowerCase()
  const data = brands.find((item) => item.title.toLowerCase() === brandName)

  if (!data) {
    return null
  }

  return {
    iconUrl: data.brand.brandImage.file.url,
    iconAlt: `Logo de ${brandName} `,
    bannerUrl: data.bannerBrand.file.url
  }
}

export const findCertifiedUsed = (
  car: Car,
  tags: Array<ContentfulTags>
): CertifiedUsedData | null => {
  const findTag = getUsedCertifiedTag(tags, car)

  if (
    findTag?.findTag
  ) {
    return {
      ...({
            tag: {
              label: findTag.tagLabel,
              icon: findTag.tagIcon,
              tagStyles: findTag.tagClasses!
            }
          }),
      section: {
        ...(findTag?.tagHeading
          ? {
              heading: {
                ...findTag.tagHeading,
                titleClassName: 'whitespace-pre',
                icon: findTag.tagIcon
              }
            }
          : {}),
        ...(findTag?.description
          ? {
              content: {
                text: findTag.description,
                variant: MlRichTextVariant.NEWS
              }
            }
          : {})
      }
    }
  }

  return null
}
