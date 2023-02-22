import { BuyProcessStateProps } from '../../../../redux/features/buyProcessSlice'
import { SitesNames } from '../../../../types'
import { formatDate } from '../../../../utils/formatDate'
import { formatNumberToLocale } from '../../../../utils/formatNumber'
import { formatPatent } from '../../../../utils/formatPatent'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import { Currencies, priceFormatter } from '../../../../utils/formatPrice'
import { formatRut } from '../../../../utils/formatRut'
import { isObjectEmpty } from '../../../../utils/isObjectEmpty'
import { SummaryDataGroup } from './types'

const priceSelector = ({
  car,
  needsFinancing,
  financingSimulation
}: BuyProcessStateProps) => {
  const { price: prices, secondPrice, isNew } = car!
  const isFinancing = needsFinancing && !isObjectEmpty(financingSimulation)
  const {
    priceCC,
    priceSC,
    listPrice,
    priceOP,
    dealerBonusSP,
    brandBonusSP,
    currency
  } = prices ?? {}

  const price = (
    label: string,
    price?: number | null,
    altPrice?: number | null
  ) => {
    if (price && !altPrice) {
      return [
        {
          label,
          value: priceFormatter(price, currency)
        }
      ]
    }

    if (price && altPrice) {
      return [
        {
          label,
          value: `${priceFormatter(price, currency)}\n${priceFormatter(
            altPrice,
            secondPrice!.currency
          )}`
        }
      ]
    }

    return []
  }

  if (!isNew) {
    if (priceOP) {
      return price('Precio oferta', priceOP, secondPrice?.priceOP)
    }

    return price('Precio lista', listPrice, secondPrice?.listPrice)
  }

  if (isFinancing) {
    if (/inteligente/i.test(financingSimulation!.purchaseType)) {
      return price(
        'Precio crédito inteligente',
        priceSC ?? listPrice,
        secondPrice?.priceSC ?? secondPrice?.listPrice
      )
    }

    return price(
      'Precio crédito convencional',
      priceCC ?? listPrice,
      secondPrice?.priceCC ?? secondPrice?.listPrice
    )
  }

  const cashPrice = listPrice
    ? listPrice - (dealerBonusSP ?? 0) - (brandBonusSP ?? 0)
    : 0
  const secondCashPrice = secondPrice?.listPrice
    ? secondPrice?.listPrice -
      (secondPrice?.dealerBonusSP ?? 0) -
      (secondPrice?.brandBonusSP ?? 0)
    : 0

  return price('Precio contado', cashPrice, secondCashPrice)
}

const prepareCarData = (state: BuyProcessStateProps) =>
  [
    {
      label: 'Auto marca',
      value: state.car?.brand
    },
    {
      label: 'Modelo',
      value: state.car?.model
    },
    state.car?.version
      ? {
          label: 'Versión',
          value: state.car?.version
        }
      : false,
    ...priceSelector(state)
  ].filter((v) => v)

// TODO: Not ready for Wigo
const prepareAppraisalData = (data: BuyProcessStateProps, site: SitesNames) => {
  const { appraisalSimulation, hasAcceptedAppraisal, appraisal } = data

  const showAppraisalData: boolean =
    appraisal?.year !== '' &&
    appraisal?.mileage !== '' &&
    appraisal?.brand !== '' &&
    appraisal?.model !== '' &&
    appraisal?.version !== ''

  return [
    {
      label: 'Entrega auto en parte de pago',
      value: hasAcceptedAppraisal || showAppraisalData ? 'Sí' : 'No'
    },
    ...(hasAcceptedAppraisal || showAppraisalData
      ? [
          {
            label: 'Tasación',
            value: appraisalSimulation?.suggestedPrice
              ? priceFormatter(
                  appraisalSimulation?.suggestedPrice!,
                  Currencies.CLP
                )
              : null
          },
          {
            label: 'Marca',
            value: appraisal?.brand
          },
          {
            label: 'Modelo',
            value: appraisal?.model
          },
          {
            label: 'Versión',
            value: appraisal?.version
          },
          {
            label: 'Año',
            value: appraisal?.year
          },
          {
            label: 'Kilometraje',
            value: `${formatNumberToLocale(
              appraisal?.mileage.replace(/\D/g, ''),
              'mileage'
            )}s`
          },
          appraisal?.patent
            ? {
                label: 'Patente',
                value: formatPatent(appraisal?.patent, site)
              }
            : undefined
        ]
      : [])
  ]
}
// TODO: Not ready for Wigo
const prepareFinancingData = (
  financing: BuyProcessStateProps['financingSimulation'],
  needsFinancing: boolean
) => [
  {
    label: 'Quiere financiamiento',
    value: needsFinancing ? 'Sí' : 'No'
  },
  ...(!isObjectEmpty(financing) && needsFinancing
    ? [
        {
          label: 'Tipo de crédito',
          value: /inteligente/i.test(financing?.purchaseType ?? '')
            ? 'Inteligente'
            : 'Convencional'
        },
        {
          label: 'Monto del pié',
          value: financing?.initialPayment
            ? priceFormatter(financing?.initialPayment, Currencies.CLP)
            : ''
        },
        {
          label: 'Nº de cuotas',
          value: financing?.dues
        }
      ]
    : [])
]

