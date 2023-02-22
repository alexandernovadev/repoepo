import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../store'

export interface QuoteCarData {
  image: {
    src: string
    alt: string
  }
  brand: string
  model: string
  version: string | null
  price?: string
  priceLabel?: string
  isNew: boolean
}

export interface QuoteClientData {
  name: string
  lastName: string
  rut: string
  email: string
  phone: string
  branch: string
  comment: string
}

export interface quoteState {
  client: QuoteClientData | null
  car: QuoteCarData | null
}

const initialState: quoteState = {
  client: null,
  car: null
}

const quoteSlice = createSlice({
  name: 'quote',
  initialState: initialState,
  reducers: {
    setData: (state, action) => {
      state.car = action.payload.car
      state.client = action.payload.client
    }
  }
})

export const { setData } = quoteSlice.actions

export default quoteSlice.reducer

export const quoteSelector = (state: RootState) => state.quote
