import { createSlice } from '@reduxjs/toolkit'
import { v4 } from 'uuid'
import { Simulation, SimulationState } from '../../hooks/useSimulation/types'
import { BranchOffice, Price } from '../../types/contentful/car'
import { isDisabledStep } from '../../utils/buy-process/isDisabledStep'
import { RootState } from '../store'

export const STEP_APPRAISAL = 2
export const STEP_FINANCING = 3
export const STEP_ADDITIONAL_DATA = 4
export const STEP_TERMS = 5

export const STEP_APPRAISAL_SUBSTEP_CONFIRM = 2
export const STEP_FINANCING_SUBSTEP_SIMULATION = 1
export const STEP_FINANCING_SUBSTEP_SELECTION = 0

export interface BuyProcessCar {
  id: string
  imageUrl: string
  imageAlt: string
  brand: string
  model: string
  version: string
  price: Price
  secondPrice?: Price
  features: { id: string; label: string }[]
  financing: boolean
  isNew: boolean
  /** This field is available with used cars, that are available at a single branch office */
  usedCarBranchOffice?: BranchOffice
  /** Available branches to purchase a new car */
  newCarBranches?: BranchOffice[]
  category: string
}

export interface BuyProcessStateProps {
  car?: BuyProcessCar
  userId: string
  timestamp: number
  currentStep: number
  subStepAppraisal: number
  subStepFinancing: number
  isAppraisingCar?: boolean
  hasAcceptedAppraisal?: boolean

  appraisal: Record<
    | 'patent'
    | 'year'
    | 'brand'
    | 'brandId'
    | 'model'
    | 'modelId'
    | 'version'
    | 'versionId'
    | 'mileage',
    string
  > &
    Record<'isAutocompleted', boolean>
  appraisalSimulation?: {
    patent: string
    brandId: number
    brand: string
    modelId: number
    model: string
    versionId: number
    version: string
    year: number
    applicationDate: string
    mileage: number
    suggestedPrice: number
    transactionRequestId: number
  }
  financingSimulation?: Simulation
  initialPaymentPercentage?: number
  needsFinancing?: boolean
  skipSimulation?: boolean
  contact: {
    personalData: Record<string, string | boolean | Date>
    /** personalData with 2 more fields, used with needsFinancing */
    personalFinancingData: Record<string, string | boolean | Date>
    occupationalData: Record<string, string | boolean | Date>
    contactData: Record<string, string | boolean | Date>
    /** Accumulated error per form group (up to 5 groups) */
    errors: boolean[]
  }
  terms: {
    hasAcceptedTerms: boolean
    hasAcceptedPrivacyTerms: boolean
  }
  isFinancingPreApproved?: boolean
  preApprovedStatus: string
  disabledSteps: Array<number>
}

const initialState: BuyProcessStateProps = {
  userId: '',
  timestamp: 0,
  currentStep: 1,
  subStepAppraisal: 0,
  subStepFinancing: 0,
  isFinancingPreApproved: false,
  preApprovedStatus: '',
  contact: {
    contactData: {},
    personalData: {},
    personalFinancingData: {},
    occupationalData: {},
    errors: []
  },
  terms: {
    hasAcceptedTerms: false,
    hasAcceptedPrivacyTerms: false
  },
  appraisal: {
    patent: '',
    year: '',
    brand: '',
    brandId: '',
    model: '',
    modelId: '',
    version: '',
    versionId: '',
    mileage: '',
    isAutocompleted: false
  },
  disabledSteps: []
}

