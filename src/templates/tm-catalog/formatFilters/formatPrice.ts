import { FILTERS_ENDPOINT } from '.'
import { SitesNames } from '../../../types'
import { fetchWithoutToken } from '../../../utils/fetch'
import { SelectProps } from '../types'
import { formatPriceArray } from './formatBackendResponse'

export const filterFetchPrice = async (
  data: SelectProps | any,
  site: SitesNames,
  priceRange: number
) => {
  let fetchDatafirst = await fetchWithoutToken(
    `${FILTERS_ENDPOINT}${data?.data?.options?.first?.endpoint}`,
    site
  )
  // obtenemos los precios min y max para obtener los intervalos
  let minPrice = fetchDatafirst[0].listPrice
  let maxPrice = fetchDatafirst[1].listPrice
  let count = 0
  let objCount = [{ price: minPrice }]

  while (count < maxPrice) {
    count += priceRange
    if (count < maxPrice) {
      objCount.push({ price: count })
    } else {
      objCount.push({ price: maxPrice })
    }
  }

  objCount = objCount.filter(
    (item) => item.price >= minPrice && item.price <= maxPrice
  )

  let formatfirstFetchData = formatPriceArray(objCount)

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
