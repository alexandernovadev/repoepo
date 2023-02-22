import { Sites } from '../../types'
import { ContentfulTemplateBranchOfficesMain } from '../../types/contentful/content-model/tm-branch-offices-main'

export interface TmBranchOfficesMainProps extends Sites {
  template: ContentfulTemplateBranchOfficesMain
}

export type SelectOption = {
  label: string
  value: string
  slug?: string
}

export interface FetchCitiesParams {
  brand: string | null
  service: string | null
}

export interface FetchBrandsParams {
  city: string | null
}

export interface Brand {
  id: number
  slug: string
  value: string
}

export interface FetchServicesParams {
  city: string | null
  brand: string | null
}

export interface Service {
  id: number
  slug: string
  value: string
}

export interface ScheduleSale {
  name: string
  hours: string
}

export interface BranchOffice {
  id: string
  name: string
  slug: string
  address: string
  commune: string
  city: string
  latitude: number
  longitude: number
  schedulePostSale: ScheduleSale[] | null
  scheduleSale: ScheduleSale[]
  branchOfficeId: number
  leadCenterCodeUsed: string
  services: Service[] | null
  brands: Brand[] | null
  postSaleId: number
  whatsapp: number
}

export interface FetchBranchOfficesParams extends Sites {
  city: string | null
  service: string | null
  brand: string | null
}

export interface useBranchOfficesProps extends FetchBranchOfficesParams {
  data: DataType
}

export enum DataType {
  SERVICES = 'services',
  CITIES = 'cities',
  BRANDS = 'brands',
  BRANCHOFFICES = 'branch-offices'
}

export interface DataItem {
  id: number
  slug: string
  value: string
}
