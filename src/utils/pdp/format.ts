import { AtButtonProps } from '@gac/core-components'
import { BuyProcessStateProps } from '../../redux/features/buyProcessSlice'
import { BuyProcessV2State } from '../../redux/features/buyProcessV2Slice'
import { CarPlaceholderImg } from '../../redux/features/commonSlice'
import { QuoteCarData, QuoteClientData } from '../../redux/features/quoteSlice'
import { QuotationData } from '../../templates/tm-pdp/common/form-quote/types'
import { tooltip as tooltipData } from '../../templates/tm-pdp/mock'
import { Feature } from '../../templates/tm-pdp/tm-pdp-used/types'
import {
  AtButtonActionType,
  AtButtonVariant,
  SitesNames,
  ContentfulAsset,
  MlArticleVariants,
  Target,
  ContentfulBrandProps,
  Sites
} from '../../types'
import {
  Car,
  Equipment,
  Price,
  Version,
  Blog,
  CarColor,
  ContentfulColor
} from '../../types/contentful/car'
import { formatNumberToLocale } from '../formatNumber'
import { formatPhoneNumber } from '../formatPhoneNumber'
import { formatPlaceholders } from '../formatPlaceholders'
import { priceFormatter } from '../formatPrice'
import { splitArray } from '../splitArray'
import { stripFileExtension, stripSite } from '../strip'
import { toCapitalize } from '../toCapitalize'
import {
  equipmentTranslationNewCar,
  equipmentTranslationUsedCar,
  findPdpBrand
} from './'
import { getLowestPrice } from './getLowestPrice'
import { getSiteName } from '../../sites/gacSites'
import { PdpProps } from '../../components/Pdp/types'

export const formatQueryParams = (car: Car) => {
  const queryParams = {
    tipo: car.carType?.value ?? '',
    categoria: car.carCategoryType?.value ?? '',
    marca: car.carBrandType?.value ?? '',
    modelo: car.carModelType?.value ?? ''
  }

  return new URLSearchParams(queryParams).toString()
}

export const formatDescriptionData: any = (car: Car, site: SitesNames) => {
  const office = formatOffice(car, site)
  const colors = formatColors(car, site)

  let {
    listPrice,
    mainPrice,
    brandPrice,
    financingPrice,
    smartCreditPrice,
    subLabel
  } = formatPdpPrices(car, site)

  const { bonuses } = formatBonuses(car.prices, site, car.isNew)
  let tooltip = null

  if (car.isNew && bonuses.length > 0) {
    tooltip = {
      ...tooltipData,
      bonuses
    }
  }

  let mainPriceLabel = car.isNew ? 'Desde' : 'Precio oferta'
  if (!car.isNew && !mainPrice) {
    mainPriceLabel = 'Precio lista'
    mainPrice = listPrice
    listPrice = null
  }

  const data = {
    brand: car.carBrandType?.value.toLowerCase() ?? '',
    model: car.carModelType?.value.toLowerCase() ?? '',
    subLabel: car.isNew ? subLabel : '',
    detailModel: car.isNew ? '' : car.detailModel,
    listPrice,
    brandPrice,
    financingPrice,
    smartCreditPrice,
    mainPriceLabel,
    mainPrice,
    colors,
    tooltip,
    office
  }

  return data
}

