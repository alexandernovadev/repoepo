import { SitesNames } from '@gac/core-components/lib/@types/common'
import { BuyProcessStateProps } from '../../../../../redux/features/buyProcessSlice'
import { formatNumberToLocale } from '../../../../../utils/formatNumber'
import { formatPatent } from '../../../../../utils/formatPatent'

const features = ['year', 'version', 'mileage', 'patent']

export const prepareFeatures = (
  appraisalSelection: BuyProcessStateProps['appraisalSimulation'],
  site: SitesNames
) =>
  features
    // @ts-expect-error
    .filter((id) => !!appraisalSelection![id] || appraisalSelection![id] !== '')
    .map((id) => {
      // @ts-expect-error
      let label = appraisalSelection![id]
      if (id === 'patent') label = `Patente: ${formatPatent(label, site)}`
      if (id === 'mileage') label = `${formatNumberToLocale(label, 'mileage')}s`

      return { id, label }
    })
