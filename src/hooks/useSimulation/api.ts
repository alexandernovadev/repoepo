import { SitesNames } from '../../types'
import { fetchWithoutToken } from '../../utils/fetch'
import { INITIAL_INSTALLMENTS } from './data'
import {
  FetchSimulationAndUpdateParams,
  Simulation,
  SimulationResponse
} from './types'

const ENDPOINT = 'customer/api/financial/simulation'

export const fetchSimulation = async (
  carId: string,
  site: SitesNames,
  purchaseType: number,
  initialPayment: number,
  dues: number
): Promise<Simulation> => {
  const resp: SimulationResponse = await fetchWithoutToken(
    ENDPOINT,
    site,
    {
      carId,
      purchaseType,
      initialPayment,
      dues
    },
    'POST'
  )

  if (resp.statusCode !== 200 || !resp.data) {
    throw new Error('Invalid response from API')
  }

  return resp.data
}

export const fetchSimulationAndUpdate = async ({
  clearInstallments = true,
  site,
  car,
  financing,
  state,
  setState,
  shouldCancelRef
}: FetchSimulationAndUpdateParams) => {
  if (!financing) {
    setState({ isLoading: false })

    return
  }

  setState({ isLoading: true })

  try {
    shouldCancelRef.current = false

    const newSimulation = await fetchSimulation(
      car,
      site,
      state.selectedCreditType + 1,
      state.initialPaymentSelectedPercentage,
      state.installments.find(({ id }) => id === state.selectedInstallment)
        ?.installments ?? state.installments[0].installments
    )

    if (shouldCancelRef.current) {
      return
    }

    const newInstallments = clearInstallments
      ? INITIAL_INSTALLMENTS
      : state.installments

    if (newSimulation.duesValue === 0) {
      setState({
        installmentError:
          'Lamentamos informar que no está disponible esta opción',
        installments: newInstallments.map((i) =>
          i.id === state.selectedInstallment ? { ...i, enabled: false } : i
        ),
        simulation: newSimulation,
        isLoading: false
      })
    } else {
      setState({
        installmentError: null,
        installments: newInstallments,
        simulation: newSimulation,
        isLoading: false
      })
    }
  } catch (err) {
    console.error(err)
    if (shouldCancelRef.current) {
      return
    }

    setState({ isLoading: false })
  }
}