export const formatBonuses = (
  prices: Price[] | null,
  site: SitesNames,
  isNew: boolean = false
) => {
  const bonuses: { label: string; value: string }[] = []
  let mapped: {
    brandBonus: string
    financingBonus: string
    smartCreditBonus: string
  }[] = []

  if (prices && prices.length > 0) {
    mapped = prices.map((price) => {
      const res = {
        brandBonus: '',
        financingBonus: '',
        smartCreditBonus: ''
      }
      const {
        currency,
        brandBonusSP,
        dealerBonusSP,
        dealerBonusCC,
        financingBrandBonusCC,
        financingBonusCC,
        dealerBonusSC,
        financingBonusSC,
        financingBrandBonusSC
      } = price

      const brandBonus = brandBonusSP! + dealerBonusSP!
      const financingBonus =
        dealerBonusCC! + financingBrandBonusCC! + financingBonusCC!
      const smartCreditBonus =
        dealerBonusSC! + financingBonusSC! + financingBrandBonusSC!

      const formattedfinancingBonus = priceFormatter(financingBonus, currency)
      const formattedBrandBonus = priceFormatter(brandBonus, currency)
      const formattedSmartCreditBonus = priceFormatter(
        smartCreditBonus,
        currency
      )

      if (financingBonus) {
        res.financingBonus = formattedfinancingBonus
      }

      if (smartCreditBonus) {
        res.smartCreditBonus = formattedSmartCreditBonus
      }

      if (brandBonus) {
        res.brandBonus = formattedBrandBonus
      }
      return res
    })
  }

  let financingBonus = mapped[0]?.financingBonus ?? ''
  let smartCreditBonus = mapped[0]?.smartCreditBonus ?? ''
  let brandBonus = mapped[0]?.brandBonus ?? ''

  if (mapped[1]) {
    financingBonus += mapped[1].financingBonus
      ? ` | ${mapped[1].financingBonus}`
      : ''
    smartCreditBonus += mapped[1].smartCreditBonus
      ? ` | ${mapped[1].smartCreditBonus}`
      : ''
    brandBonus += mapped[1].brandBonus ? ` | ${mapped[1].brandBonus}` : ''
  }

  if (financingBonus) {
    bonuses.push({
      label: 'Bono Financiamiento',
      value: financingBonus
    })
  }

  if (smartCreditBonus) {
    bonuses.push({
      label:
        site && site === SitesNames.COSECHE && isNew
          ? 'Bono Crédito Chevy Plan'
          : 'Bono Crédito Inteligente',
      value: smartCreditBonus
    })
  }

  if (brandBonus) {
    bonuses.push({
      label: 'Bono Marca',
      value: brandBonus
    })
  }

  return {
    financingBonus,
    smartCreditBonus,
    brandBonus,
    bonuses
  }
}

export const formatPdpPrices = ({ prices, isNew }: Car, site: SitesNames) => {
  if (!prices) {
    return {
      listPrice: null,
      mainPrice: null,
      subLabel: '',
      brandPrice: null,
      financingPrice: null,
      smartCreditPrice: null
    }
  }

  const mapped = prices.map(
    ({ listPrice: listP, priceCC, priceSC, priceSP, priceOP, currency }) => {
      let listPrice = listP ?? 0
      let financingPrice = priceCC ?? 0
      let smartCreditPrice = priceSC ?? 0
      let brandPrice = priceSP ?? 0
      let mainPrice = listPrice
      let subLabel = 'Precio lista' // Válido para el primer elemento en el array

      if (!isNew) {
        mainPrice = priceOP ?? 0

        return {
          listPrice: listPrice ? priceFormatter(listPrice, currency) : null,
          mainPrice: mainPrice ? priceFormatter(mainPrice, currency) : null
        }
      }

      // Ningún precio especial (financiamiento, crédito convencional, crédito inteligente)
      // puede ser igual al precio lista, en caso de que vengan igual de la API
      // debe solo mostrarse el precio lista
      if (listPrice === financingPrice) {
        financingPrice = 0
      }

      if (listPrice === smartCreditPrice) {
        smartCreditPrice = 0
      }

      if (listPrice === brandPrice) {
        brandPrice = 0
      }

      if (financingPrice > 0 && financingPrice < mainPrice) {
        mainPrice = financingPrice
        subLabel = 'Con financiamiento'
      }

      if (smartCreditPrice > 0 && smartCreditPrice < mainPrice) {
        mainPrice = smartCreditPrice
        subLabel =
          site && site === SitesNames.COSECHE && isNew
            ? 'Crédito Chevy Plan'
            : 'Crédito Inteligente'
      }

      if (brandPrice > 0 && brandPrice < mainPrice) {
        mainPrice = brandPrice
        subLabel = 'Precio contado'
      }

      // Estas condiciones "borran" el precio que fue asignado a mainPrice
      // para asi no mostrar el mismo precio 2 veces

      if (mainPrice === listPrice) {
        listPrice = 0
      } else if (mainPrice === financingPrice) {
        financingPrice = 0
      } else if (mainPrice === smartCreditPrice) {
        smartCreditPrice = 0
      } else if (mainPrice === brandPrice) {
        brandPrice = 0
      }

      return {
        subLabel,
        listPrice: listPrice ? priceFormatter(listPrice, currency) : null,
        mainPrice: mainPrice ? priceFormatter(mainPrice, currency) : null,
        brandPrice: brandPrice ? priceFormatter(brandPrice, currency) : null,
        financingPrice: financingPrice
          ? priceFormatter(financingPrice, currency)
          : null,
        smartCreditPrice: smartCreditPrice
          ? priceFormatter(smartCreditPrice, currency)
          : null
      }
    }
  )

  const firstPrices = mapped[0]
  const secondPrices = mapped[1]

  return {
    subLabel: mapped[0].subLabel,
    listPrice: setPriceObject(firstPrices?.listPrice, secondPrices?.listPrice),
    mainPrice: setPriceObject(firstPrices?.mainPrice, secondPrices?.mainPrice),
    brandPrice: setPriceObject(
      firstPrices?.brandPrice,
      secondPrices?.brandPrice
    ),
    financingPrice: setPriceObject(
      firstPrices?.financingPrice,
      secondPrices?.financingPrice
    ),
    smartCreditPrice: setPriceObject(
      firstPrices?.smartCreditPrice,
      secondPrices?.smartCreditPrice
    )
  }
}

