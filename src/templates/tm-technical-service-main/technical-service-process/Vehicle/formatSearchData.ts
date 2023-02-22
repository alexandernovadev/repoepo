import { SitesNames } from '../../../../types'
import { formatRadioButtonProps, responseProps } from './types'
import { getPatentTextVariant } from './utils'

export const newCarToAdd = {
  id: 'new-car',
  title: 'Ingresar un auto nuevo',
  description: undefined
}
export const formatSearchData = (data: Array<responseProps>, site: SitesNames) => {
  const newFormatArray: Array<formatRadioButtonProps> = data?.map(
    (vehicle: responseProps, index: number) => {
      let brand = vehicle.brand ? vehicle.brand + ' ' : ''
      let model = vehicle.model ? vehicle.model + ' ' : ''
      let year = vehicle.year ? vehicle.year : ''

      return {
        id: vehicle.patent ?? index,
        title: brand + model + year,
        description: vehicle.patent
          ? `${getPatentTextVariant(site)} ${vehicle.patent}`
          : undefined,
        ...vehicle
      }
    }
  )

  newFormatArray.push(newCarToAdd)

  return newFormatArray
}
