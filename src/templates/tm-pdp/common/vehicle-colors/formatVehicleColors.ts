import {  SitesNames } from '../../../../types'
import { Car, CarColor } from '../../../../types/contentful/car'
import { formatColors } from '../../../../utils/pdp'
import { toCapitalize } from '../../../..//utils/toCapitalize'

export const formatVehicleColors = (car: Car, site: SitesNames) => {
  let auxColors: Array<any> = []
  let auxCarImages = {}
  let availableColors: boolean = false
  const contentfulColors = formatColors(car, site)

  if (site === SitesNames.COSECHE) {
    car?.carColor?.forEach((color: CarColor) => {
      let findColorCode = contentfulColors?.find((contentColor) => contentColor.key.toLowerCase() === color?.mainColor?.value.toLowerCase())
      if (color?.imageUrl && findColorCode ){
        availableColors = true
        auxCarImages = {
          ...auxCarImages,
          [toCapitalize(color.value)]:  color.imageUrl
        }
        auxColors.push({
          ...findColorCode,
          label: toCapitalize(color.value)
        })
      }
    })

    return {
      availableColors,
      colors: auxColors,
      carImages: auxCarImages
    }
  }

  return {
    availableColors,
    colors: [],
    carImages: []
  }
}