const getValidationForColorsBySite = (carColor: CarColor, contentfulColor: ContentfulColor, site: SitesNames) => {
  switch (site) {
    // case SitesNames.COSECHE:
    // return contentfulColor?.label?.toLowerCase() === carColor?.value?.toLowerCase()
  
    default:
      return contentfulColor?.label?.toLowerCase() === carColor?.mainColor?.value.toLowerCase()
  }
}

export const formatColors = (car: Car, site: SitesNames) => {
  if (!car.isNew || !car.contentfulColors || !car.carColor) {
    return []
  }

  const formattedColors: { label: string; code: string; key: string }[] = []

  car.contentfulColors?.forEach((contentfulColor) => {
    car.carColor.forEach((item) => {
      if (getValidationForColorsBySite(item, contentfulColor, site)) {
        formattedColors.push({
          label: toCapitalize(item.value),
          code: contentfulColor.code,
          key: item?.mainColor?.value ?? ''
        })
      }
    })
  })

  return formattedColors.sort((a, b) => (a.label > b.label ? 1 : -1))
}

export const formatOffice = (car: Car, site: Sites | string) => {
  let office // de esta forma se retorna undefined en caso de que la branchOffice sea null

  if (car.branchOffice) {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${car.branchOffice?.latitude},${car.branchOffice?.longitude}`
    const whatsappUrl = car.branchOffice?.whatsapp
      ? `https://wa.me/${car.branchOffice?.whatsapp}?text=${encodeURIComponent(
          formatWhatsAppMessage(car, site)
        )}`
      : undefined

    office = {
      name: car.branchOffice.name,
      address: car.branchOffice.address,
      comuna: car.branchOffice.commune,
      map: {
        target: '_blank',
        href: mapUrl,
        label: 'Ver ubicación en el mapa'
      },
      ...(whatsappUrl
        ? {
            phone: {
              target: '_blank',
              href: whatsappUrl,
              label: `${car.branchOffice?.whatsapp}`
            }
          }
        : {})
    }
  }

  return office
}

const formatWhatsAppMessage = (car: Car, site: Sites | string) => {
  const year = car.features.find((f) => f.name === 'year')?.label ?? '2000'
  return `Hola, estoy interesado en el auto ${car.carBrandType?.value ?? ''} ${
    car.carModelType?.value ?? ''
  } Año ${year} que vi en ${getSiteName(site as string)} ${formatCarUrl(
    car
  )} ¿Me puedes dar más información?`
}

const formatCarUrl = (car: Car) => {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/vehicle/${car.id}`
  }

  return ''
}

