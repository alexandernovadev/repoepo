import { useState } from 'react'
import {
  MlFilterOptions,
  MlFilterState
} from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-filter/types'

const getInitialState = (activeFilters: Array<string>) => {
  const usedFilter = activeFilters?.find((filter) => filter === 'Usados')
  const newsFilter = activeFilters?.find((filter) => filter === 'Nuevos')

  if ((usedFilter && newsFilter) || (!usedFilter && !newsFilter)) {
    return {
      onlyOneFilter: false,
      state: {
        type: null,
        category: null,
        brand: null,
        model: null
      }
    }
  }

  return {
    onlyOneFilter: activeFilters?.[0] ?? false,
    state: {
      category: null,
      brand: null,
      model: null
    }
  }
}

export const useHomeBanner = (activeFilters: Array<string>) => {
  const initialState = getInitialState(activeFilters)
  const [state, setState] = useState<MlFilterState>(initialState.state)
  const [options, setOptions] = useState<MlFilterOptions>({
    type: [],
    category: [],
    brand: [],
    model: []
  })

  return {
    selectFilter: initialState.onlyOneFilter,
    setState,
    state,
    options,
    setOptions
  }
}