const buyProcessSlice = createSlice({
  name: 'buyProcess',
  initialState: initialState,
  reducers: {
    next: (state) => {
      switch (state.currentStep) {
        case STEP_APPRAISAL: {
          if (state.subStepAppraisal === STEP_APPRAISAL_SUBSTEP_CONFIRM) {
            state.currentStep++
            // state.subStep = 0
          } else {
            state.subStepAppraisal++
          }

          break
        }

        case STEP_FINANCING: {
          if (state.subStepFinancing === STEP_FINANCING_SUBSTEP_SIMULATION) {
            state.currentStep++
            // state.subStep = 0
          } else {
            state.subStepFinancing++
          }

          break
        }

        default: {
          state.currentStep++
          // state.subStep = 0
        }
      }
    },
    previous: (state) => {
      switch (state.currentStep) {
        case STEP_APPRAISAL: {
          if (state.subStepAppraisal > 0) {
            state.subStepAppraisal--
          } else {
            state.currentStep--
            if (state.subStepAppraisal > 0) state.subStepAppraisal--
          }

          break
        }
        case STEP_FINANCING: {
          if (state.subStepFinancing > 0) {
            state.subStepFinancing--
          } else {
            state.currentStep--
            if (state.subStepFinancing > 0) state.subStepFinancing--
          }

          break
        }
        case STEP_TERMS: {
          if (isDisabledStep(STEP_ADDITIONAL_DATA, state.disabledSteps)) {
            state.currentStep = STEP_FINANCING
          } else if (state.skipSimulation && state.needsFinancing) {
            state.currentStep = STEP_FINANCING
            // state.subStepFinancing -= 0
          } else {
            state.currentStep--
            // state.subStepFinancing = 0
          }

          break
        }

        default: {
          state.currentStep--
          // state.subStep = 0
        }
      }
    },
    update: (state, action) => {
      return {
        ...state,
        car: { ...state.car, ...action.payload.car },
        appraisal: { ...state.appraisal, ...action.payload.appraisal },
        appraisalSimulation: {
          ...state.appraisalSimulation,
          ...action.payload.appraisalSimulation
        },
        terms: { ...state.terms, ...action.payload.terms },
        contact: { ...state.contact, ...action.payload.contact },
        financingSimulation: {
          ...state.financingSimulation,
          ...action.payload.financingSimulation
        }
      }
    },
    reset: (_, action) => {
      return Object.assign({}, initialState, action.payload)
    },
    appraisalSelection: (state, action) => {
      if (action.payload.isAppraisingCar) {
        state.isAppraisingCar = true
        state.hasAcceptedAppraisal = false
        state.subStepAppraisal = 1
      } else {
        state.isAppraisingCar = false
        state.hasAcceptedAppraisal = false
        state.currentStep = STEP_FINANCING
        state.subStepAppraisal = 0
      }
    },
    financingSelection: (state, action) => {
      state.needsFinancing = action.payload.needsFinancing
      state.skipSimulation = action.payload.skipSimulation
      if (action.payload.needsFinancing && !action.payload.skipSimulation) {
        state.subStepFinancing = 1
      } else if (!action.payload.needsFinancing) {
        state.currentStep = STEP_ADDITIONAL_DATA
        state.subStepFinancing = 0
      } else {
        state.currentStep = STEP_TERMS
        state.subStepFinancing = 0
      }
    },
    appraisalSimulationSelection: (state, action) => {
      state.hasAcceptedAppraisal = action.payload
      state.currentStep = STEP_FINANCING
      state.subStepFinancing = 0
    },
    updatePersonalData: (state, action) => {
      state.contact.personalData = action.payload.fields
      state.contact.errors[0] = action.payload.error
    },
    updatePersonalFinancingData: (state, action) => {
      state.contact.personalFinancingData = action.payload.fields
      state.contact.errors[3] = action.payload.error
    },
    updateOccupationalData: (state, action) => {
      state.contact.occupationalData = action.payload.fields
      state.contact.errors[2] = action.payload.error
    },
    updateContactData: (state, action) => {
      state.contact.contactData = action.payload.fields
      state.contact.errors[4] = action.payload.error
    },
    updateTerms: (state, action) => {
      state.terms.hasAcceptedTerms = action.payload
    },
    updatePrivacyTerms: (state, action) => {
      state.terms.hasAcceptedPrivacyTerms = action.payload
    },
    updateFinancingSimulation: (state, action) => {
      const payload: SimulationState = action.payload
      state.financingSimulation = payload.simulation!
      state.initialPaymentPercentage = payload.initialPaymentSelectedPercentage
      state.currentStep++
    },
    skipFinancingForm: (state) => {
      state.currentStep++
      // state.subStepFinancing = 0
      // state.contact.personalFinancingData = {}
      // state.contact.errors[3] = true
      // state.contact.occupationalData = {}
      // state.contact.errors[2] = true
    },
    setIsFinancingPreApproved: (state, action) => {
      state.isFinancingPreApproved = action.payload
    },
    skipNotImplemented: (state, action) => {
      switch (state.currentStep) {
        case STEP_APPRAISAL: {
          // Go previous
          if (action.payload) {
            state.currentStep = 1
            // state.subStepAppraisal = 0
          } else {
            // Go next
            state.currentStep = STEP_ADDITIONAL_DATA
            // state.subStepAppraisal = 0
          }
          break
        }

        case STEP_FINANCING: {
          // Go previous
          if (action.payload) {
            state.currentStep = 1
            // state.subStepFinancing = 0
          } else {
            // Go next
            state.currentStep = STEP_ADDITIONAL_DATA
            // state.subStepFinancing = 0
          }
          break
        }
      }
    },
    startSession: (state) => {
      state.userId = v4()
      state.timestamp = Date.now()
    },
    jump: (state, { payload }: { payload: number }) => {
      state.currentStep = payload
    },
    jumpSubStep: (state, { payload }: { payload: number }) => {
      switch (state.currentStep) {
        case STEP_APPRAISAL: {
          state.subStepAppraisal = payload
          break
        }

        case STEP_FINANCING: {
          state.subStepFinancing = payload
          break
        }
      }
    },
    setDisabledSteps: (state, { payload }: { payload: number | undefined }) => {
      if (!payload) {
        state.disabledSteps = []
      } else {
        const disabledFound = state?.disabledSteps?.find(
          (disabled) => disabled === payload
        )

        if (!disabledFound && payload) {
          state.disabledSteps = [...state.disabledSteps, payload]
        }
      }
    },
    setPreApprovedStatus: (state, { payload }) => {
      state.preApprovedStatus = payload
    }
  }
})

export const {
  next,
  previous,
  update,
  reset,
  appraisalSelection,
  financingSelection,
  appraisalSimulationSelection,
  updatePersonalData,
  updateContactData,
  updatePersonalFinancingData,
  updateOccupationalData,
  updateTerms,
  updatePrivacyTerms,
  updateFinancingSimulation,
  skipFinancingForm,
  setIsFinancingPreApproved,
  skipNotImplemented,
  startSession,
  jump,
  jumpSubStep,
  setDisabledSteps,
  setPreApprovedStatus
} = buyProcessSlice.actions

export default buyProcessSlice.reducer

export const buyProcessSelector = (state: RootState) => state.buyProcess
