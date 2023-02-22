import { createSlice } from '@reduxjs/toolkit'
import { ContentfulAsset, ContentfulBrandProps, ContentfulTags } from '../../types'
import { CarColor } from '../../types/contentful/car'
import { RootState } from '../store'

export type CarPlaceholderImg = {
  url: string
  alt: string
}

export interface commonState {
  carPlaceholderImg: CarPlaceholderImg
  oldCarPlaceholderImage: CarPlaceholderImg
  brands: null | ContentfulBrandProps[]
  site: null | string
  logo: null | ContentfulAsset,
  tags? : Array<ContentfulTags>
  colors?: CarColor[]
}

const initialState: commonState = {
  carPlaceholderImg: {
    url: '',
    alt: ''
  },
  brands: null,
  site: null,
  logo: null,
  oldCarPlaceholderImage: {
    url: '',
    alt: ''
  },
  tags: [],
  colors: []
}

const commonSlice = createSlice({
  name: 'common',
  initialState: initialState,
  reducers: {
    setCarPlaceholderImage: (state, action) => {
      state.carPlaceholderImg = action.payload
    },
    setBrands: (state, action) => {
      state.brands = action.payload
    },
    setSite: (state, action) => {
      state.site = action.payload
    },
    setLogo: (state, action) => {
      state.logo = action.payload
    },
    setOldCarPlaceholderImage: (state, action) => {
      state.oldCarPlaceholderImage = action.payload
    },
    setTags: (state, action) => {
      state.tags = action.payload
    },
    setColors: (state, action) => {
      state.colors = action.payload
    }
  }
})

export const {
  setCarPlaceholderImage,
  setBrands,
  setSite,
  setLogo,
  setOldCarPlaceholderImage,
  setTags,
  setColors
} = commonSlice.actions

export default commonSlice.reducer

export const commonSelector = (state: RootState) => state.common
