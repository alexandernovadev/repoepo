import { ContentfulOrFinancingFeatures } from '../../../../../types'
import { BuyProcessV2Props } from '../../../common/types'

export interface SimulationProps
  extends BuyProcessV2Props,
    ContentfulOrFinancingFeatures {
  onCloseClick: () => void
}
