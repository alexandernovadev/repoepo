import {
  AtButton,
  MlCardSelectedCar,
  MlCardSelectedCardVariants
} from '@gac/core-components'
import { useRouter } from 'next/router'
import { commonSelector } from '../../../../redux/features/commonSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import {
  flagFinishProcess,
  technicalServiceSelector
} from '../../../../redux/features/technicalServiceSlice'
import { QuoteDataItem } from '../../../tm-quotation/QuotationCard'
import { mapCardData, mapCardImg, mapDetails, mapPersonData } from '../../data'
import { Classes } from './classes'
import { ConfirmationProps } from './types'

export const Confirmation = ({ site }: ConfirmationProps) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { logo, brands } = useAppSelector(commonSelector)
  const { personalData, serviceData, currentRut, formVehicleData } =
    useAppSelector(technicalServiceSelector)
  const person = mapPersonData(personalData, currentRut)
  const card = mapCardData(serviceData)
  const cardImg = mapCardImg(logo, brands, formVehicleData)
  const details = mapDetails(formVehicleData, serviceData, site)

  return (
    <div className='w-full px-5 md:px-2 lg:px-6'>
      <div className={Classes.heading}>
        <h2 className={`text-${site}-primary-dark ${Classes.headingTitle}`}>
          Tu agendamiento ha sido confirmado
        </h2>
        <h4 className={Classes.headingSubtitle}>
          Te enviaremos un correo con el resumen de la cita
        </h4>
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
            <h4 className={`${Classes.summarySubtitle}`}>Datos personales</h4>
            {person.map((item) => (
              <p className={`${Classes.personalItem}`} key={item as string}>
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
              dispatch(flagFinishProcess(true))
              router.push('/')
            }}
            site={site}
          />
        </div>
      </div>
    </div>
  )
}
