import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  AppointmentBrand,
  ServiceState
} from '../../templates/tm-technical-service-main/technical-service-process/Service/types'
import { ContentfulTemplateTechnicalServiceMain } from '../../types/contentful/content-model/tm-technical-service-main'
import { RootState } from '../store'

export interface TechnicalServiceState {
  currentStep: number
  /** Timestamp of last user action */
  lastInteraction: number
  personalData: {
    fetched: boolean
    error: boolean
    form: Record<string, string | boolean | Date>
  }
  finishProcess: boolean
  currentRut: string
  vehicleData: {
    active: boolean
    brand: string
    model: string
    technicalModel: string
    year: string
    vin: string
    patent: string
    segment: string
    id: string
  }
  formVehicleData: {
    brand: string
    model: string
    year: string
    vin: string
    patent: string
    technicalModel: string
  }
  serviceData: ServiceState
  appointmentBrands: Array<AppointmentBrand>
  template?: ContentfulTemplateTechnicalServiceMain
  fetchWithErrors: number
}

interface UpdatePersonalDataPayload {
  error: boolean
  form: Record<string, string | boolean | Date>
  fetched: boolean
}

export const initialStateTechnicalService: TechnicalServiceState = {
  currentStep: 1,
  lastInteraction: Date.now(),
  currentRut: '',
  finishProcess: false,
  vehicleData: {
    active: false,
    brand: '',
    model: '',
    technicalModel: '',
    year: '',
    vin: '',
    patent: '',
    segment: '',
    id: ''
  },
  formVehicleData: {
    brand: '',
    model: '',
    year: '',
    vin: '',
    patent: '',
    technicalModel: ''
  },
  serviceData: {
    service: undefined,
    description: undefined,
    mileage: undefined,
    city: undefined,
    branchOffice: undefined,
    date: null,
    time: null,
    assessor: undefined,
    brand: undefined
  },
  personalData: {
    fetched: false,
    error: true,
    form: {}
  },
  appointmentBrands: [],
  template: undefined,
  fetchWithErrors: 0,
}

const technicalServiceSlice = createSlice({
  name: 'technicalServiceProcess',
  initialState: initialStateTechnicalService,
  reducers: {
    next: (state) => {
      state.currentStep++
      window.scrollTo(0, 0)
    },
    previous: (state) => {
      state.currentStep--
    },
    flagFinishProcess: (state, action) => {
      state.finishProcess = action.payload
    },
    formatProcess: (state) => {
      state.currentStep = 1
      state.finishProcess = false
      state.currentRut = ''
      state.vehicleData = {
        active: false,
        brand: '',
        model: '',
        technicalModel: '',
        year: '',
        vin: '',
        patent: '',
        segment: '',
        id: ''
      }
      state.formVehicleData = {
        brand: '',
        model: '',
        year: '',
        vin: '',
        patent: '',
        technicalModel: ''
      }
      state.serviceData = {
        service: undefined,
        description: undefined,
        mileage: undefined,
        city: undefined,
        branchOffice: undefined,
        date: null,
        time: null,
        assessor: undefined,
        brand: undefined
      }
      state.personalData = {
        fetched: false,
        error: true,
        form: {}
      }
      state.appointmentBrands = []
      state.fetchWithErrors = 0
    },
    setCurrentRut: (state, action) => {
      // Make the personal data page fetch the data again only if the new RUT
      // is different than the previous one
      state.personalData.fetched =
        action.payload !== state.currentRut
          ? false
          : state.personalData?.fetched
      state.currentRut = action.payload
    },
    setVehicleData: (state, action) => {
      state.vehicleData = action.payload
    },
    setFormVehicleData: (state, action) => {
      state.formVehicleData = action.payload
    },
    setServiceData: (state, action) => {
      state.serviceData = action.payload
    },
    updatePersonalData: (
      state,
      action: PayloadAction<UpdatePersonalDataPayload>
    ) => {
      state.personalData.fetched = action.payload.fetched
      state.personalData.form = action.payload.form
      state.personalData.error = action.payload.error
    },
    setAppointmentBrands: (state, action) => {
      state.appointmentBrands = action.payload
    },
    setTemplate: (state, action) => {
      state.template = action.payload
    },
    setFetchWithErrors: (state, action) => {
      state.fetchWithErrors = action.payload
    }
  }
})

export const {
  next,
  previous,
  flagFinishProcess,
  formatProcess,
  setVehicleData,
  setServiceData,
  setCurrentRut,
  updatePersonalData,
  setFormVehicleData,
  setAppointmentBrands,
  setTemplate,
  setFetchWithErrors
} = technicalServiceSlice.actions

/**
 * Wraps the technical service reducer to update the last interaction timestamp based on actual user interactions
 */
const aggregateReducer: typeof technicalServiceSlice.reducer = (
  state,
  action
) => {
  const isTechnicalServiceAction = (value: string) =>
    /^technicalServiceProcess/.test(value)

  const isUserAction = (value: string) =>
    !/(setTemplate)|(setAppointmentBrands)|(setFetchWithErrors)$/.test(value)

  if (
    action.type &&
    isTechnicalServiceAction(action.type) &&
    isUserAction(action.type)
  ) {
    return technicalServiceSlice.reducer(
      state ? { ...state, lastInteraction: Date.now() } : undefined,
      action
    )
  }

  return technicalServiceSlice.reducer(state, action)
}

export default aggregateReducer

export const technicalServiceSelector = (state: RootState) =>
  state.technicalServiceProcess
