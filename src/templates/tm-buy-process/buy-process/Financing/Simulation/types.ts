import { ContentfulOrFinancingFeatures } from '../../../../../types'
import { Currencies } from '../../../../../utils/formatPrice'
import { BuyProcessProps } from '../../../types'

export interface InitialAlertProps {
  currency: Currencies
  appraisal: number
  minInitial: number
  maxInitial: number
  hasAcceptedAppraisal?: boolean
}

export interface SimulationProps
  extends BuyProcessProps,
    ContentfulOrFinancingFeatures {}
