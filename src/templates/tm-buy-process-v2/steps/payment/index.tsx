import { useMemo, useRef } from 'react'
import { AtButton, AtButtonLink, MlStepCard } from '@gac/core-components'
import { AtButtonVariant } from '../../../../types'
import {
  jump,
  next,
  PaymentProcess
} from '../../../../redux/features/buyProcessV2Slice'
import { stepSubtitleClasses, stepTitleClasses } from '../../common/classes'
import { GetColorList } from '../../common/getListColorByModel'
import { BuyProcessV2Props } from '../../common/types'
import { useStockAvailable } from '../../hooks/useStockAvailable'
import { useTransbankPayment } from '../../hooks/useTransbankPayment'
import { PaymentAlerts } from './paymentAlerts'

/**
 * TODO: Here goes expected behavior of step
 */
export const Payment = ({
  state,
  dispatch,
  site,
  template,
  hostName,
  car
}: BuyProcessV2Props) => {
  const transbankButton = useRef<HTMLFormElement>(null)
  const { paymentKeys, loading, getPaymentData, stepStatus } =
    useTransbankPayment(site, state, hostName!)
  const {
    reservationPayment: { paymentStatus }
  } = state
  const { stockCar } = useStockAvailable(state.car?.isNew, car!, site, dispatch)

  const isColorAvailable = useMemo(() => {
    return GetColorList(
      stockCar,
      state.version.selectedId,
      car?.contentfulColors
    )
  }, [])

  return (
    <MlStepCard
      title='Pago de reserva'
      active={
        stockCar.length === 0 || !stockCar || isColorAvailable?.length
          ? false
          : stepStatus.active
      }
      disabled={
        stockCar.length === 0 || !stockCar || isColorAvailable?.length
          ? true
          : stepStatus.disabled
      }
      completed={stepStatus.completed}
      onEdit={() => dispatch(jump(-1))}
      site={site}
      idSection={'payment-section'}
    >
      <div className='flex flex-col gap-6'>
        <h3 className={stepTitleClasses}>Asegura la compra del vehículo</h3>
        <p className={stepSubtitleClasses}>
          Con el pago de la reserva el vehículo quedará reservado a tu nombre
          acorde al stock actual.
          <br /> <br />
          Para realizar el pago serás llevado a WebPay y una vez realizado serás
          redirigido aquí.
        </p>

        <div className='flex justify-center items-center flex-col gap-6'>
          <img
            src={template?.transbankLogo?.file.url}
            alt='Transbank logo'
            loading='lazy'
            width={template?.transbankLogo?.file.details.image.width}
          />

          <form
            className='hidden'
            action={paymentKeys.url}
            method='POST'
            ref={transbankButton}
          >
            <input type='hidden' name='token_ws' value={paymentKeys.token} />
          </form>

          {paymentStatus === PaymentProcess.CANCELLED ||
          paymentStatus === PaymentProcess.REJECTED ? (
            <PaymentAlerts
              site={site}
              onAlertClick={() => getPaymentData(transbankButton)}
              loading={loading}
              className='w-5/6'
              AlertStatus={paymentStatus}
            />
          ) : (
            <AtButton
              label={'PAGAR $500.000'}
              variant={
                loading ? AtButtonVariant.LOADING : AtButtonVariant.PRIMARY
              }
              site={site}
              className='self-center cursor-pointer'
              disabled={false}
              onClick={() => getPaymentData(transbankButton)}
            />
          )}
        </div>
        <hr className='bg-gray-200' />

        <AtButtonLink
          variant='primary-text'
          label='CONTINUAR SIN PAGAR RESERVA'
          className='self-center mb-4 cursor-pointer'
          site={site}
          onClick={() => {
            dispatch(next())
          }}
        />
      </div>
    </MlStepCard>
  )
}
