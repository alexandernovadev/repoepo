import {
  AtButtonLink,
  MlHeading,
  MlVehicleInfoCard
} from '@gac/core-components'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { PaymentProcess } from '../../../../redux/features/buyProcessV2Slice'
import { appraisalTitleHeading } from '../../../tm-buy-process/data'
import { summaryClasees } from '../../common/classes'
import { prepareBaseCarData } from '../../common/data'
import { BuyProcessV2Props } from '../../common/types'
import { PaymentAlerts } from '../payment/paymentAlerts'
import { prepareReservationPayData, prepareSummaryData } from './dataSummary'
import { SectionSummaryDetail } from './SectionSummaryDetail'

const getSummaryTitle = (paymentStatus: PaymentProcess) => {
  switch (paymentStatus) {
    case PaymentProcess.ACCEPTED:
      return 'Hemos recibido tu pago'

    case PaymentProcess.PENDING:
      return 'Gracias por cotizar con nosotros'

    default:
      return 'Hubo un problema con tu pago'
  }
}

export const Summary = ({ state, site }: BuyProcessV2Props) => {
  const router = useRouter()
  const summaryData = prepareSummaryData(state, site)
  const {
    reservationPayment: { paymentStatus }
  } = state

  const {
    mainContainer,
    vehicleCard,
    detailsSection,
    detailSectionDivider,
    detailSectionColomnOne,
    detailSectionColomnTwo
  } = summaryClasees

  useEffect(() => {
    document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <div className={mainContainer}>
      <MlHeading
        {...appraisalTitleHeading(site)}
        title={getSummaryTitle(paymentStatus)}
        description={
          paymentStatus === PaymentProcess.ACCEPTED ||
          paymentStatus === PaymentProcess.PENDING
            ? 'Un ejecutivo de venta te contactará en las próximas horas'
            : ''
        }
        site={site}
      />
      {paymentStatus === PaymentProcess.ACCEPTED ||
      paymentStatus === PaymentProcess.PENDING ? (
        /* @ts-ignore */
        <MlVehicleInfoCard
          {...prepareBaseCarData(state.car!)}
          {...prepareReservationPayData(
            paymentStatus === PaymentProcess.ACCEPTED,
            state
          )}
          className={vehicleCard}
          site={site}
        />
      ) : (
        <PaymentAlerts
          site={site}
          isbutton={false}
          className='w-11/12 xs:w-5/6 sm:max-w-[603px]'
          AlertStatus={paymentStatus}
        />
      )}
      <div className={detailsSection}>
        <div className={detailSectionDivider}>
          <div className={detailSectionColomnOne}>
            <SectionSummaryDetail
              site={site}
              itemsSummary={summaryData.order}
              title='Resumen de cotización'
            />
          </div>
          <div className={detailSectionColomnTwo}>
            <SectionSummaryDetail
              site={site}
              itemsSummary={summaryData.applicant}
              title='Solicitante'
            />
          </div>
        </div>
      </div>

      <AtButtonLink
        label='Ir al Home '
        variant='primary'
        site={site}
        className='self-center mt-10 cursor-pointer'
        disabled={false}
        onClick={() => router.push('/')}
      />
    </div>
  )
}
