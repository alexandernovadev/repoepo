import { useEffect, useRef, useState } from 'react'
import { getSpincar } from '../services'
import { SitesNames } from '../types'

const useSpincar = ({ carsData, site }: any) => {
  const [allSpincarUrlData, setAllSpincarUrlData] = useState<any>({})
  const [spincarLoading, setSpincarLoading] = useState<boolean>(true)
  const isCancelled = useRef(false)

  useEffect(() => {
    if (carsData?.length > 0) {
      isCancelled.current = false
      let auxSpincarObject = {}
      carsData?.forEach(async (car: any, index: number) => {
        const spinCarData: any = await getSpincar(car, site as SitesNames)
        if (spinCarData.status) {
          auxSpincarObject = {
            ...auxSpincarObject,
            [car.id]: {
              ...spinCarData
            }
          }
        }
        if (index + 1 === carsData?.length && !isCancelled.current) {
          setSpincarLoading(false)
        }

        if (!isCancelled.current) {
          setAllSpincarUrlData(auxSpincarObject)
        }
      })
    }

    return () => {
      isCancelled.current = true
    }
  }, [carsData])

  return {
    allSpincarUrlData,
    spincarLoading
  }
}

export default useSpincar
