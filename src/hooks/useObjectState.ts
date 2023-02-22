import { useReducer } from 'react'

export const useObjectState = <T>(initialState: T) =>
  useReducer(
    (prevState: T, newState: Partial<T>) => ({ ...prevState, ...newState }),
    initialState
  )
