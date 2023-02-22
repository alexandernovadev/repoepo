import { FILTERS_ENDPOINT } from '.'
import { SitesNames } from '../../../types'
import { fetchWithoutToken } from '../../../utils/fetch'
import { CheckboxProps } from '../types'
import { formatCheckboxArray } from './formatBackendResponse'

export const filterFetchCheckbox = async (
  data: CheckboxProps | any,
  site: SitesNames
) => {
  let fetchData = await fetchWithoutToken(
    `${FILTERS_ENDPOINT}${data?.endpoint}`,
    site
  )

  let formatFetchData = formatCheckboxArray(fetchData, data)

  return {
    [data?.query]: {
      type: data?.type,
      query: data?.query,
      data: {
        label: data?.data?.label,
        name: data?.data?.name,
        options: formatFetchData
      }
    }
  }
}
