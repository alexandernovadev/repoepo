import { FILTERS_ENDPOINT } from '.'
import { SitesNames } from '../../../types'
import { fetchWithoutToken } from '../../../utils/fetch'
import { SelectProps } from '../types'
import { formatMileageArray } from './formatBackendResponse'

const RANGE = 20000

export const filterFetchMileage = async (
  data: SelectProps | any,
  site: SitesNames
) => {
  let fetchDatafirst = await fetchWithoutToken(
    `${FILTERS_ENDPOINT}${data?.data?.options?.first?.endpoint}`,
    site
  )
  // obtenemos el kilometraje min y max para obtener los intervalos
  let minMileage = fetchDatafirst[0].mileage
  let maxMileage = fetchDatafirst[1].mileage
  let count = minMileage
  let objCount = [{ mileage: minMileage }]

  while (count < maxMileage) {
    count += RANGE
    if (count < maxMileage) {
      objCount.push({ mileage: count })
    } else {
      objCount.push({ mileage: maxMileage })
    }
  }

  let formatfirstFetchData = formatMileageArray(objCount)

  return {
    [data?.data?.options?.first?.query]: {
      type: 'select',
      data: {
        label: data?.data?.label,
        name: data?.data?.name,
        needBeforeSelect: data?.data?.needBeforeSelect,
        options: {
          first: {
            inputLabel: data?.data?.options?.first?.inputLabel,
            placeholder: data?.data?.options?.first?.placeholder,
            query: data?.data?.options?.first?.query,
            options: formatfirstFetchData
          },
          second: {
            inputLabel: data?.data?.options?.second?.inputLabel,
            placeholder: data?.data?.options?.second?.placeholder,
            query: data?.data?.options?.second?.query,
            options: formatfirstFetchData
          }
        }
      }
    }
  }
}
