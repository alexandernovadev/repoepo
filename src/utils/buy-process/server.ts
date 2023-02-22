import {
  getCarById,
  getCarByQuiterId,
  getContentTypeByName,
  getPageBySlug
} from '../../services'
import { SitesNames } from '../../types'
import { Car } from '../../types/contentful/car'
import { showbuyProcessByBrand } from './showBuyProcessByBrand'

export const getBuyProcessData = async (
  id: string,
  site: SitesNames,
  currentSite: string,
  quiterId = false,
  version: string,
  query?: any
) => {
  const [car, page404, buyProcessData, global] = await Promise.all([
    quiterId ? getCarByQuiterId(id, site) : getCarById(id, site),
    getPageBySlug('404', currentSite as string),
    getContentTypeByName(
      'tmBuyProcess',
      `${site} | ${version}`,
      currentSite as string
    ),
    getContentTypeByName(
      'globalInformation',
      `${site} | Global Information`,
      currentSite as string
    )
  ])

  if (car.error) {
    return {
      props: {
        ...page404,
        template: {
          ...page404?.template,
          title: buyProcessData.quiterErrorTitle ?? 'Vehículo no disponible',
          description:
            buyProcessData.quiterErrorDescription ??
            'Lo sentimos pero el vehículo que buscas no se encuentra disponible',
          warning: buyProcessData.quiterErrorWarning ?? null,
          button: null
        },
        site,
        quiterErrorRedirectTime: buyProcessData.quiterErrorRedirectTime ?? null,
        notFound: true
      }
    }
  }

  const showbuyProcessByBrandFlag = showbuyProcessByBrand(car as Car, global, version)

  if (!buyProcessData || !global || showbuyProcessByBrandFlag) {
    return {
      notFound: true
    }
  }

  ;(car as Car).contentfulColors = global.colors ?? []

  return {
    props: {
      car: { quiterIdActive: quiterId, ...car },
      ...buyProcessData,
      global,
      currentSite,
      notFound: false,
      query: query ?? {}
    }
  }
}