export const formatEquipment = (
  equipmentList: Equipment,
  isNew: boolean,
  split = true
): null | string[][] | string[] => {
  const equipment = []
  const translation = isNew
    ? equipmentTranslationNewCar
    : equipmentTranslationUsedCar
  let prop: keyof typeof equipmentList

  for (prop in equipmentList) {
    if (equipmentList[prop]) {
      equipment.push(translation[prop as keyof typeof translation])
    }
  }

  if (equipment.length === 0) {
    return null
  }

  const sorted = equipment.sort()

  if (split) {
    const numsPerGroup = Math.round(sorted.length / 3)
    return splitArray(sorted, numsPerGroup)
  }

  return sorted
}

const featuresToShow = [
  'year',
  'mileage',
  'fuel',
  'transmission',
  'displacement',
  'doors'
]

export const formatFeatures = (car: Car, usedFeatures?: ContentfulAsset[]) => {
  if (!usedFeatures) return []
  const carFeatures: Feature[] = []

  let key: keyof typeof car

  // Some fields are in the car object, while others are in the car.features object
  for (key in car) {
    if (featuresToShow.includes(key) && car[key]) {
      const feature = usedFeatures.find(
        (f) => stripFileExtension(f.file.fileName.toLowerCase()) === key
      )
      if (feature) {
        const title = stripSite(feature.title)
        let value = car[key]

        if (key === 'displacement' || key === 'mileage') {
          value = formatNumberToLocale(value, key)
        }

        carFeatures.push({
          title,
          key,
          value,
          icon: {
            url: feature.file.url,
            name: title
          }
        })
      }
    }
  }

  const featuresObj = car.features
    .map(({ name, label }) => {
      let value = label

      const feature = usedFeatures.find(
        (f) => stripFileExtension(f.file.fileName.toLowerCase()) === name
      )

      if (name === 'displacement' || name === 'mileage') {
        value = formatNumberToLocale(label, name)
      }

      if (!feature) return undefined
      else {
        const title = stripSite(feature.title)

        return {
          title,
          key: name,
          value,
          icon: {
            url: feature.file.url,
            name: title
          }
        }
      }
    })
    .filter((v) => v) as Feature[]

  const featuresList = [...carFeatures, ...featuresObj]

  return featuresToShow.map(
    (feature) => featuresList.find((el) => el.key === feature)!
  )
}

export const formatVersionsFeatures = (version: Version) => {
  const features = []

  if (version.features.transmission) {
    features.push({
      id: '1',
      label: toCapitalize(version.features.transmission)
    })
  }

  if (version.performanceMix) {
    features.push({ id: '2', label: version.performanceMix })
  }

  return features
}

export const formatVersionsChecklist = (version: Version) => {
  const checklist = []
  const equipment = formatEquipment(version.equipment, true, false)
  let id = 0

  if (version.features.fuel) {
    checklist.push({
      id: `${id++}`,
      label: toCapitalize(version.features.fuel)
    })
  }

  if (version.features.displacement) {
    checklist.push({
      id: `${id++}`,
      label: formatNumberToLocale(version.features.displacement, 'displacement')
    })
  }

  if (version.features.performanceRoad) {
    checklist.push({ id: `${id++}`, label: version.features.performanceRoad })
  }

  ;(equipment as string[])?.forEach((item: string) => {
    checklist.push({
      id: `${id++}`,
      label: item
    })
  })

  return checklist.slice(0, 5)
}

export const formatVersions = (car: Car) => {
  return car.versions.map((item) => {
    const features = formatVersionsFeatures(item)
    const checkList = formatVersionsChecklist(item)
    const formatVersion: any = {
      id: item.id,
      title: car.carBrandType.value,
      subtitle: item.detailModel,
      features,
      checkList
    }

    const lowestPrice = getLowestPrice(item.prices)

    if (lowestPrice) {
      formatVersion.from = 'Precio Desde'
      formatVersion.fromValue = lowestPrice.price

      if (lowestPrice.secondPrice) {
        formatVersion.fromSecondValue = lowestPrice.secondPrice
      }
    }

    return formatVersion
  })
}

export const formatGallery = (car: Car) => {
  const images: any[] = []

  car.images.forEach((img, idx) => {
    const Img = {
      url: img,
      alt: `${car.carBrandType} - ${idx}`
    }

    images.push(Img)
  })

  return images
}

