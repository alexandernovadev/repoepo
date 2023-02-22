import {
  AppraisalSelection,
  BuyProcessV2Car,
  BuyProcessV2State,
  FinancingSelection
} from '../../../redux/features/buyProcessV2Slice'
import { CreditType, CreditTypes } from '../../../utils/creditType'
import { Currencies, priceFormatter } from '../../../utils/formatPrice'
import { toCapitalize } from '../../../utils/toCapitalize'

export const prepareBaseCarData = (car: BuyProcessV2Car) => ({
  carImgSrc: car.imageUrl,
  carImgAlt: car.imageAlt,
  logoSrc: car.logoUrl,
  logoAlt: car.logoAlt,
  brand: car.brand,
  model: car.model,
  features: car.features?.map(({ label }) => toCapitalize(label ?? ''))
})

export const findCreditType = (id?: number): CreditType | undefined => {
  return CreditTypes.find((credit: CreditType) => credit.id === id)
}

export const aditionalDataValue = (data: BuyProcessV2State): string => {
  switch (true) {
    case data.personalData?.fields.birthDate !== '':
      return 'Datos ingresados'

    case data.occupationalData.fields.activity !== '':
      return 'Datos ingresados'
    default:
      return ''
  }
}

export const prepareCardSummary = (data: BuyProcessV2State) =>
  [
    {
      label: 'Versión del auto',
      value: data.car?.isNew ? data.version.selected : ''
    },
    {
      label: 'Color',
      value: data.car?.isNew ? data.version.color : ''
    },
    {
      label: 'Tasación',
      value:
        data.appraisalResults?.suggestedPrice &&
        data.appraisalSelection === AppraisalSelection.ACCEPTED
          ? // TODO: Not ready for Wigo (neither in v1)
            `${priceFormatter(
              data.appraisalResults.suggestedPrice,
              Currencies.CLP
            )} (pre-aprobado)`
          : ''
    },
    {
      label: 'Financiamiento',
      value:
        data.financingSelection === FinancingSelection.ACCEPTED
          ? `Crédito ${findCreditType(data.selectedCreditType)?.value} a ${
              data.financingSimulation?.dues
            } cuotas (${priceFormatter(
              data.financingSimulation?.duesValue ?? 0,
              Currencies.CLP
            )})`
          : data.financingSelection === FinancingSelection.SKIPPED
          ? 'Sin financiamiento'
          : ''
    },
    {
      label: 'Datos adicionales',
      value: aditionalDataValue(data)
    },
    {
      label: 'Seguros',
      value:
        !data.insurance.isComplete && !data.insurance.needsInsurance ? null : (data.insurance.needsInsurance ? 'Si' : 'No')
    },
    {
      label: data.car?.isNew ? 'Mantenciones prepagadas' : 'Garantía extendida',
      value:
        !data.maintenance.needsMaintenance && !data.maintenance.isComplete ? null : (data.maintenance.needsMaintenance ? 'Si' : 'No')
    },
    {
      label: 'Términos y condiciones',
      value:
        data.terms.hasAcceptedPrivacyTerms && data.terms.hasAcceptedTerms
          ? 'Aceptadas'
          : null
    }
  ].filter((v) => !!v.value) as Record<'label' | 'value', string>[]
