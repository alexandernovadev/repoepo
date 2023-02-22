import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { BranchOffice, Price, Version } from '../../types/contentful/car'
import { v4 } from 'uuid'
import { BuyProcessStateProps } from './buyProcessSlice'
import { Simulation, SimulationState } from '../../hooks/useSimulation/types'

export const STEP_ADDITIONAL_DATA = 4
export interface BuyProcessV2Car {
  id: string
  imageUrl: string
  imageAlt: string
  logoUrl: string
  logoAlt: string
  brand: string
  model: string
  /** For new cars which may contain multiple versions */
  versions?: Version[]
  /** Version used for a used car */
  detailModel?: string
  price?: Price
  secondPrice?: Price
  features: { id: string; label: string }[]
  financing: boolean
  isNew: boolean
  /** Used cars have a single branch office */
  usedCarBranchOffice?: BranchOffice
  /** Available branches to purchase a new car */
  newCarBranches?: BranchOffice[]
  colors?: { label: string; code: string }[]
  version: string
  mileage: number
}

/** Describes possible state within the appraisal step */
export enum AppraisalSelection {
  /** User has not interacted with form/is yet to send data */
  PENDING,
  /** User are fill in the form */
  INFORM,
  /** User has skipped/declined appraisal and can move on to other steps */
  SKIPPED,
  /** User is looking at the appraisal simulation, having the option to either accept or reject the offer */
  RESULTS,
  /** Business has rejected the car, not meeting their requirements */
  TOO_OLD,
  /** User has accepted appraisal and can move on to other steps */
  ACCEPTED
}

export enum FinancingSelection {
  PENDING,
  SKIPPED,
  ACCEPTED
}

export enum PaymentProcess {
  PENDING = 'pending',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted'
}

export interface BuyProcessV2State {
  car?: BuyProcessV2Car
  userId: string
  timestamp: number
  currentStep: number
  isAppraisingCar?: boolean
  hasAcceptedAppraisal?: boolean
  version: {
    carVersionID: string,
    selectedId: string
    colorId: string
    selected: string
    color: string
    priceSmart: string
    priceConvensional: string
    price: Price
  }
  contact: {
    fields: Record<
      | 'name'
      | 'lastNames'
      | 'phone'
      | 'email'
      | 'buyWindow'
      | 'branchOffice'
      | 'rut'
      | 'region'
      | 'commune'
      | 'dni',
      string
    >
    error: boolean
  }
  occupationalData: {
    fields: Record<
      | 'studies'
      | 'activity'
      | 'income'
      | 'incomeType'
      | 'contractType'
      | 'realState',
      string
    >
    error: boolean
  }
  personalData: {
    fields: Record<
      | 'birthDate'
      | 'department'
      | 'city'
      | 'district'
      | 'addressNumber'
      | 'address'
      | 'apartment',
      string
    >
    error: boolean
  }
  terms: {
    hasAcceptedTerms: boolean
    hasAcceptedPrivacyTerms: boolean
  }
  appraisal: BuyProcessStateProps['appraisal']
  appraisalResults?: BuyProcessStateProps['appraisalSimulation'] | null
  appraisalSelection: AppraisalSelection
  warranty: string | undefined
  financingSimulation?: Simulation
  initialPaymentPercentage?: number
  needsFinancing?: boolean
  skipSimulation?: boolean
  financingSelection: FinancingSelection
  selectedCreditType?: number
  insurance: {
    isComplete: boolean
    needsInsurance: boolean
  }
  maintenance: {
    isComplete: boolean
    needsMaintenance: boolean
  }
  maintenanceSubStep: number
  reservationPayment: {
    orderNumber?: string
    ammount?: number
    typePayment?: string
    lastFourDigitsCard?: number | string
    dues?: number
    datePayment?: string
    paymentStatus: PaymentProcess
  }
  isFinancingPreApproved?: boolean
}

