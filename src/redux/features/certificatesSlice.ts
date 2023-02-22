import { createSlice } from '@reduxjs/toolkit'

export interface certificatesStateProps {
  params: {
    total: number
    pages: number
  }
  page: number
  cars: Array<any>
  loading: boolean
  brand?: string
}

const initialState: certificatesStateProps = {
  params: {
    total: 0,
    pages: 0
  },
  page: 1,
  cars: [],
  loading: false,
  brand: undefined
}

const certificatesSlice = createSlice({
  name: 'certificates',
  initialState: initialState,
  reducers: {
    setParams: (state, action) => {
      state.params = action.payload
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setCars: (state, action) => {
      state.cars = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setBrand: (state, action) => {
      state.brand = action.payload
    }
  }
})

export const { setParams, setPage, setCars, setLoading, setBrand } =
  certificatesSlice.actions

export default certificatesSlice.reducer
