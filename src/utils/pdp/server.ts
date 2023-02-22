import {
  // getAssetByNameAndResize,
  getCarById,
  getCarByQuiterId,
  getContentTypeByName,
  getPageBySlug,
  resizeImage
} from '../../services'
import { GlobalInformation, SitesNames } from '../../types'
import { Car } from '../../types/contentful/car'
import {
  getCorrectFormByPdp,
  showbuyProcessByBrand
} from '../buy-process/showBuyProcessByBrand'
import { findCertifiedUsed } from './findBrand'

export const getPdpData = async (
  id: string,
  site: SitesNames,
  currentSite: string,
  previousUrl: string | undefined,
  quiterId = false
) => {
  const [car, page404, pdp, global] = await Promise.all([
    quiterId ? getCarByQuiterId(id, site) : getCarById(id, site),
    getPageBySlug('404', currentSite as string),
    getContentTypeByName(
      'tmPdp',
      `${site} | Ficha de auto`,
      currentSite as string
    ),
    getContentTypeByName(
      'globalInformation',
      `${site} | Global Information`,
      currentSite as string
    )
    // Contentful getAssetByNameAndResize(`${site} | tigo-123`)
  ])

  if (car.error) {
    return {
      props: {
        ...page404,
        template: {
          ...page404?.template,
          title: pdp.quiterErrorTitle ?? 'Vehículo no disponible',
          description:
            pdp.quiterErrorDescription ??
            'Lo sentimos pero el vehículo que buscas no se encuentra disponible',
          warning: pdp.quiterErrorWarning ?? null,
          button: null
        },
        site,
        quiterErrorRedirectTime: pdp.quiterErrorRedirectTime ?? null,
        notFound: true
      }
    }
  }

  if (!pdp || !global) {
    return {
      notFound: true
    }
  }

  // Obtenemos el estado visible del flujo de compra (No, v1, v2) por Marca del auto
  const enablePurchasingByBrandFlag = showbuyProcessByBrand(
    car as Car,
    global,
    'Pdp'
  )

  ;(car as Car).contentfulColors = global.colors
  ;(car as Car).previousUrl = previousUrl ?? null


  // ContentFul Method
  // ;(car as Car).socialMediaImage = imageSocialMedia --> Debe destructurar del promoseAll

  // Cloudinary method
  /* @ts-ignore next line */
  const urlSocicalMedia = await resizeImage(car.images[0])
  ;(car as Car).socialMediaImage = urlSocicalMedia

  const certifiedUsedData = findCertifiedUsed(car as Car, global.tags)
  if (certifiedUsedData) {
    ;(car as Car).certifiedUsedData = certifiedUsedData
    ;(car as Car).isCertifiedUsed = true
  }

  // imgix method

  // kraken method


  return {
    props: {
      car,
      ...pdp,
      // si el flujo de compra esta visible desde la ficha de auto, revisamos los status de marca, si no esta activo retornamos false para mostrar el formulario de cotizacion
      enablePurchasing: pdp?.enablePurchasing
        ? enablePurchasingByBrandFlag?.No
          ? false
          : getCorrectFormByPdp(
              enablePurchasingByBrandFlag,
              pdp?.purchaseRoute,
              car as Car,
              global as GlobalInformation
            )
        : pdp?.enablePurchasing,
      global,
      currentSite,
      notFound: false
    }
  }
}
