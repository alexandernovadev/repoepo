import { Dispatch, useEffect, useRef } from 'react'
import { Sites } from '../../types'
import { useObjectState } from '../useObjectState'
import { fetchSimulationAndUpdate } from './api'
import { INITIAL_INSTALLMENTS, INITIAL_PERCENTAGE } from './data'
import { Simulation, SimulationState } from './types'

interface UseSimulationParams extends Sites {
  financing: boolean
  car: string
  initialCreditType?: number
  financingState?: Simulation
}

export const useSimulation = ({
  financing,
  car,
  initialCreditType = 0,
  site,
  financingState
}: UseSimulationParams): [
  SimulationState,
  Dispatch<Partial<SimulationState>>
] => {
  const shouldCancelRef = useRef(false)
  const [state, setState] = useObjectState<SimulationState>({
    installments: INITIAL_INSTALLMENTS,
    selectedInstallment: INITIAL_INSTALLMENTS.find((item) => item.installments === parseInt(financingState?.dues!))?.id ?? 1,
    installmentError: null,
    selectedCreditType: initialCreditType,
    initialPaymentDisplayPercentage: financingState?.initialPaymentPercentage ?? INITIAL_PERCENTAGE,
    initialPaymentSelectedPercentage: financingState?.initialPaymentPercentage ?? INITIAL_PERCENTAGE,
    isLoading: false,
    simulation: null
  })

  useEffect(() => {
    fetchSimulationAndUpdate({
      shouldCancelRef,
      state,
      setState,
      financing,
      car,
      site
    })

    return () => {
      shouldCancelRef.current = true
    }
  }, [
    car,
    financing,
    state.selectedCreditType,
    state.initialPaymentSelectedPercentage
  ])

  useEffect(() => {
    fetchSimulationAndUpdate({
      clearInstallments: false,
      shouldCancelRef,
      state,
      setState,
      financing,
      car,
      site
    })

    return () => {
      shouldCancelRef.current = true
    }
  }, [state.selectedInstallment])

  return [state, setState]
}

export type { SimulationState }
