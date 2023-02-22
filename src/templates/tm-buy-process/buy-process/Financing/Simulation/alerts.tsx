import { formatFinancingPrice } from '../../../../../utils/formatFinancingPrice'
import { InitialAlertProps } from './types'

export const LowerAppraisalAlert = ({
  currency,
  appraisal,
  minInitial,
  maxInitial,
  hasAcceptedAppraisal
}: InitialAlertProps) => (
  <>
    El monto de tasación de tu vehículo es{' '}
    <strong>{formatFinancingPrice(appraisal, currency)}</strong>, lo cuál es
    menor al mínimo requerido de un 20% del valor del vehículo que deseas
    comprar (
    <strong className='font-medium'>
      {formatFinancingPrice(minInitial, currency)}
    </strong>
    ), por lo que debes hacer un aporte adicional. Recuerda que puedes dar un
    pie total de hasta{' '}
    <strong className='font-medium'>
      {formatFinancingPrice(maxInitial, currency)}
    </strong>
    .{hasAcceptedAppraisal && <AppraisalAlertMesage />}
    <br />
    Selecciona el monto total que deseas entregar como pie:
  </>
)

export const MediumAppraisalAlert = ({
  currency,
  appraisal,
  minInitial,
  maxInitial,
  hasAcceptedAppraisal
}: InitialAlertProps) => (
  <>
    El monto de tasación de tu vehículo es{' '}
    <strong>{formatFinancingPrice(appraisal, currency)}</strong>, Puedes
    seleccionar un pie menor a este monto (mínimo{' '}
    <strong className='font-medium'>
      {formatFinancingPrice(minInitial, currency)}
    </strong>
    ) y te devolveremos la diferencia, o puedes entregar un pie mayor, haciendo
    un aporte adicional al valor de la tasación. Recuerda que puedes dar un pie
    total de hasta{' '}
    <strong className='font-medium'>
      {formatFinancingPrice(maxInitial, currency)}
    </strong>
    .{hasAcceptedAppraisal && <AppraisalAlertMesage />}
    <br />
    Selecciona el monto total que deseas entregar como pie:
  </>
)
export const HigherAppraisalAlert = ({
  currency,
  appraisal,
  minInitial,
  maxInitial,
  hasAcceptedAppraisal
}: InitialAlertProps) => (
  <>
    El monto de tasación de tu vehículo es{' '}
    <strong>{formatFinancingPrice(appraisal, currency)}</strong>, lo cuál excede
    el máximo permitido de 50% del valor del vehículo que deseas comprar (
    <strong className='font-medium'>
      {formatFinancingPrice(maxInitial, currency)}
    </strong>
    ). Puedes seleccionar un pie menor a este monto (mínimo{' '}
    <strong className='font-medium'>
      {formatFinancingPrice(minInitial, currency)}
    </strong>
    ) y te devolveremos la diferencia.
    {hasAcceptedAppraisal && <AppraisalAlertMesage />}
    <br />
    Selecciona el monto total que deseas entregar como pie:
  </>
)

const AppraisalAlertMesage = () => (
  <p>
    <br />
    <strong>
      Recuerda que el monto de tasación de tu vehículo en parte de pago está
      sujeto a revisión, la cuál será confirmada por el ejecutivo.
    </strong>
  </p>
)
