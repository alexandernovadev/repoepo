import { SitesNames } from '../../../types'
import { fetchWithoutToken } from '../../../utils/fetch'
import { FILTERS_ENDPOINT } from '../formatFilters'

export const getSelectOptions = async ({
  endpoint,
  signal,
  site
}: {
  endpoint: string
  signal: AbortSignal
  site: SitesNames
}) => {
  try {
    const response = await fetchWithoutToken(
      `${FILTERS_ENDPOINT}${endpoint}`,
      site,
      {
        signal
      }
    )
    return response
  } catch (error) {
    console.log(error)
  }
}

export const formatFiltersUsadosResponse = (response: any, type: string) => {
  let formatResponse: any = []
  switch (type) {
    case 'city':
      response?.forEach((city: any) => {
        formatResponse.push({
          label: city?.value,
          value: city?.value,
          slug: city?.slug,
          id: city?.id
        })
      })
      return formatResponse
    case 'sucursal':
      response?.forEach((branchOffice: any) => {
        formatResponse.push({
          label: branchOffice?.name,
          value: branchOffice?.name,
          id: branchOffice?.id,
          branchOfficeId: branchOffice?.branchOfficeId
        })
      })
      return formatResponse
  }

  return {}
}
