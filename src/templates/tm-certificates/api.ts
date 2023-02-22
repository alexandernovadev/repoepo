import { SitesNames } from '../../types'
import { fetchWithoutToken } from '../../utils/fetch'

export const fetchCertificateCars = async (
  page: number,
  sort: number,
  tagId: number,
  site: SitesNames
) => {
  const urlQuery = `?take=15&page=${page}&sort=${sort}&tagId=${tagId}`

  try {
    const response = await fetchWithoutToken(
      `catalog/api/car/filter${urlQuery}`,
      site,
      undefined,
      'GET',
      {}
    )

    return response
  } catch (error) {
    console.error(error)
  }
}

export const fetchBrand = async (site: SitesNames, brand?: string) => {
  try {
    const response = await fetchWithoutToken(
      'catalog/api/filter/brand',
      site,
      undefined,
      'GET',
      {}
    )

    if (response && response?.length > 0) {
      let foundedBrand = response.find(
        (item: any) => item.value.toUpperCase() === brand?.toUpperCase()
      )

      return foundedBrand
    }
  } catch (error) {
    console.error(error)
  }
}
