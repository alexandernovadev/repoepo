import { MutableRefObject } from 'react'
import { Sites } from '../../types'

export interface Simulation {
  financial: string
  price: number
  purchaseType: string
  initialPayment: number
  dues: string
  annualEquivalency: number
  guaranteedFutureValue: number
  duesValue: number
  totalCredit: number
  errorCode: number
  description: string
  financialError?: any
  financialErrorMessage?: any
  initialPaymentPercentage?: number
}

export interface SimulationResponse {
  requiredDate: string
  internalError: number
  statusCode: number
  errorMessage: string
  data: Simulation
}

export interface SimulationInstallment {
  id: number
  label: string
  enabled: boolean
  installments: number
}

export interface SimulationState {
  installments: SimulationInstallment[]
  selectedInstallment: number
  installmentError: string | null
  selectedCreditType: number
  initialPaymentDisplayPercentage: number
  initialPaymentSelectedPercentage: number
  isLoading: boolean
  simulation: Simulation | null
}

export interface FetchSimulationAndUpdateParams extends Sites {
  shouldCancelRef: MutableRefObject<boolean>
  clearInstallments?: boolean
  financing: boolean
  car: string
  state: SimulationState
  setState: (newState: Partial<SimulationState>) => void
}
