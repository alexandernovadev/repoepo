import { BuyProcessV2Props } from '../../../common/types'

export interface FinancingModalProps extends BuyProcessV2Props {
  isOpen: boolean
  onCloseClick: () => void
}
