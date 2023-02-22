import { valueColor } from './classes'
import { DetailsProps, ItemProps, SectionProps } from './types'

export const Details = ({
  site,
  car,
  financing,
  installments
}: DetailsProps) => (
  <dl className='divide-y divide-gac-main-01 divide-solid'>
    <Section site={site} title='Datos auto'>
      <Item site={site} name='Auto marca' value={car.brand} />
      <Item site={site} name='Modelo' value={car.model} />
      {car.version ? (
        <Item site={site} name='Versión' value={car.version} />
      ) : null}
      <Item site={site} name='Precio' value={car.price} />
    </Section>
    <Section site={site} title='Financiamiento'>
      <Item site={site} name='Tipo de crédito' value={financing.creditType} />
      <Item
        site={site}
        name='Monto del pie'
        value={financing.initialPaymentValue}
      />
      <Item site={site} name='Nº de cuotas' value={financing.installments} />
    </Section>
    <Section site={site} title='Detalle cuotas'>
      <Item site={site} name='Valor cuota' value={installments.monthlyFee} />
      <Item
        site={site}
        name='Costo total del crédito'
        value={installments.creditTotalCost}
      />
      <Item site={site} name='CAE' value={installments.caePercentage} />
      {installments.renovationPlanCost ? (
        <Item
          site={site}
          name='Cuota final opcional'
          value={installments.renovationPlanCost}
        />
      ) : null}
    </Section>
  </dl>
)

const Section = ({ title, children }: SectionProps) => (
  <div className='flex flex-col gap-2 py-4 first:pt-0 last:pb-0'>
    <span className='text-xs text-gray-900'>{title}</span>
    {children}
  </div>
)

const Item = ({ name, value, site }: ItemProps) => (
  <div className='flex justify-between text-sm'>
    <dt className='text-gray-400'>{name}</dt>
    <dd className={`${valueColor(site)} font-medium`}>{value}</dd>
  </div>
)
