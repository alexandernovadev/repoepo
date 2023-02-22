// import { formatNumberToLocale } from '../../../utils/formatNumber'
import { formatPatent } from '../../../../utils/formatPatent'
import { formatPhoneNumber } from '../../../../utils/formatPhoneNumber'
import { formatRut } from '../../../../utils/formatRut'

// import { SitesNames } from '../../../types'
import { formatDate } from '../../../../utils/formatDate'
import { isObjectEmpty } from '../../../../utils/isObjectEmpty'
import { SummaryDataGroup } from '../../common/types'
import { BuyProcessV2State } from '../../../../redux/features/buyProcessV2Slice'
import { Currencies, priceFormatter } from '../../../../utils/formatPrice'
import { findCreditType } from '../../common/data'
import { SitesNames } from '../../../../types'
import { getTypePaymentByCode } from '../payment/getTypePaymentByCode'
import { formatFinancingPrice } from '../../../../utils/formatFinancingPrice'

// This funtion extract all data information
// from webpay when the process finished, for now is burned

// TODO: Fill this function with real DATA
export const prepareReservationPayData = (
  isPayReserved: boolean,
  state: BuyProcessV2State
) => {
  const {
    orderNumber,
    ammount,
    datePayment,
    dues,
    lastFourDigitsCard,
    typePayment
  } = state.reservationPayment

  if (!isPayReserved) {
    return {}
  }

  let invoice = [
    { label: 'Número de la orden:', value: orderNumber },
    { label: 'Monto', value: priceFormatter(ammount!, Currencies.CLP) },
    {
      label: 'Tipo de pago',
      value: getTypePaymentByCode(typePayment as string)
    },
    {
      label: '4 últimos digitos tarjeta',
      value: `**** **** **** ${lastFourDigitsCard}`
    },
    { label: 'Cuotas', value: dues === 0 ? 'Sin cuotas' : dues },
    { label: 'Fecha del pago', value: formatDate(new Date(datePayment!)) }
  ]

  if (typePayment === 'VD' || typePayment === 'VP') {
    invoice = invoice.filter(
      ({ value }) => value !== 0 && (value as string) !== 'Sin cuotas'
    )
  }

  return { invoice }
}

