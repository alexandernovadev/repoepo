import { FILTERS_ENDPOINT } from '.'
import { SitesNames } from '../../../types'
import { fetchWithoutToken } from '../../../utils/fetch'

export const searchBranchOffice = async (id: string, site: SitesNames) => {
  try {
    const response = await fetchWithoutToken(
      `${FILTERS_ENDPOINT}branch-office?city=${id}`,
      site
    )
    return await response
  } catch (error) {
    console.log(error)
  }

  return {}
}
