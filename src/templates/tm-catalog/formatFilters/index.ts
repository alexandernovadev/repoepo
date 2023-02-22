import { SitesNames } from '@gac/core-components/lib/@types/common'
import { selectSidebarMockData } from '../mock'
import { CheckboxProps, SelectProps } from '../types'
import { filterFetchCheckbox } from './formatCheckbox'
import { filterFetchMileage } from './formatMileage'
import { filterFetchPrice } from './formatPrice'
import { filterFetchSelect } from './formatSelect'
import { filterFetchYear } from './formatYear'
import { searchBranchOffice } from './searchBranchOffice'

export const FILTERS_ENDPOINT = 'catalog/api/filter/'

const filterSideBarCases = async (
  variant: string,
  data: CheckboxProps | SelectProps,
  site: SitesNames,
  priceRange: number
) => {
  switch (variant) {
    case 'checkbox':
      return await filterFetchCheckbox(data, site)

    case 'select':
      return await filterFetchSelect(data, site)

    case 'year':
      return await filterFetchYear(data, site)

    case 'list-price':
      return await filterFetchPrice(data, site, priceRange)

    case 'mileage':
      return await filterFetchMileage(data, site)

    default:
      return ''
  }
}

export const formatSidebarData = async (
  finalUrlQuery: string,
  site: SitesNames,
  priceRange: number
) => {
  const sidebarData = selectSidebarMockData(finalUrlQuery)
  const filtersArray: any = await Promise.all(
    sidebarData?.map((key: any) => {
      return filterSideBarCases(key?.type, key, site, priceRange)
    })
  )

  return filtersArray
}

const selectFindConditions = (key: string, id: string) => {
  switch (key) {
    case 'mileage':
      return parseInt(id)
    case 'listPrice':
      return parseInt(id)
    default:
      return id
  }
}

// funcion para activar los filtros por url o guardados en cache
export const addSidebarFilters = async (
  queryFilters: any,
  filtersOption: any,
  site: SitesNames
) => {
  let newActiveFilters: any = []
  const branchs: any = queryFilters.city
    ? await searchBranchOffice(queryFilters.city ?? '', site)
    : []

  // verificamos no tomar ninguna query que venga undefined
  Object.entries(queryFilters)
    ?.filter(([, query]) => query !== undefined)
    ?.forEach(async ([key, query]: any) => {
      let queryIds = query?.toString()?.split(',') // separamos los ids de cada query y los añadimos a un Array
      if (filtersOption[key]?.type === 'checkbox') {
        queryIds?.forEach((id: string) => {
          // iteramos el Array de ids
          let filtersFound = filtersOption[key]?.data?.options?.filter(
            (items: any) => parseInt(items?.id) === parseInt(id)
          ) // buscamos en las opciones de filtros los ids
          filtersFound?.forEach((itemFind: any) => {
            // iteramos los ids encontrados y los añadimos al objeto de filtros
            newActiveFilters[itemFind?.checkLabel] = {
              active: true,
              depends: undefined,
              id: itemFind?.id,
              label: itemFind?.checkLabel,
              query: key
            }
          })
        })
      } else if (key === 'branchOfficeId') {
        const findBranchId = branchs?.find(
          (branch: any) => branch?.id === queryIds[0]
        )

        newActiveFilters['Sucursal'] = {
          active: true,
          depends: 'Usado',
          id: queryIds,
          label: findBranchId?.name,
          // label: 'Test',
          query: key
        }
      } else if (key === 'modelId') {
        let filtersModelFound = filtersOption[
          'brandId'
        ]?.data?.options?.second?.options?.filter(
          (items: any) => items?.id === queryIds[0]
        )
        filtersModelFound?.forEach((itemSecondFind: any) => {
          newActiveFilters[
            `${
              filtersOption['brandId']?.data?.name +
              '-' +
              filtersOption['brandId']?.data?.options?.second?.inputLabel
            }`
          ] = {
            active: true,
            depends: 'brand-model-Marca',
            id: itemSecondFind?.id,
            label: itemSecondFind?.label,
            query: key
          }
        })
      } else {
        let filtersFirtsFound = filtersOption[
          key
        ]?.data?.options?.first?.options?.filter(
          (items: any) => items?.id === selectFindConditions(key, queryIds[0])
        )
        filtersFirtsFound?.forEach((itemFind: any) => {
          newActiveFilters[
            `${
              filtersOption[key]?.data?.name +
              '-' +
              filtersOption[key]?.data?.options?.first?.inputLabel
            }`
          ] = {
            active: true,
            depends: undefined,
            id: itemFind?.id,
            label: itemFind?.label,
            query: key
          }
        })
        let filtersSecondFound = filtersOption[
          key
        ]?.data?.options?.second?.options?.filter(
          (items: any) => items?.id === selectFindConditions(key, queryIds[1])
        )
        filtersSecondFound?.forEach((itemSecondFind: any) => {
          newActiveFilters[
            `${
              filtersOption[key]?.data?.name +
              '-' +
              filtersOption[key]?.data?.options?.second?.inputLabel
            }`
          ] = {
            active: true,
            depends: `${
              filtersOption[key]?.data?.name +
              '-' +
              filtersOption[key]?.data?.options?.first?.inputLabel
            }`,
            id: itemSecondFind?.id,
            label: itemSecondFind?.label,
            query: key
          }
        })
      }
    })

  return await newActiveFilters
}
