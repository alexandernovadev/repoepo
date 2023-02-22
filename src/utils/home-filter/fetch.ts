import { option } from '@gac/core-components/lib/@types/common'
import {
  MlFilterOptions,
  MlFilterState
} from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-filter/types'
import { formatOptions, formatQuery } from '.'
import { SitesNames } from '../../types'
import { fetchWithoutToken } from '../fetch'
import { getSelectFilterObject, validateState } from './validateState'

const endpoint = 'catalog/api'

const getFilterParams = (selectFilter: string | boolean) => {
  switch (selectFilter) {
    case 'Nuevos':
      return '?typeId=1'

    case 'Usados':
      return '?typeId=2'
  
    default:
      return ''
  }
}

export const fetchInitData = async (site: SitesNames, selectFilter: string | boolean) => {
  const filterParams = getFilterParams(selectFilter)

  const [results, type, categories, brands] = await Promise.all([
    fetchWithoutToken(`${endpoint}/car/filter${filterParams}`, site),
    !selectFilter ? fetchWithoutToken(`${endpoint}/filter/type`, site) : [],
    fetchWithoutToken(`${endpoint}/filter/category${filterParams}`, site),
    fetchWithoutToken(`${endpoint}/filter/brand${filterParams}`, site)
  ])

  const formattedOptions = {
    type: formatOptions(type),
    category: formatOptions(categories),
    brand: formatOptions(brands),
    model: []
  }

  return {
    total: results.params.total,
    formattedOptions
  }
}

export const fetchOnSelectChange = async (
  state: MlFilterState,
  currentOptions: MlFilterOptions,
  name: string,
  site: SitesNames,
  selectFilter: string | boolean
) => {
  const fullQuery = formatQuery(state, [], selectFilter)
  const categoryQuery = formatQuery(state, ['category', 'brand', 'model'], selectFilter)
  const brandsQuery = formatQuery(state, ['brand', 'model'], selectFilter)

  const [categories, brands, models] = await Promise.all([
    fetchWithoutToken(`${endpoint}/filter/category${categoryQuery}`, site),
    fetchWithoutToken(`${endpoint}/filter/brand${brandsQuery}`, site),
    fetchWithoutToken(`${endpoint}/filter/model${fullQuery}`, site)
  ])

  const categoryOptions = formatOptions(categories)
  const brandOptions = formatOptions(brands)

  let modelOptions: option[] = []

  if (name === 'model') {
    modelOptions = currentOptions.model
  } else if (state.brand?.value) {
    modelOptions = formatOptions(models)
  } else if (name !== 'model' && !state.brand?.value) {
    modelOptions = []
  }

  const formattedOptions = {
    type: currentOptions.type,
    category: categoryOptions,
    brand: brandOptions,
    model: modelOptions
  }
  const validState = validateState(state, formattedOptions)

  const validQuery = formatQuery(
    selectFilter ?  
      { type: getSelectFilterObject(selectFilter) , ...validState } : 
      validState
    )
  const results = await fetchWithoutToken(
    `${endpoint}/car/filter${validQuery}`,
    site
  )

  return {
    formattedOptions,
    total: results.params.total,
    validState
  }
}
