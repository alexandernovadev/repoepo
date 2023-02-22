import {
  filterName,
  MlFilterOptions,
  MlFilterState
} from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-filter/types'

export const getSelectFilterObject = (selectFilter: string | boolean) => {
  switch (selectFilter) {
    case 'Usados':
      return { value: '2', label: 'Usado', slug: 'used' }
  
    case 'Nuevos':
      return { value: '1', label: 'Nuevo', slug: 'new' }
  }
}

export const validateState = (
  state: MlFilterState,
  options: MlFilterOptions
) => {
  const validState = { ...state }
  const keysToCheck: filterName[] = ['category', 'brand', 'model']

  keysToCheck.forEach((key) => {
    const found = options[key].some(
      (option) => option.label === state[key]?.label
    )
    if (!found) {
      validState[key] = null
    }
  })

  return validState
}
