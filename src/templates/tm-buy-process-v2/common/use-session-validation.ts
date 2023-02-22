import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  BuyProcessV2State,
  reset,
  startSession
} from '../../../redux/features/buyProcessV2Slice'
import { GlobalInformation, SitesNames } from '../../../types'
import { Car } from '../../../types/contentful/car'
import { formatPlaceholders } from '../../../utils/formatPlaceholders'
import { formatBuyProcessCarV2 } from '../../../utils/pdp'

/**
 * Checks if the buy process has a car initialized, if not, the user shouldn't be here
 * Additionally, checks for an UUIDv4 string and time of session start, the session is only valid for the day started
 * @returns a boolean indicating if the process is ready to start
 */
export const useSessionValidation = (state: BuyProcessV2State, car: Car, global: GlobalInformation, site: SitesNames) => {
  const [ready, setReady] = useState(false)
  const dispatch = useDispatch()
  const router = useRouter()

  useEffect(() => {
    const { userId, car: reduxCarData, timestamp } = state

    if (!userId) dispatch(startSession())

    if(car?.id !== reduxCarData?.id) {
      dispatch(
        reset(
          formatBuyProcessCarV2(car, {
            ...formatPlaceholders(global!),
            brands: global!.brands
          }, site)
        )
      )
    }

    const differentDay =
      !!timestamp &&
      new Date().toDateString() !== new Date(timestamp).toDateString()

    if (differentDay) {
      dispatch(reset({}))
      router.push('/')
      return
    }

    setReady(true)
  }, [])

  return ready
}
