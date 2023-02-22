import { FILTERS_ENDPOINT } from '.'
import { SitesNames } from '../../../types'
import { fetchWithoutToken } from '../../../utils/fetch'
import { SelectProps } from '../types'
import { formatSelectArray } from './formatBackendResponse'

export const filterFetchSelect = async (
  data: SelectProps | any,
  site: SitesNames
) => {
  let fetchDatafirst = await fetchWithoutToken(
    `${FILTERS_ENDPOINT}${data?.data?.options?.first?.endpoint}`,
    site
  )
  let fetchDataSecond = await fetchWithoutToken(
    `${FILTERS_ENDPOINT}${data?.data?.options?.second?.endpoint}`,
    site
  )

  let formatfirstFetchData = formatSelectArray(fetchDatafirst)
  let formatSecondFetchData = formatSelectArray(fetchDataSecond)

  return {
    [data?.data?.options?.first?.query]: {
      type: data?.type,
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
            options: formatSecondFetchData
          }
        }
      }
    }
  }
}
