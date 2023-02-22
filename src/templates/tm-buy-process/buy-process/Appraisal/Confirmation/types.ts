import { Sites } from '@gac/core-components/lib/@types/common'
import { BuyProcessStateProps } from '../../../../../redux/features/buyProcessSlice'

export interface AppraisalResultProps extends Sites {
  appraisalResults: BuyProcessStateProps['appraisalSimulation']
}
