import { LatLng } from '../../../../components/Map/types'
import { SitesNames } from '../../../../types'
import { fetchWithoutToken } from '../../../../utils/fetch'
import { toCapitalize } from '../../../../utils/toCapitalize'
import {
  AssessorResponse,
  AssessorType,
  BranchOffice,
  City,
  FreeSlotResponse,
  SlotResponse,
  SlotsType
} from './types'

const SERVICES_ENDPOINT = 'customer/api/branch-office/filter/services'
const BRANCH_OFFICES_ENDPOINT = 'customer/api/appointment'
const SLOT_ASSESORS_ENDPOINT = 'customer/api/appointment/assessors/'
const CITIES_ENDPOINT = 'customer/api/branch-office/filter/city'

export const formatCoordinates = (
  latitude: number,
  longitude: number
): LatLng => {
  return {
    lat: latitude,
    lng: longitude
  }
}

export const formatBranchOffices = (
  branchOffices: Array<BranchOffice>
): Array<string> => {
  let formatedBranchOffices = branchOffices?.map(
    (branchOffice: BranchOffice) =>
      branchOffice.fullName + ', ' + branchOffice.commune
  )

  return formatedBranchOffices || []
}

export const formatCities = (cities: Array<City>): Array<string> => {
  let formatedCities = cities?.map((city: City) => city?.value)

  return formatedCities || []
}
export const formatDate = (date: Date): Date => {
  return new Date(
    new Date(date.setDate(date.getDate() + 1)).setHours(0, 0, 0, 0)
  )
}

export const formatTime = (time?: string, date?: Date): Date => {
  const [hours, minutes, seconds] = time!.split(':')
  return new Date(date || '').setHours(
    parseInt(hours),
    parseInt(minutes),
    parseInt(seconds)
  ) as unknown as Date
}

export const formatSlots = (slots: Array<SlotResponse>): SlotsType => {
  const filteredDates = slots?.filter(
    (item: SlotResponse) => item!.freeSlots!.length > 0
  )

  const dates: Array<Date> = filteredDates?.map((item: SlotResponse) =>
    formatDate(new Date(item.date || ''))
  )

  const times = filteredDates!.map((item: SlotResponse) => {
    return {
      date: formatDate(new Date(item.date || '')),
      slots: item.freeSlots!.map((freeSlot: FreeSlotResponse) => {
        return formatTime(freeSlot!.startTime, item!.date)
      })
    }
  })

  return {
    dates,
    times
  }
}

export const formatAssessors = (assessors: AssessorResponse): Array<string> => {
  let formatedAssessors = assessors?.receptionists?.map((item: AssessorType) =>
    toCapitalize(item?.name)
  )

  if (formatedAssessors!.length > 1) {
    formatedAssessors?.push('Sin Preferencia')
  }

  return formatedAssessors || []
}

export const fetchServices = async (
  signal: any,
  brand: string,
  site: SitesNames
) => {
  try {
    const resp = await fetchWithoutToken(
      `${SERVICES_ENDPOINT}?brand=${brand}`,
      site,
      undefined,
      'GET',
      {},
      signal
    )
    return resp
  } catch {
    return []
  }
}

export const fetchAssesors = async (
  signal: any,
  workshopId: string,
  brandId: string,
  site: SitesNames
) => {
  try {
    const resp = await fetchWithoutToken(
      `${BRANCH_OFFICES_ENDPOINT}/assessors?workshopId=${workshopId}&brandId=${brandId}`,
      site,
      undefined,
      'GET',
      {},
      signal
    )
    return resp
  } catch {
    return []
  }
}

export const fetchSlotAssessors = async (
  signal: any,
  workshopId: string,
  startDate: string,
  brandId: string,
  site: SitesNames,
  receptionistsId?: string
) => {
  try {
    const resp = await fetchWithoutToken(
      `${SLOT_ASSESORS_ENDPOINT}free-slots?workshopId=${workshopId}&startDate=${startDate}&brandId=${brandId}${
        receptionistsId ? `&receptionistsId=${receptionistsId}` : ''
      }`,
      site,
      undefined,
      'GET',
      {},
      signal
    )
    return resp
  } catch {
    return []
  }
}

export const fetchCities = async (
  signal: any,
  brand: string,
  service: string,
  site: SitesNames
) => {
  try {
    const resp = await fetchWithoutToken(
      `${CITIES_ENDPOINT}?brand=${brand}&service=${service}`,
      site,
      undefined,
      'GET',
      {},
      signal
    )

    return resp
  } catch {
    return []
  }
}

export const fetchBranchOffices = async (
  signal: any,
  city: string,
  site: SitesNames,
  brandId?: string,
  service?: string
) => {
  try {
    const resp = await fetchWithoutToken(
      `${BRANCH_OFFICES_ENDPOINT}/branch?brandId=${brandId}&city=${city}&service=${service}`,
      site,
      undefined,
      'GET',
      {},
      signal
    )
    return resp
  } catch {
    return []
  }
}

export const fetchAppointmentsBrands = async (site: SitesNames) => {
  try {
    const resp = await fetchWithoutToken(
      `${BRANCH_OFFICES_ENDPOINT}/brand`,
      site
    )

    return resp
  } catch {
    return []
  }
}

export const fetchAppointmentsModel = async (
  brandId: string,
  site: SitesNames
) => {
  try {
    const resp = await fetchWithoutToken(
      `${BRANCH_OFFICES_ENDPOINT}/model?brandId=${brandId}`,
      site
    )

    return resp
  } catch {
    return []
  }
}

export const invalidStatusCode = (statusCode: number): boolean => {
  if (statusCode !== undefined && statusCode !== 200 && statusCode !== 201) {
    return true
  }
  return false
}
