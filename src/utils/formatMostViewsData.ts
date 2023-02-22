import { ContentfulTags, SitesNames } from '../types'
import { Car, Price } from '../types/contentful/car'
import { pricesProps } from '../types/Layouts'
import { formatNumberToLocale } from './formatNumber'
import { Currencies, priceFormatter } from './formatPrice'
import { formatBonuses } from './pdp'
import { toCapitalize } from './toCapitalize'

// const NEW_CAR_FEATURE_PRIORITY = {
//   fuel: 1,
//   category: 2,
//   transmission: 3,
//   traction: 4
// }

const USED_CAR_FEATURE_PRIORITY = {
  year: 1,
  category: 2,
  fuel: 3,
  color: 4,
  transmission: 5,
  traction: 6
}

const getFeaturePriority = (
  priorities: Record<string, number | undefined>,
  feature: string
) => priorities[feature] ?? Infinity

// const getNewCarFeaturePriority = (feature: string) =>
//   getFeaturePriority(NEW_CAR_FEATURE_PRIORITY, feature)

const getUsedCarFeaturePriority = (feature: string) =>
  getFeaturePriority(USED_CAR_FEATURE_PRIORITY, feature)

const parseFeatures = (
  features: Array<any>,
  isNew: boolean
): Array<any> | undefined => {
  if (features) {
    const parsedFeatures = features
      .filter(({ name }) => name !== 'company')
      .map(({ name, label }) => {
        return {
          name,
          label: toCapitalize(label)
        }
      })

    const parsedNewsFeatures = features
      .filter(({ name }) => name === 'category')
      .map(({ name, label }) => {
        return {
          name,
          label: toCapitalize(label)
        }
      })

    if (isNew) {
      // return parsedFeatures.sort(
      //   (a, b) => getNewCarFeaturePriority(a.name) - getNewCarFeaturePriority(b.name)
      // )
      return parsedNewsFeatures
    } else {
      return parsedFeatures.sort(
        (a, b) =>
          getUsedCarFeaturePriority(a.name) - getUsedCarFeaturePriority(b.name)
      )
    }
  }

  return undefined
}

const findCarType = (carType: any): boolean | undefined => {
  if (carType?.value?.toUpperCase() === 'NUEVO') {
    return true
  }
  return false
}

interface selectCarPriceProps {
  price: number | undefined
  secondPrice: number | undefined
  type: string | undefined
  listPrice: number | undefined
  currentType: string | undefined
}

const selectCarPrice = (prices: Array<pricesProps>) => {
  if (!prices) {
    return {
      price: undefined,
      type: undefined,
      listPrice: undefined,
      currentType: undefined,
      OriginalListPrice: undefined
    }
  }

  const currency = prices[0]?.currency as Currencies
  const secondCurrency = prices[1]?.currency ?? ''
  const cashPrice = prices[0]?.priceSP ?? 0 // precio contado
  const isListPrice =
    (prices[0]?.priceSC > 0 && prices[0]?.priceSC < prices[0]?.listPrice) ||
    (prices[0]?.priceCC > 0 && prices[0]?.priceCC < prices[0]?.listPrice) ||
    (cashPrice > 0 && cashPrice < prices[0]?.listPrice)

  let currentPrice: selectCarPriceProps = {
    price: prices[0]?.priceCC ?? prices[0].priceSC ?? prices[0]?.listPrice, // seleccionamos un precio base para comenzar la evaluacion de las propiedades (bonos, tipos, etc...)
    secondPrice:
      prices[1]?.priceCC ?? prices[1]?.priceSC ?? prices[1]?.listPrice,
    type:
      !prices[0]?.priceCC && prices[0].priceSC
        ? '*Con financiamiento'
        : undefined, // inicialmente si comenzamos con precio credito inteligente agregamos el type *Con financiamiento
    // si el precio lista es el mayor de todos lo agregamos ya que esta prop va tachada
    listPrice: isListPrice ? prices[0]?.listPrice : undefined,
    currentType: prices[0]?.priceCC
      ? 'financingBonus'
      : prices[0].priceSC
      ? 'smartCreditBonus'
      : prices[0]?.listPrice
      ? 'brandBonus'
      : undefined
  }

  if (prices[0]?.priceSC > 0 && prices[0]?.priceSC < currentPrice?.price!) {
    currentPrice.price = prices[0].priceSC
    currentPrice.secondPrice = prices[1]?.priceSC
    currentPrice.type = '*Con financiamiento'
    currentPrice.listPrice = prices[0]?.listPrice ?? undefined
    currentPrice.currentType = 'smartCreditBonus'
  }

  if (prices[0]?.listPrice > 0 && prices[0]?.listPrice < currentPrice?.price!) {
    currentPrice.price = prices[0].listPrice
    currentPrice.secondPrice = prices[1]?.listPrice
    currentPrice.type = undefined
    currentPrice.listPrice = undefined
    currentPrice.currentType = 'brandBonus'
  }

  if (cashPrice > 0 && cashPrice < currentPrice.price!) {
    currentPrice.price = cashPrice
    currentPrice.secondPrice = prices[1]?.priceSP
    currentPrice.type = undefined
    currentPrice.listPrice = prices[0].listPrice ?? undefined
    currentPrice.currentType = 'brandBonus'
  }

  return {
    price: currentPrice?.price
      ? priceFormatter(currentPrice?.price, currency)
      : undefined,
    secondPrice: currentPrice?.secondPrice
      ? priceFormatter(currentPrice?.secondPrice, secondCurrency as Currencies)
      : undefined,
    // priceOffer: propiedad para menajar el precio oferta de los autos
    priceOffer: prices[0]?.priceOP
      ? priceFormatter(prices[0]?.priceOP, currency)
      : null,
    // secondPriceOffer: propiedad para menajar el precio oferta de los autos en otro formato de moneda (soles, pesos, etc...)
    secondPriceOffer: prices[1]?.priceOP
      ? priceFormatter(prices[1]?.priceOP, secondCurrency as Currencies)
      : null,
    type: currentPrice?.type,
    listPrice: !currentPrice?.listPrice
      ? undefined
      : prices[1]?.listPrice
      ? `${priceFormatter(
          currentPrice?.listPrice,
          currency
        )} | ${priceFormatter(
          prices[1].listPrice,
          secondCurrency as Currencies
        )}`
      : priceFormatter(currentPrice?.listPrice, currency),

    currentType: currentPrice.currentType,
    OriginalListPrice:
      prices[0]?.listPrice > 0
        ? priceFormatter(prices[0]?.listPrice, currency)
        : undefined
  }
}

