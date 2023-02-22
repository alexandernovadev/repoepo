import { SitesNames } from '../../../../types'
import { ContentfulTemplateTechnicalServiceMain } from '../../../../types/contentful/content-model/tm-technical-service-main'

export interface ServiceProps {
  site: SitesNames
  template: ContentfulTemplateTechnicalServiceMain
}

export interface ServiceType {
  id: string
  value: string
  slug: string
  description: string
}

export interface AssessorType {
  name: string
  workshopId: number
  active: boolean
  id: string
  time: number
  scheduledId: string
  validsBrands: Array<string>
}
export interface SlotType {
  date: Date
  slots: Array<Date>
}

export interface SlotsType {
  dates: Array<Date>
  times: Array<SlotType>
}

export interface AssessorResponse {
  receptionists?: Array<AssessorType>
}

export interface FreeSlotResponse {
  startTime?: string
  endTime?: string
  assessorsId?: Array<string>
}

export interface SlotResponse {
  date?: Date
  freeSlots?: Array<FreeSlotResponse>
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
  fullName: string
}

export interface City {
  id: string
  slug: string
  value: string
}

export interface ServiceState {
  service?: ServiceType
  description?: string
  mileage?: string
  city?: string
  date?: any
  time?: any
  comment?: string
  assessor?: AssessorType
  branchOffice?: BranchOffice
  brand?: string
}

export interface Model {
  id?: string
  value?: string
  slug?: string
}

export interface AppointmentBrand extends Model {
  brandId?: string
}

export interface ValidateDate {
  date: boolean
  time: boolean
  assessor: boolean
  loading?: boolean
}
