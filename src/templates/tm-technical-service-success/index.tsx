import {
  AtButton,
  MlCardSelectedCar,
  MlCardSelectedCardVariants
} from '@gac/core-components'
import { ClientSideOnly } from '../../utils/ClientSideOnly'
import {
  flagFinishProcess,
  technicalServiceSelector
} from '../../redux/features/technicalServiceSlice'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { useRouter } from 'next/router'
import { commonSelector } from '../../redux/features/commonSlice'
import {
  mapCardData,
  mapCardImg,
  mapDetails,
  mapPersonData
} from '../tm-technical-service-main/data'
import { useEffect, useMemo } from 'react'
import { Classes, getHeadingSiteClasses } from './classes'
import { QuoteDataItem } from '../tm-quotation/QuotationCard'
import { TmTechnicalServiceSuccessProps } from './types'
import {
  formContainerClasses,
  mainContainerClasses
} from '../tm-technical-service-main/classes'

export const TmTechnicalServiceSuccess = ({
  site,
  template: { title, description }
}: TmTechnicalServiceSuccessProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { logo, brands } = useAppSelector(commonSelector)
  const { personalData, serviceData, currentRut, formVehicleData } =
    useAppSelector(technicalServiceSelector)
  const person = mapPersonData(personalData, currentRut)
  const card = mapCardData(serviceData)
  const cardImg = mapCardImg(logo, brands, formVehicleData)
  const details = mapDetails(formVehicleData, serviceData, site)

  useEffect(() => {
    if (!formVehicleData.brand || !currentRut) {
      router.push('/404')
    }
  }, [])

  useEffect(() => {
    dispatch(flagFinishProcess(true))
  }, [])

  if (!formVehicleData.brand || !currentRut) {
    return <div className='w-full min-h-screen'></div>
  }

  const headingClasses = useMemo(() => {
    return getHeadingSiteClasses(site)
  }, [site])

  return (
    <ClientSideOnly>
      <div className={mainContainerClasses}>
        <div className={formContainerClasses}>
          <div className='w-full px-5 md:px-2 lg:px-6'>
            <div className={Classes.heading}>
              <h2 className={headingClasses.title}>{title}</h2>
              <h4 className={Classes.headingSubtitle}>{description}</h4>
            </div>

            <div className={`${Classes.mainContainer} ${Classes.card}`}>
              <div className='max-w-[550px] px-6 sm:px-0'>
                <MlCardSelectedCar
                  {...card}
                  {...cardImg}
                  variant={MlCardSelectedCardVariants.TECHNICAL_SERVICE}
                  site={site}
                />
              </div>

              <div className={`${Classes.summaryCard}`}>
                <div className={`${Classes.summaryContent}`}>
                  <h2 className={`${Classes.summaryTitle}`}>
                    Detalle del agendamiento
                  </h2>
                  <h4 className={`${Classes.summarySubtitle}`}>Datos auto</h4>
                  {details.map((detail) => (
                    <QuoteDataItem key={detail.name} {...detail} site={site} />
                  ))}
                </div>
                <div className={`${Classes.summaryContent}`}>
                  <h2 className={`${Classes.summaryTitle}`}>Solicitante</h2>
                  <h4 className={`${Classes.summarySubtitle}`}>
                    Datos personales
                  </h4>
                  {person.map((item) => (
                    <p
                      className={`${Classes.personalItem}`}
                      key={item as string}
                    >
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className={Classes.buttonWrapper}>
                <AtButton
                  label='Finalizar'
                  variant='primary'
                  className='py-2 px-6'
                  onClick={() => {
                    router.push('/')
                  }}
                  site={site}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientSideOnly>
  )
}