export const formatWarranty = (props: PdpProps) => {
  if (!props.warranty) {
    return null
  }

  return {
    ...props.warranty,
    image: {
      url: props.warranty?.image?.file?.url,
      name: props.warranty?.title
    }
  }
}

export const formatCarInfo = (
  car: Car,
  versionId?: string,
  useVersion: boolean = false
) => {
  const carInfo: {
    label: string
    value: string | undefined
  }[] = [
    {
      label: 'Auto marca',
      value: toCapitalize(car.carBrandType?.value ?? '')
    },
    {
      label: 'Modelo',
      value: toCapitalize(car.carModelType?.value ?? '')
    }
  ]

  const lowestPrice = getLowestPrice(car.prices)

  let priceLabel = 'Precio Desde'
  if (!car.isNew) {
    priceLabel =
      lowestPrice?.priceKey === 'listPrice' ? 'Precio Lista' : 'Precio Oferta'
  }

  let price = {
    label: priceLabel,
    value: lowestPrice?.price
  }

  let secondPrice = {
    label: '',
    value: lowestPrice?.secondPrice
  }

  if (useVersion && versionId && car.versions && car.versions.length > 0) {
    const version = car.versions.find((item) => item.id === versionId)
    const lowestVersionPrice = getLowestPrice(version?.prices)

    price.value = lowestVersionPrice?.price
    secondPrice.value = lowestVersionPrice?.secondPrice

    if (version && version.detailModel) {
      carInfo.push({
        label: 'Versión',
        value: version.detailModel
      })
    }
  }

  if (price.value) {
    carInfo.push(price)
  }

  if (secondPrice.value) {
    carInfo.push(secondPrice)
  }

  return carInfo
}

export const formatBreadcrumb = (car: Car) => {
  return [
    {
      label: 'Home',
      url: '/'
    },
    {
      label: 'Catálogo',
      url: car.previousUrl?.includes('catalog') ? car.previousUrl : '/catalog'
    },
    {
      label: toCapitalize(car.carBrandType.value) as string,
      url: '#'
    }
  ]
}

export const formatQuoteData = (
  car: Car,
  form: QuotationData,
  carPlaceholderImg: CarPlaceholderImg,
  carInfo: {
    label: string
    value: string | undefined
  }[]
) => {
  const image = car.mainImage
    ? {
        src: car.mainImage,
        alt: toCapitalize(car.carBrandType.value) as string
      }
    : { src: carPlaceholderImg.url, alt: carPlaceholderImg.alt }

  const version = carInfo.find((item) => item.label === 'Versión')
  const priceInfo = carInfo.find((items) => items.label.includes('Precio'))

  let price = {}

  if (priceInfo) {
    price = {
      [priceInfo.label]: priceInfo.value
    }
  }

  const carData: QuoteCarData = {
    image,
    brand: toCapitalize(car.carBrandType.value) as string,
    model: toCapitalize(car.carModelType.value) as string,
    version: version ? (version.value as string) : null,
    isNew: car.isNew,
    ...price
  }

  const client: QuoteClientData = {
    name: form.name,
    lastName: form.lastname,
    rut: form.rut,
    email: form.email,
    phone: formatPhoneNumber(form.phoneNumber),
    branch: form.branchOfficeId,
    comment: form.message
  }

  return {
    car: carData,
    client
  }
}

export const formatCarDetails = (car: Car, site: SitesNames) => {
  let mainArticle = null
  let mainArticleButton = null
  let articles: any

  if (car.pdfFile) {
    mainArticleButton = {
      label: 'VER FICHA',
      variant: AtButtonVariant.PRIMARY_TEXT,
      actionType: AtButtonActionType.OPEN_URL,
      actionValue: car.pdfFile,
      target: Target.BLANK
    }
  }

  if (car.description) {
    mainArticle = {
      title: `${toCapitalize(car.carModelType.value)}`,
      description: car.description,
      button: mainArticleButton as AtButtonProps,
      variant: MlArticleVariants.DEFAULT,
      site
    }
  }

  if (car?.blog) {
    let filterBlog: Blog[] = car?.blog.filter((blog) => blog?.body)
    if (filterBlog) {
      articles = filterBlog.map((blog: Blog, cont: number) => {
        return {
          button: blog?.url
            ? {
                actionType: 'Open URL',
                actionValue: blog.url,
                label: 'ver características',
                site: site,
                target: '_blank',
                variant: 'primary-text'
              }
            : null,
          description: blog?.body,
          image: {
            name: 'image-name',
            url: blog?.mainImage
          },
          site: site,
          title: blog?.title,
          variant: cont % 2 === 0 ? 'content-strip-left' : 'content-strip-right'
        }
      })
    }
  }

  return { mainArticle, articles }
}