const carTooltipData = (
  prices: Price[],
  isNew: boolean,
  site: SitesNames
): any => {
  if (!prices) {
    return {}
  }

  const { bonuses, brandBonus, financingBonus, smartCreditBonus } =
    formatBonuses(prices, site, isNew)

  if (bonuses.length === 0) {
    return {}
  }

  return {
    extraInformation: {
      bonuses,
      termsAndConditions:
        'Bonos asociados pueden variar dependiendo la forma de pago, puedes revisar las condiciones legales en el siguiente enlace: ',
      termsAndConditionsLinkLabel: 'Terminos y Condiciones.',
      termsAndConditionsLinkUrl: '/terminos-y-condiciones'
    },
    financingBonus: financingBonus,
    smartCreditBonus: smartCreditBonus,
    brandBonus: brandBonus
  }
}

const chooseCarData = (
  item: any,
  typeCar: boolean,
  carPlaceholderImg: { url: string; alt: string },
  oldCarPlaceholderImage: { url: string; alt: string },
  site: SitesNames,
  tags?: Array<ContentfulTags>
) => {
  const carPrice = selectCarPrice(item?.prices)
  let usedCertifiedTag = getUsedCertifiedTag(tags, item)
  let mileage: string = formatNumberToLocale(item?.mileage, 'mileage')
  let displacement: string = formatNumberToLocale(
    item?.displacement,
    'displacement'
  )
  let description
  const isPriceOffer = carPrice.priceOffer ? true : false

  if (item?.displacement !== null && item?.mileage !== null) {
    description = `${displacement} - ${mileage}`
  } else if (item?.displacement !== null) {
    description = `${displacement}`
  } else if (item?.mileage !== null) {
    description = `${mileage}`
  }

  switch (typeCar) {
    case true:
      return {
        variant: 'advanced',
        id: item.id ?? undefined,
        carData: {
          brand: toCapitalize(item?.carBrandType?.value) ?? undefined,
          model: toCapitalize(item?.carModelType?.value) ?? undefined,
          // VALIDAMOS: Si tenemos precio oferta mostramos como precio principal el precio oferta de lo contrario mostramos los calculos cotidianos de precios establecidos inicialmente
          price: isPriceOffer ? carPrice.priceOffer : carPrice.price,
          // VALIDAMOS: Si tenemos precio oferta mostramos la conversion del precio oferta OJO!
          secondPrice: isPriceOffer
            ? carPrice.secondPriceOffer
            : carPrice.secondPrice,
          newCar: typeCar ?? undefined,
          priceList: carPrice.listPrice,
          // si tenemos el precio oferta debemos ocultar los bonos por eso se agrega la validacion
          bonus: isPriceOffer
            ? null
            : (carTooltipData(item?.prices, typeCar, site)[
                carPrice?.currentType!
              ] as any) ?? undefined,
          // si tenemos el precio oferta debemos ocultar el tooltip por eso se agrega la validacion
          extraInformation: isPriceOffer
            ? null
            : carTooltipData(item?.prices, typeCar, site).extraInformation,
          priceDescription: carPrice.type,
          carImage:
            item?.mainImage ??
            (typeCar ? carPlaceholderImg.url : oldCarPlaceholderImage.url),
          features:
            parseFeatures(item?.features, typeCar ?? false) ?? undefined,
          brandUrl: item?.brandUrl ?? undefined,
          // propiedad utilizada para activar y agregar el label precio oferta en la card de auto
          priceOffer: isPriceOffer
            ? {
                label: 'Precio Oferta'
              }
            : null
        }
      }
    default:
      return {
        variant: isPriceOffer ? 'advanced' : 'basic',
        id: item.id ?? undefined,
        tagLabel: usedCertifiedTag?.tagLabel,
        tagClasses: usedCertifiedTag?.tagClasses,
        tagIcon: usedCertifiedTag?.tagIcon,
        carData: {
          brand: toCapitalize(item?.carBrandType?.value) ?? undefined,
          model: toCapitalize(item?.carModelType?.value) ?? undefined,
          description: description,
          // VALIDAMOS: Si tenemos precio oferta mostramos como precio principal el precio oferta
          price: isPriceOffer
            ? carPrice.priceOffer
            : carPrice.OriginalListPrice,
          // VALIDAMOS: Si tenemos precio oferta mostramos la conversion del precio oferta OJO!
          secondPrice: isPriceOffer
            ? carPrice.secondPriceOffer
            : carPrice.secondPrice,
          priceList: isPriceOffer
            ? carPrice.OriginalListPrice
            : carPrice.listPrice,
          // si tenemos el precio oferta debemos ocultar los bonos por eso se agrega la validacion
          bonus: isPriceOffer
            ? null
            : (carTooltipData(item?.prices, typeCar, site)[
                carPrice?.currentType!
              ] as any) ?? undefined,
          // si tenemos el precio oferta debemos ocultar el tooltip por eso se agrega la validacion
          extraInformation: isPriceOffer
            ? null
            : carTooltipData(item?.prices, typeCar, site).extraInformation,
          newCar: false,
          patent: item?.patent ?? null,
          carImage: item?.mainImage ?? oldCarPlaceholderImage.url,
          features:
            parseFeatures(item?.features, typeCar ?? false) ?? undefined,
          brandUrl: item?.brandUrl ?? undefined,
          // propiedad utilizada para activar y agregar el label precio oferta en la card de auto
          priceOffer: isPriceOffer
            ? {
                label: 'Precio Oferta'
              }
            : null
        }
      }
  }
}

