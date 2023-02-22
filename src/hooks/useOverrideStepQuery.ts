import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { BuyProcessCar } from '../redux/features/buyProcessSlice'
import { formatBuyProcessUrl } from '../templates/tm-buy-process/utils'

export type queryBuyProcessProps = {
  id: string,
  utm_source?: string,
  utm_medium?: string,
  utm_campaign?: string,
  utm_term?: string,
  utm_content?: string,
  utm_id?: string
}

const useOverrideStepQuery = (step: number, stepMap: string[], query: queryBuyProcessProps, car?: BuyProcessCar, quiterIdActive?: boolean, baseUrl?: string): void => {
  const { replace } = useRouter()
  let queryCarParams = {
    initialPath: '',
    querys: '',
    finalSlug: `${query.id}?`
  }
  
  if(car){
    queryCarParams.querys = formatBuyProcessUrl(car, query)
    if (quiterIdActive) {
      queryCarParams.finalSlug = `/${baseUrl}?quiterId=${query.id}&`
    }
  }
  
  useMemo(() => {
    replace(`${queryCarParams.finalSlug}${queryCarParams.querys}${stepMap[step - 1]}`, undefined, {
      shallow: true
    })
  }, [step])
}

export default useOverrideStepQuery
