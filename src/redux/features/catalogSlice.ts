import { createSlice } from '@reduxjs/toolkit'

export interface catalogStateProps {
  params: {
    total: number
    pages: number
  }
  page: number
  filters: Object
  cityFilter: {
    label: string
    value: string
    id: string
  }
  cars: Array<any>
  loading: boolean
}

const initialState: catalogStateProps = {
  params: {
    total: 0,
    pages: 0
  },
  page: 1,
  filters: {},
  cityFilter: {
    label: '',
    value: '',
    id: ''
  },
  cars: [],
  loading: false
}

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: initialState,
  reducers: {
    setParams: (state, action) => {
      state.params = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setFilters: (state, action) => {
      state.filters = action.payload
    },
    setCityFilters: (state, action) => {
      state.cityFilter = action.payload
    },
    setCars: (state, action) => {
      state.cars = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  }
})

export const {
  setParams,
  setPage,
  setFilters,
  setCars,
  setLoading,
  setCityFilters
} = catalogSlice.actions

export default catalogSlice.reducer