const priceSelector = ({
  version,
  car,
  needsFinancing,
  financingSimulation
}: BuyProcessV2State) => {
  const { secondPrice, isNew } = car!
  const isFinancing = needsFinancing && !isObjectEmpty(financingSimulation)
  const {
    priceCC,
    priceSC,
    listPrice,
    priceOP,
    dealerBonusSP,
    brandBonusSP,
    currency
  } = version.price ?? {}

  const price = (
    label: string,
    price?: number | null,
    altPrice?: number | null
  ) => {
    if (price && !altPrice) {
      return [
        {
          label,
          value: priceFormatter(price, currency!)
        }
      ]
    }

    if (price && altPrice) {
      return [
        {
          label,
          value: `${priceFormatter(price, currency!)}\n${priceFormatter(
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

const prepareCarData = (state: BuyProcessV2State) => [
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
        value: state.version.selected
      }
    : false,
  state?.version.color
    ? {
        label: 'Color',
        value: state.version.color
      }
    : false,
  ...priceSelector(state)
]

const prepareContactData = (state: BuyProcessV2State) => {
  const { address, apartment, addressNumber, birthDate } =
    state.personalData.fields
  return [
    {
      label: 'Fecha de Nacimiento',
      value: formatDate(new Date(birthDate))
    },
    {
      label: 'Dirección',
      value: `${address} ${addressNumber ?? ''}`
    },
    apartment.length > 0 && {
      label: 'Departamento',
      value: apartment
    }
  ].filter((value) => value && value.value && value.value !== '')
}

const preparePersonalData = (state: BuyProcessV2State) => {
  const { name, lastNames, rut, phone, email, region, commune } =
    state.contact.fields
  return [
    {
      label: 'Nombre',
      value: `${name}  ${lastNames}`
    },
    {
      label: 'RUT',
      value: formatRut(rut)
    },
    {
      label: 'Teléfono',
      value: formatPhoneNumber(phone)
    },
    {
      label: 'Email',
      value: email
    },
    {
      label: 'Región',
      value: region
    },
    {
      label: 'Comuna',
      value: commune
    }
  ]
}
const prepareLaboralData = (state: BuyProcessV2State) => {
  const { studies, activity, income, incomeType, realState, contractType } =
    state.occupationalData.fields
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
      label: 'Ingreso mensual',
      value: priceFormatter(+income ?? 0, Currencies.CLP)
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
      label: 'Bienes Raices',
      value: realState
    }
  ]
}
const prepareAppraisalData = (state: BuyProcessV2State, site: SitesNames) => {
  let appraisalData = [
    {
      label: 'Entrega auto en parte de pago',
      value: state.appraisalResults?.patent ? 'Si' : 'No'
    }
  ]

  if (state.appraisalResults?.patent) {
    appraisalData.push(
      {
        label: 'Tasación',
        value: priceFormatter(
          state.appraisalResults?.suggestedPrice!,
          Currencies.CLP
        )
      },
      {
        label: 'Marca',
        value: state.appraisalResults?.brand
      },
      {
        label: 'Modelo',
        value: state.appraisalResults?.model
      },
      {
        label: 'Versión',
        value: state.appraisalResults?.version
      },
      {
        label: 'Año',
        value: String(state.appraisalResults?.year)
      },
      {
        label: 'Kilometraje',
        value: `${(state.appraisalResults?.mileage).toLocaleString(
          'es-CL'
        )} kms`
      },
      {
        label: 'Patente',
        value: formatPatent(state.appraisalResults?.patent, site)
      }
    )
  }
  return appraisalData
}

// const preparePaymentData = (state: BuyProcessV2State) => {
//   return [
//     {
//       label: 'Pagado',
//       value: state.reservationPayment.ammount
//     }
//   ]
// }

const prepareFinancingQuotelData = (state: BuyProcessV2State) => {
  return [
    {
      label: 'Valor cuota',
      value: priceFormatter(
        state.financingSimulation?.duesValue!,
        Currencies.CLP
      )
    },
    {
      label: 'Costo total del crédito',
      value: priceFormatter(
        state.financingSimulation?.totalCredit!,
        Currencies.CLP
      )
    },
    {
      label: 'CAE',
      value: state.financingSimulation?.annualEquivalency + '%'
    },
    state.selectedCreditType !== 1 && {
      label: 'Cuota final opcional',
      value: priceFormatter(
        state.financingSimulation?.guaranteedFutureValue!,
        Currencies.CLP
      )
    }
  ]
}

const prepareInsurancelData = () => {
  return [
    {
      label: 'Compañia',
      value: 'SURA'
    },
    {
      label: 'Deducibles',
      value: '10 UF'
    },
    {
      label: 'Valor cuota',
      value: '$79.991'
    }
  ]
}
const prepareFinancinglData = (
  state: BuyProcessV2State,
  hasValidFinancing: boolean
) => {
  const currency = state?.car?.price?.currency ?? Currencies.CLP

  let financigData = [
    {
      label: 'Quiere financiamiento',
      value: hasValidFinancing ? 'Si' : 'No'
    }
  ]
  if (hasValidFinancing) {
    financigData.push(
      {
        label: 'Tipo de crédito',
        value: findCreditType(state.selectedCreditType)?.value!
      },
      {
        label: 'Monto del pié',
        value: formatFinancingPrice(
          state.financingSimulation?.initialPayment!,
          currency
        )
      },
      {
        label: 'Nº de cuotas',
        value: state.financingSimulation?.dues!
      }
    )
  }
  return financigData
}

export const prepareSummaryData = (
  state: BuyProcessV2State,
  site: SitesNames
) => {
  const hasValidFinancing =
    state.needsFinancing &&
    state.car?.financing &&
    !isObjectEmpty(state.financingSimulation)

  const isOcupationValid =
    state.occupationalData.fields.activity === '' &&
    state.occupationalData.fields.contractType === '' &&
    state.occupationalData.fields.income === ''

  return {
    order: [
      {
        title: 'Datos auto',
        items: prepareCarData(state)
      },
      {
        title: 'Tasación',
        items: prepareAppraisalData(state, site)
      },
      {
        title: 'Financiamiento',
        items: prepareFinancinglData(state, hasValidFinancing!)
      },
      hasValidFinancing && {
        title: 'Detalle cuotas',
        items: prepareFinancingQuotelData(state)
      },
      // TODO: Implementar esta seccion cuando este
      // disponible, por ahora no necesita el state
      // hay data quemada
      {
        title: 'Seguros',
        items: prepareInsurancelData()
      }
      // isPaymentValid && {
      //   title: 'Mantención prepagada',
      //   items: preparePaymentData(state)
      // }
    ].filter((v) => v) as SummaryDataGroup[],
    applicant: [
      {
        title: 'Datos de contacto',
        items: preparePersonalData(state)
      },
      ...(state.needsFinancing &&
      !isObjectEmpty(state.contact.fields) &&
      !isObjectEmpty(state.personalData.fields.birthDate)
        ? [
            {
              title: 'Datos personales',
              items: prepareContactData(state)
            },
            !isOcupationValid && {
              title: 'Datos laborales',
              items: prepareLaboralData(state)
            }
          ]
        : [])
    ].filter((v) => v) as SummaryDataGroup[]
  }
}