export const initialState: BuyProcessV2State = {
  userId: '',
  timestamp: 0,
  currentStep: 0,
  version: {
    carVersionID:'',
    selectedId: '',
    colorId: '',
    selected: '',
    color: '',
    priceConvensional: '0',
    priceSmart: '0',
    price: {} as Price
  },
  contact: {
    fields: {
      dni: '',
      name: '',
      lastNames: '',
      phone: '',
      email: '',
      buyWindow: '',
      region: '',
      commune: '',
      branchOffice: '',
      rut: ''
    },
    error: true
  },
  occupationalData: {
    fields: {
      studies: '',
      activity: '',
      income: '',
      incomeType: '',
      contractType: '',
      realState: ''
    },
    error: true
  },
  personalData: {
    fields: {
      birthDate: '',
      department: '',
      city: '',
      district: '',
      address: '',
      addressNumber: '',
      apartment: ''
    },
    error: true
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
  terms: {
    hasAcceptedTerms: false,
    hasAcceptedPrivacyTerms: false
  },
  appraisalSelection: AppraisalSelection.PENDING,
  warranty: undefined,
  financingSelection: FinancingSelection.PENDING,
  insurance: {
    isComplete: false,
    needsInsurance: false
  },
  maintenance: {
    isComplete: false,
    needsMaintenance: false
  },
  maintenanceSubStep: 0,
  reservationPayment: {
    orderNumber: '',
    ammount: 0,
    typePayment: '',
    lastFourDigitsCard: '',
    dues: 0,
    datePayment: '',
    paymentStatus: PaymentProcess.PENDING
  },
  isFinancingPreApproved: false
}

const buyProcessSlice = createSlice({
  name: 'buyProcessV2',
  initialState,
  reducers: {
    next: (state) => {
      state.currentStep++
    },
    reset: (_, action: PayloadAction<Partial<BuyProcessV2State>>) => {
      return Object.assign({}, initialState, action.payload)
    },
    jump: (state, { payload }: { payload: number }) => {
      state.currentStep = payload
    },
    startSession: (state) => {
      state.userId = v4()
      state.timestamp = Date.now()
    },
    setVersion: (
      state,
      { payload }: PayloadAction<Partial<BuyProcessV2State['version']>>
    ) => {
      state.version = {
        ...state.version,
        ...payload
      }
    },
    setContact: (state, { payload }) => {
      state.contact = {
        ...state.contact,
        ...payload
      }
    },
    setOccupationalData: (state, { payload }) => {
      state.occupationalData = {
        ...state.occupationalData,
        ...payload
      }
    },
    setPersonalData: (state, { payload }) => {
      state.personalData = {
        ...state.personalData,
        ...payload
      }
    },
    setAppraisalSelection: (
      state,
      action: PayloadAction<AppraisalSelection>
    ) => {
      if (action.payload === AppraisalSelection.ACCEPTED) {
        state.isAppraisingCar = true
        state.hasAcceptedAppraisal = true
      }
      if (action.payload === AppraisalSelection.SKIPPED) {
        state.isAppraisingCar = false
        state.hasAcceptedAppraisal = false
      }
      state.appraisalSelection = action.payload
    },
    setAppraisal: (
      state,
      { payload }: PayloadAction<Partial<BuyProcessV2State['appraisal']>>
    ) => {
      state.appraisal = {
        ...state.appraisal,
        ...payload
      }
    },
    setAppraisalResults: (
      state,
      { payload }: PayloadAction<BuyProcessV2State['appraisalResults']>
    ) => {
      state.appraisalResults = payload
    },
    setWarranty: (state, { payload }: { payload: string }) => {
      state.warranty = payload
    },
    setMaintenance: (state, { payload }) => {
      state.maintenance = payload
    },
    setInsurance: (state, { payload }) => {
      state.insurance = payload
    },
    setReservationPayment: (
      state,
      { payload }: PayloadAction<BuyProcessV2State['reservationPayment']>
    ) => {
      state.reservationPayment = payload
    },
    updateFinancingSimulation: (state, action) => {
      const payload: SimulationState = action.payload
      state.financingSimulation = payload.simulation!
      state.initialPaymentPercentage = payload.initialPaymentSelectedPercentage
      state.financingSelection = FinancingSelection.ACCEPTED
      state.selectedCreditType = payload.selectedCreditType
      state.currentStep++
    },
    financingSelection: (state, action) => {
      state.needsFinancing = action.payload.needsFinancing
      state.skipSimulation = action.payload.skipSimulation
      if (!action.payload.needsFinancing) {
        state.financingSelection = FinancingSelection.SKIPPED
        state.currentStep++
      }
    },
    setFinancingSelection: (
      state,
      action: PayloadAction<FinancingSelection>
    ) => {
      state.financingSelection = action.payload
    },
    updateTerms: (
      state,
      { payload }: PayloadAction<BuyProcessV2State['terms']['hasAcceptedTerms']>
    ) => {
      state.terms.hasAcceptedTerms = payload
    },
    resetFinancig: (state) => {
      state.needsFinancing = false
      state.skipSimulation = false
      state.financingSelection = FinancingSelection.PENDING
    },
    updatePrivacyTerms: (
      state,
      {
        payload
      }: PayloadAction<BuyProcessV2State['terms']['hasAcceptedPrivacyTerms']>
    ) => {
      state.terms.hasAcceptedPrivacyTerms = payload
    },
    setSkipSimulation: (
      state,
      { payload }: PayloadAction<BuyProcessV2State['skipSimulation']>
    ) => {
      state.skipSimulation = payload
    },
    setIsFinancingPreApproved: (state, action) => {
      state.isFinancingPreApproved = action.payload
    },
    setMaintenanceSubStep: (state, {payload}) => {
      if (payload === 'next') {
        state.maintenanceSubStep++
      }

      if (payload === 'prev') {
        state.maintenanceSubStep--
      }
    }
  }
})

export const {
  next,
  reset,
  jump,
  startSession,
  setVersion,
  setContact,
  setAppraisalSelection,
  setAppraisal,
  setAppraisalResults,
  setWarranty,
  updateFinancingSimulation,
  financingSelection,
  setFinancingSelection,
  resetFinancig,
  setOccupationalData,
  setPersonalData,
  setInsurance,
  setMaintenance,
  setReservationPayment,
  updateTerms,
  updatePrivacyTerms,
  setSkipSimulation,
  setIsFinancingPreApproved,
  setMaintenanceSubStep
} = buyProcessSlice.actions

export default buyProcessSlice.reducer

export const buyProcessV2Selector = (state: RootState) => state.buyProcessV2
