import {
  filterName,
  MlFilterState
} from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-filter/types'
import { checkOnlyConsonants } from '../checkOnlyConsonants'
import { toCapitalize } from '../toCapitalize'

type backendOption = {
  id: string
  value: string
  slug: string
}

export const formatOptions = (options: backendOption[]) => {
  return options.map((option) => {
    return {
      value: option.id,
      label:
        option.value.length <= 3 || checkOnlyConsonants(option.value)
          ? option.value.toUpperCase()
          : toCapitalize(option.value),
      slug: option.slug
    }
  })
}

const getCarTypeId = (selectFilter: string | boolean, state: MlFilterState) => {
  switch (selectFilter) {
    case 'Nuevos':
      return 1
    case 'Usados':
      return 2
    default:
      return state.type?.value ? state.type.value : ''
  }
}

export const formatQuery = (state: MlFilterState, keys?: filterName[], selectFilter: string | boolean = false) => {
  const obj = { ...state }

  if (keys && keys.length > 0) {
    keys.forEach((key) => {
      delete obj[key]
    })
  }

  const params = {
    typeId: getCarTypeId(selectFilter, state) as string,
    categoryId: obj.category?.value ? obj.category?.value : '',
    brandId: obj.brand?.value ? obj.brand?.value : '',
    modelId: obj.model?.value ? obj.model?.value : '',
    page: '1'
  }

  let prop: keyof typeof params

  for (prop in params) {
    if (params[prop] === '') {
      delete params[prop]
    }
  }

  return `?${new URLSearchParams(params).toString()}`
}
