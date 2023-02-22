import { CertifiedUsedData } from '../../templates/tm-pdp/common/types'
import { Currencies } from '../../utils/formatPrice'

/* eslint-disable camelcase */
export interface Car {
  id: string
  isNew: boolean
  isCertifiedUsed?: boolean
  certifiedUsedData?: CertifiedUsedData
  versions: Version[]
  carId: string
  chassisNumber: string
  detailModel: string
  listPrice: number
  prices: Price[]
  financingPrice: string
  doors: string
  displacement: string
  currency: string
  patent: string
  mileage: string
  seats?: any
  performanceCity?: any
  performanceRoad?: any
  performanceMix?: any
  description: string
  createdAt: string
  updatedAt: string
  deletedAt?: any
  carBrandType: CarType
  carType: CarType
  carModelType: CarType
  carCategoryType: CarType
  financing: boolean
  features: Feature[]
  images: string[]
  mainImage: string
  socialMediaImage?: {
    url?:string,
    type?: string,
    name?: string
  }
  equipment: Equipment
  carColor: CarColor[]
  contentfulColors?: ContentfulColor[]
  error: any
  spincar: {
    status?: string
    mainImage?: string
    url360?: string
    statusCode?: string
    message?: string
  }
  gubagooChat: boolean
  queryParams?: string
  branchOffice: BranchOffice
  branches?: BranchOffice[]
  isQuotable?: boolean
  pdfFile: string | null
  tags?: Tag[]
  previousUrl: string | null
  quiterIdActive?: boolean
  blog: [Blog]
}

export interface ContentfulColor {
  CONTENTFUL_ID: string
  CONTENT_TYPE: string
  code: string
  label: string
  name: string
}
export interface CarColor {
  id: string
  value: string
  slug: string
  imageUrl: string
  mainColor: {
    id: string
    value: string
    slug: string
  }
}

export interface BranchOffice {
  id: string
  name: string
  address: string
  commune: string
  city: string
  latitude: number
  longitude: number
  schedulePostSale: ScheduleItem[]
  scheduleSale: ScheduleItem[]
  branchOfficeId: number
  postSaleId: number
  whatsapp: number
}

export interface ScheduleItem {
  name: string
  hours: string
}

export interface Equipment {
  alarm: boolean
  absBrake: boolean
  fogLight: boolean
  ledLight: boolean
  starStop: boolean
  bluetooth: boolean
  alloyWheel: boolean
  spareWheel: boolean
  pilotAirbag: boolean
  copilotAirbag: boolean
  cruisingSpeed: boolean
  reverseSensor: boolean
  androidCarplay: boolean
  backSideAirbag: boolean
  electricMirror: boolean
  airConditioning: boolean
  foldingBackSeat: boolean
  frontSideAirbag: boolean
  isofixAnchorage: boolean
  reversingCamera: boolean
  stabilityControl: boolean
  electricPilotSeat: boolean
  engineImmobilizer: boolean
  retractableMirror: boolean
  backElectricWindow: boolean
  frontElectricWindow: boolean
  steeringWheelControl: boolean
}

interface Feature {
  name: string
  label?: string
}

interface CarType {
  id: string
  value: string
  slug: string
}

export interface Version {
  id: string
  carId?:string
  model: string
  detailModel: string
  prices: Price[]
  performanceMix: string | null
  equipment: Equipment
  features: {
    transmission: string | null
    fuel: string | null
    displacement: string | null
    performanceRoad: string | null
  }
}

/*
 CC = Conventional Credit / Credito Convencional
 SC = Smart Credit / Credito Inteligente
 SP = Spot Price / Precio Lista
 OP = Offer Price / Precio Oferta
*/
export interface Price {
  currency: Currencies
  brandBonusSP: number | null
  dealerBonusCC: number | null
  dealerBonusSC: number | null
  dealerBonusSP: number | null
  financingBonusCC: number | null
  financingBonusSC: number | null
  financingBrandBonusCC: number | null
  financingBrandBonusSC: number | null
  priceCC: number | null
  priceSC: number | null
  priceSP: number | null
  priceOP: number | null
  listPrice: number | null
}

export interface Tag {
  id: string
  slug: string
  value: string
}

export interface Blog {
  "id": number,
  "modelCode": string,
  "body": string|undefined,
  "title": string,
  "subTitle": string,
  "url": string,
  "mainImage": string
}
