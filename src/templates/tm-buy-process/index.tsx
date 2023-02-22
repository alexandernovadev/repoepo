import { MlSteps } from '@gac/core-components'
import { steps } from './data'
import {
  formContainerClasses,
  mainContainerClasses,
  stepsContainerClasses
} from './classes'
import { BuyProcess } from './buy-process'
import { useDispatch, useSelector } from 'react-redux'
import {
  buyProcessSelector,
  reset,
  startSession
} from '../../redux/features/buyProcessSlice'
import { useEffect, useState } from 'react'
import { ClientSideOnly } from '../../utils/ClientSideOnly'
import { ContentfulTemplateBuyProcess, SitesNames } from '../../types'
// import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useRouter } from 'next/router'
import { useReCaptcha } from '../../hooks/useRecaptcha'
import { Loading } from '../../components/Loading'
import { Car } from '../../types/contentful/car'
import { formatBuyProcessCar } from '../../utils/pdp'
import { commonSelector } from '../../redux/features/commonSlice'
import { queryBuyProcessProps } from '../../hooks/useOverrideStepQuery'

interface TmBuyProcessProps {
  site: SitesNames
  template: ContentfulTemplateBuyProcess
  car: Car
  query: queryBuyProcessProps
}

export const TmBuyProcess = ({
  site,
  template,
  query,
  car
}: TmBuyProcessProps) => {
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const dispatch = useDispatch()
  const buyProcessData = useSelector(buyProcessSelector)
  const { carPlaceholderImg, oldCarPlaceholderImage } =
    useSelector(commonSelector)
  const { currentStep, disabledSteps } = buyProcessData
  // const { onlineStatus } = useOnlineStatus()
  const { ReCaptcha, getReCaptchaToken } = useReCaptcha(site, true)

  useEffect(() => {
    const { userId, timestamp, car: reduxCarData } = buyProcessData

    if (car?.id !== reduxCarData?.id) {
      dispatch(
        reset(
          formatBuyProcessCar(
            car,
            {
              carPlaceholderImg,
              oldCarPlaceholderImage
            },
            undefined
          )
        )
      )
    }

    if (!userId) {
      dispatch(startSession())
    }

    const differentDay =
      !!timestamp &&
      new Date().toDateString() !== new Date(timestamp).toDateString()

    if (differentDay) {
      dispatch(reset({}))
      router.push('/')
      return
    }

    setLoading(false)
  }, [car])

  return (
    <ClientSideOnly>
      <div
        className={`${mainContainerClasses} ${
          // onlineStatus
          //   ? 'mt-20 md:mt-[6rem] lg:mt-12' :
          'mt-32 md:mt-40 lg:mt-14'
        }`}
      >
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className={stepsContainerClasses}>
              <MlSteps
                site={site}
                steps={steps}
                currentStep={currentStep}
                disabledSteps={disabledSteps}
              />
            </div>

            <div className={formContainerClasses}>
              <BuyProcess
                query={query}
                site={site}
                data={buyProcessData}
                dispatch={dispatch}
                template={template}
                getReCaptchaToken={getReCaptchaToken}
                quiterIdActive={car?.quiterIdActive ?? false}
              />
            </div>
          </>
        )}
      </div>
      <ReCaptcha />
    </ClientSideOnly>
  )
}