export const getUsedCertifiedTag = (
  allTags: Array<ContentfulTags> | undefined = [],
  car: Car
) => {
  if (allTags?.length > 0) {
    const finalCarTags: Array<ContentfulTags> | undefined = []
    allTags?.forEach((contentfulTag) => {
      car?.tags?.forEach((tag) => {
        if (contentfulTag.tagId === tag.id) {
          finalCarTags.push(contentfulTag)
        }
      })
    })

    return {
      tagLabel: finalCarTags[0]?.label ?? '',
      tagClasses: finalCarTags[0]?.color
        ? {
            backgroundColor: finalCarTags[0]?.color,
            color: finalCarTags[0]?.textColor
          }
        : null,
      tagIcon: finalCarTags[0]?.iconTag.file.url ?? '',
      findTag: finalCarTags[0] ? true : false,
      description: finalCarTags[0]?.description ?? null,
      tagHeading: finalCarTags[0]?.tagHeading
    }
  }
}

export const parseResponse = (
  response: any,
  carPlaceholderImg: { url: string; alt: string },
  oldCarPlaceholderImage: { url: string; alt: string },
  site: SitesNames,
  tags?: Array<ContentfulTags>
) => {
  const parsedResponse = response?.map((item: any) => {
    let newCar = findCarType(item?.carType)
    let carData = chooseCarData(
      item,
      newCar!,
      carPlaceholderImg,
      oldCarPlaceholderImage,
      site,
      tags
    )
    return carData
  })

  return parsedResponse
}
