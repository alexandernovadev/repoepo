import { createSlice } from '@reduxjs/toolkit'

export interface ExampleProps {
  name: string
  numberCars: number
  price: number
}

const initialState: ExampleProps = {
  name: '',
  numberCars: 0,
  price: 0
}

const exampleSlice = createSlice({
  name: 'example',
  initialState: {
    example: initialState
  },
  reducers: {
    setExample: (state, action) => {
      state.example = action.payload
    }
  }
})

export const { setExample } = exampleSlice.actions

export default exampleSlice.reducer
