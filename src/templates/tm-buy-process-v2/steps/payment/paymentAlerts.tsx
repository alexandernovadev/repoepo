import { AtButton, AtButtonVariant } from '@gac/core-components'
import { PaymentProcess } from '../../../../redux/features/buyProcessV2Slice'
import { Sites } from '../../../../types'

interface PaymentAlertsProps extends Sites {
  onAlertClick?: () => void
  className?: string
  loading?: boolean
  isbutton?: boolean
  AlertStatus: PaymentProcess
}

const getTextByAlertStatus = (alertStatus: PaymentProcess) => {
  switch (alertStatus) {
    case PaymentProcess.CANCELLED:
      return {
        label: 'Pago Cancelado',
        description: 'Terminó el tiempo de espera o cancelaste la transacción.'
      }

    case PaymentProcess.REJECTED:
      return {
        label: 'Pago rechazado',
        description:
          'Revisa los datos de tu tarjeta y el cupo disponible de tu tarjeta al momento de pagar y así verificar que cuentas con saldo disponible para realizar la transacción.'
      }

    default:
      return {
        label: '',
        description: ''
      }
  }
}

export const PaymentAlerts = ({
  site,
  onAlertClick,
  loading = false,
  isbutton = true,
  AlertStatus,
  className = ''
}: PaymentAlertsProps) => {
  const { label, description } = getTextByAlertStatus(AlertStatus)

  return (
    <div
      className={`flex flex-col p-4 gap-6 rounded-3xl bg-white shadow-card_rating ${className}`}
    >
      <div className='flex items-center justify-center bg-yellow-50 rounded-lg h-12'>
        <svg
          width='19'
          height='16'
          viewBox='0 0 19 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='fill-yellow-800'
        >
          <path d='M9.43749 5C9.31249 5 9.24999 5.09375 9.24999 5.21875L9.46874 11.3438C9.46874 11.4375 9.56249 11.5 9.65624 11.5H10.3125C10.4062 11.5 10.5 11.4375 10.5 11.3438L10.7187 5.21875C10.7187 5.09375 10.6562 5 10.5312 5H9.43749ZM9.99999 12.125C9.49999 12.125 9.12499 12.5312 9.12499 13C9.12499 13.5 9.49999 13.875 9.99999 13.875C10.4687 13.875 10.875 13.5 10.875 13C10.875 12.5312 10.4687 12.125 9.99999 12.125ZM18.7812 13.75L11.2812 0.75C10.7187 -0.25 9.24999 -0.25 8.68749 0.75L1.18749 13.75C0.624993 14.75 1.34374 16 2.49999 16H17.5C18.625 16 19.375 14.75 18.7812 13.75ZM17.5 15H2.49999C2.09374 15 1.87499 14.5938 2.06249 14.25L9.56249 1.25C9.74999 0.9375 10.2187 0.9375 10.4062 1.25L17.9062 14.25C18.125 14.5938 17.875 15 17.5 15Z' />
        </svg>
        <span className='pl-1 text-xs font-medium text-yellow-800'>
          {label}
        </span>
      </div>

      <p className='text-sm font-light text-gray-600 text-center'>
        {description}
      </p>

      {isbutton && (
        <AtButton
          label={'INTENTAR NUEVAMENTE $500.000'}
          variant={loading ? AtButtonVariant.LOADING : AtButtonVariant.PRIMARY}
          site={site}
          className='self-center cursor-pointer'
          disabled={false}
          onClick={() => {
            if (onAlertClick) onAlertClick()
          }}
        />
      )}
    </div>
  )
}
