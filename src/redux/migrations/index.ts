import { store } from '../store'

export const migrations: any = {
  0: (state: ReturnType<typeof store.getState>) => {
    // migration clear out device state
    return {
      ...state
    }
  },
  1: (state: ReturnType<typeof store.getState>) => {
    // migration to keep only device state
    return {
      ...state,
      catalog: {
        ...state.catalog,
        cityFilter: {
          label: '',
          value: '',
          id: ''
        }
      }
    }
  },
  2: (state: ReturnType<typeof store.getState>) => {
    // migration to keep only device state
    return {
      ...state,
      technicalServiceProcess: {
        ...state.technicalServiceProcess,
        serviceData: {
          ...state.technicalServiceProcess.serviceData,
          brand: ''
        },
        appointmentBrands: []
      }
    }
  },
  3: (state: ReturnType<typeof store.getState>) => {
    // migration to keep only device state
    return {
      ...state,
      quote: {
        ...state.quote,
        car: {
          ...state.quote.car,
          isNew: null
        }
      }
    }
  },
  4: (state: ReturnType<typeof store.getState>) => {
    // migration to keep only device state
    return {
      ...state,
      technicalServiceProcess: {
        ...state.technicalServiceProcess,
        fetchWithErros: 0
      }
    }
  }
}