export const formatBuyProcessCar = (
  car: Car,
  common: ReturnType<typeof formatPlaceholders>,
  versionId?: number
): Pick<BuyProcessStateProps, 'car'> => {
  const placeholder = car.isNew
    ? common.carPlaceholderImg.url
    : common.oldCarPlaceholderImage.url
  const brand = toCapitalize(car.carBrandType?.value ?? '')
  const model = toCapitalize(car.carModelType?.value ?? '')

  let price = car.prices?.[0]
  let secondPrice = car?.prices?.[1]
  let version = car?.detailModel
  let id = car.id

  if (car.isNew && versionId !== undefined) {
    const versionFound = car.versions.find(
      (version: Version) => version.id.toString() === versionId.toString()
    )
    version = versionFound?.detailModel ?? car?.detailModel
    price = versionFound?.prices?.[0] ?? car?.prices?.[0]
    secondPrice = versionFound?.prices?.[1] ?? car?.prices?.[1]
    id = versionFound?.id ?? car.id
  }

  return {
    car: {
      id,
      imageUrl: car.mainImage ?? placeholder,
      imageAlt: `${brand} ${model}`,
      brand,
      model,
      price,
      secondPrice,
      version,
      features: car.features.map(({ name, label }) => ({
        id: name,
        label: toCapitalize(label ?? '')
      })),
      financing: car.financing,
      isNew: car.isNew,
      newCarBranches: car.branches,
      usedCarBranchOffice: car.branchOffice,
      category: car.carCategoryType.value
    }
  }
}

export const formatBuyProcessCarV2 = (
  car: Car,
  common: ReturnType<typeof formatPlaceholders> & {
    brands?: ContentfulBrandProps[]
  },
  site: SitesNames,
  versionId?: number
): Pick<BuyProcessV2State, 'car'> => {
  const placeholder = car.isNew
    ? common.carPlaceholderImg.url
    : common.oldCarPlaceholderImage.url
  const brand = toCapitalize(car.carBrandType?.value ?? '')
  const model = toCapitalize(car.carModelType?.value ?? '')
  const brandData = findPdpBrand(car, common.brands!)
  const colors = formatColors(car, site)

  let price = car.prices?.[0]
  let secondPrice = car?.prices?.[1]
  let version = car?.detailModel
  let id = car.id

  if (car.isNew && versionId !== undefined) {
    const versionFound = car.versions.find(
      (version: Version) => version.id.toString() === versionId.toString()
    )
    version = versionFound?.detailModel ?? car?.detailModel
    price = versionFound?.prices?.[0] ?? car?.prices?.[0]
    secondPrice = versionFound?.prices?.[1] ?? car?.prices?.[1]
    id = versionFound?.id ?? car.id
  }
  return {
    car: {
      id,
      imageUrl: car.mainImage ?? placeholder,
      imageAlt: `${brand} ${model}`,
      logoUrl: brandData?.iconUrl ?? '',
      logoAlt: brandData?.iconAlt ?? '',
      brand,
      model,
      versions: car.versions,
      detailModel: car.detailModel,
      price,
      secondPrice,
      features: car.features.map(({ name, label }) => ({
        id: name,
        label: toCapitalize(label ?? '')
      })),
      financing: car.financing,
      isNew: car.isNew,
      newCarBranches: car.branches,
      usedCarBranchOffice: car.branchOffice,
      colors,
      version,
      mileage: parseInt(car.mileage)
    }
  }
}

export const setPriceObject = (
  price?: string | null,
  secondPrice?: string | null
) => {
  if (!price) return null

  return {
    price,
    secondPrice: secondPrice ?? null
  }
}
