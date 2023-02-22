import { SitesNames } from '../../types'
import { Car } from '../../types/contentful/car'
import { fetchWithoutToken } from '../../utils/fetch'
import { formatQueryParams } from '../../utils/pdp'

const endpoint = 'catalog/api/car'

export const getCarById = async (id: string, site: SitesNames) => {
  try {
    const res: Car = await fetchWithoutToken(`${endpoint}?id=${id}`, site)
    return getAllCarInformation(res, site)
  } catch (error) {
    console.error(error)
    return {
      error: true
    }
  }
}

export const getCarByQuiterId = async (quiterId: string, site: SitesNames) => {
  if (!quiterId) return { error: true }

  try {
    const res: Car = await fetchWithoutToken(
      `${endpoint}?quiterId=${quiterId}`,
      site
    )
    return getAllCarInformation(res, site)
  } catch (error) {
    console.error(error)
    return {
      error: true
    }
  }
}

export const getSpincar = async (car: Car, site: SitesNames) => {
  const spincar = await fetchWithoutToken(
    `${endpoint}/spin-car?carId=${car.id}`,
    site
  )
  return spincar
}

export const getCarVersions = async (id: string, site: SitesNames) => {
  const res = await fetchWithoutToken(
    `${endpoint}/version-info?modelId=${id}`,
    site
  )
  return res
}

export const getNewCarBranches = async (id: string, site: SitesNames) => {
  const res = await fetchWithoutToken(
    `customer/api/branch-office?brand=${id}`,
    site
  )
  return res
}

const getAllCarInformation = async (car: Car, site: SitesNames) => {
  try {
    const isNew = car.carType.id === '1'
    car.isNew = isNew

    const spincar = await getSpincar(car, site)
    car.spincar = spincar

    car.queryParams = formatQueryParams(car)

    if (isNew) {
      const modelId = car.carModelType.id
      const brand = car.carBrandType.slug

      const [versions, branches] = await Promise.all([
        getCarVersions(modelId, site),
        getNewCarBranches(brand, site)
      ])

      car.versions = versions
      car.branches = branches
    }

    return car
  } catch (error) {
    console.error(error)
    return {
      error: true
    }
  }
}
