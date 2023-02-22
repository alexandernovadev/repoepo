import { SitesNames } from '../../types'
import { fetchWithoutToken } from '../../utils/fetch'
import { toCapitalize } from '../../utils/toCapitalize'
import {
  BranchOffice,
  Brand,
  DataItem,
  DataType,
  FetchBranchOfficesParams,
  ScheduleSale,
  SelectOption,
  Service
} from './types'

// Funcion que en base al tipo de data que se le pida realiza una peticion diferente de datos bajo la misma estructura
export const fetchBranchOfficesData = async (
  site: SitesNames,
  data: DataType,
  service: string | null,
  city: string | null,
  brand: string | null
): Promise<SelectOption[]> => {
  let url = ''

  // En base al tipo de data que pide arma la url
  switch (data) {
    case DataType.SERVICES:
      url = `customer/api/branch-office/filter/general-services`
      break
    case DataType.CITIES:
      url = `customer/api/branch-office/filter/general-city?${buildUrlSearchParams(
        {
          brand: brand,
          generalService: service !== 'TODOS' ? service : null
        }
      )}`
      break
    case DataType.BRANDS:
      url = `customer/api/branch-office/filter/brand?${buildUrlSearchParams({
        city: city !== 'TODOS' ? city : null
      })}`
      break
    default:
      break
  }

  try {
    const dataItems = (await fetchWithoutToken(url, site)) as DataItem[]

    const dataItemsParsed = dataItems?.map(({ slug, value, id }) => {
      // Segun el tipo de data cambia el valor del value que es el unico que se diferencia
      let currentValue = ''

      switch (data) {
        case DataType.SERVICES:
          currentValue = id.toString()
          break
        case DataType.CITIES:
          currentValue = id.toString()
          break
        case DataType.BRANDS:
          currentValue = slug
          break
        default:
          break
      }

      return {
        value: currentValue,
        slug,
        label: toCapitalize(value)
      }
    })

    return dataItemsParsed
  } catch (e) {
    console.error(e)
  }

  return []
}

export const fetchBranchOffices = async ({
  city,
  service,
  brand,
  site
}: FetchBranchOfficesParams): Promise<BranchOffice[]> => {
  try {
    const branchOffices = await fetchWithoutToken(
      `customer/api/branch-office/general?${buildUrlSearchParams({
        city: city !== 'TODOS' ? city : null,
        generalService: service !== 'TODOS' ? service : null,
        brand: brand !== 'TODOS' ? brand : null
      })}`,
      site
    )

    return branchOffices
  } catch (e) {
    console.error(e)
  }

  return []
}

const buildUrlSearchParams = (
  params: Record<string, string | number | null | undefined>
) => {
  const paramsArray = Object.entries(params)
    .filter((keyValuePair): keyValuePair is [string, number | string] =>
      Boolean(keyValuePair[1])
    )
    .map(([key, value]) => [
      key,
      typeof value === 'number' ? value.toString() : value
    ])

  return new URLSearchParams(paramsArray).toString()
}

export const buildSchedule = (
  scheduleSale: ScheduleSale[] | null,
  schedulePostSale: ScheduleSale[] | null
) =>
  [
    {
      name: 'Ventas',
      hours: scheduleSale?.map(({ name, hours }) => ({
        days: name,
        hours
      }))
    },
    {
      name: 'Post - Venta',
      hours: schedulePostSale?.map(({ name, hours }) => ({
        days: name,
        hours
      }))
    }
  ].filter((schedule) => schedule.hours)

export const buildSections = (
  services: Service[] | null,
  brands: Brand[] | null
) => {
  let parsedServices = {}
  let parsedBrands = {}

  if (services && services.length > 0) {
    parsedServices = {
      name: 'Ver servicios',
      items: services?.map(({ value }) => toCapitalize(value))
    }
  }

  if (brands && brands.length > 0) {
    parsedBrands = {
      name: 'Ver marcas',
      items: brands?.map(({ value }) => toCapitalize(value))
    }
  }

  return ([{ ...parsedServices }, { ...parsedBrands }] as Array<any>).filter(
    (sections) => sections.items
  )
}