// TODO: Not ready for Wigo
const prepareDuesData = (
  financing: BuyProcessStateProps['financingSimulation']
) => [
  financing?.duesValue && {
    label: 'Valor cuota',
    value: financing?.duesValue
      ? priceFormatter(financing?.duesValue, Currencies.CLP)
      : ''
  },
  financing?.totalCredit && {
    label: 'Costo total del crédito',
    value: financing?.totalCredit
      ? priceFormatter(financing?.totalCredit, Currencies.CLP)
      : ''
  },
  financing?.annualEquivalency && {
    label: 'CAE',
    value: financing?.annualEquivalency
      ? `${financing?.annualEquivalency}%`
      : ''
  },
  financing?.guaranteedFutureValue && /inteligente/i.test(financing?.purchaseType!) && {
    label: 'Cuota final opcional',
    value: financing?.guaranteedFutureValue
      ? priceFormatter(financing?.guaranteedFutureValue, Currencies.CLP)
      : ''
  }
]

const prepareContactData = (
  fields: BuyProcessStateProps['contact']['contactData'],
  site: SitesNames
) => [
  {
    label: 'Nombre',
    value: `${fields.name} ${fields.lastNames}`

  },
  {
    label: 'RUT',
    value: fields.dni ?? formatRut(fields.rut as string)
  },
  {
    label: 'Teléfono',
    value: formatPhoneNumber(fields.phone as string, site)
  },
  {
    label: 'Email',
    value: fields.email
  },
  {
    label: 'Región',
    value: fields.region
  },
  {
    label: 'Comuna',
    value: fields.commune
  },
].filter((value) => value && value.value !== '')

const preparePersonalData = (
  personal: BuyProcessStateProps['contact']['personalData'],
  isFinancing: boolean,
  site: SitesNames
) => {
  const address = isFinancing
    ? `${personal.address} ${personal.addressNumber}`
    : personal.address

  if (site === SitesNames.WIGO_MOTORS) {
    return [
      {
        label: 'Fecha de nacimiento',
        value: formatDate(new Date(personal.birthDate as string))
      },
      {
        label: 'Región',
        value: personal.region ?? ''
      },
      {
        label: 'Comuna',
        value: personal.commune ?? ''
      },
      {
        label: 'Dirección',
        value: address
      },
      {
        label: 'Número',
        value: personal.addressNumber
      },
      {
        label: 'Departamento',
        value: personal.apartment
      }
    ].filter((value) => value && value.value !== undefined && value.value !== '')
  }

  return [
    {
      label: 'Fecha de nacimiento',
      value: formatDate(new Date(personal.birthDate as string))
    },
    {
      label: 'Región',
      value: personal.region
    },
    {
      label: 'Comuna',
      value: personal.commune
    },
    {
      label: 'Dirección',
      value: address
    },
    {
      label: 'Departamento',
      value: personal.apartment
    }
  ].filter((value) => value && value.value && value.value !== '')
}

// TODO: Not ready for Wigo
const prepareOccupationalData = (
  occupational: BuyProcessStateProps['contact']['occupationalData']
) => {
  const { income, studies, contractType, incomeType, realState, activity, laborOld } = occupational
  return [
    {
      label: 'Nivel de Estudios',
      value: studies
    },
    {
      label: 'Ocupación Actual',
      value: activity
    },
    {
      label: 'Antigüedad laboral',
      value: laborOld
    },
    {
      label: 'Ingreso mensual',
      value: priceFormatter(
        Number.parseInt(income as string),
        Currencies.CLP
      )
    },
    {
      label: 'Tipo de Ingreso',
      value: incomeType
    },
    {
      label: 'Tipo de Contrato',
      value: contractType
    },
    {
      label: 'Bienes Raíces',
      value: realState
    },
  ].filter((value) => value && value.value && value.value !== '')
}

export const prepareSummaryData = (
  data: BuyProcessStateProps,
  site: SitesNames
) => {
  const hasValidFinancing =
    data.needsFinancing &&
    data.car?.financing &&
    !isObjectEmpty(data.financingSimulation)

  return {
    order: [
      {
        title: 'Datos auto',
        items: prepareCarData(data)
      },
      {
        title: 'Tasación',
        items: prepareAppraisalData(data, site)
      },
      {
        title: `Financiamiento ${
          hasValidFinancing && !data.isFinancingPreApproved
            ? '(Sujeto a validación de condiciones crediticias)'
            : ''
        }`,
        items: prepareFinancingData(
          data.financingSimulation,
          !!data.needsFinancing
        )
      },
      hasValidFinancing && (data.financingSimulation?.duesValue || data.financingSimulation?.totalCredit || data.financingSimulation?.annualEquivalency || data.financingSimulation?.guaranteedFutureValue) && {
        title: `Detalle cuotas ${
          !data.isFinancingPreApproved
            ? '(Sujeto a validación de condiciones crediticias)'
            : ''
        }`,
        items: prepareDuesData(data.financingSimulation)
      }
    ].filter((v) => v) as SummaryDataGroup[],
    applicant: [
      {
        title: 'Datos de contacto',
        items: prepareContactData(data.contact.contactData, site)
      },
      ...(data.needsFinancing &&
      !isObjectEmpty(data.contact.personalFinancingData) &&
      !isObjectEmpty(data.contact.occupationalData)
        ? [
            {
              title: 'Datos personales',
              items: preparePersonalData(
                data.contact.personalFinancingData,
                true,
                site
              )
            },
            {
              title: 'Datos laborales',
              items: prepareOccupationalData(data.contact.occupationalData)
            }
          ]
        : [])
    ].filter((v) => v) as SummaryDataGroup[]
  }
}
