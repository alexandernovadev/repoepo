import { MlStepCard } from '@gac/core-components'
import { jump } from '../../../redux/features/buyProcessV2Slice'
import { BuyProcessV2Props } from '../common/types'

/**
 * TODO: Here goes expected behavior of step
 */
export const StepComponent = ({ dispatch, site }: BuyProcessV2Props) => (
  <MlStepCard
    title='Title'
    active={false} // normally the current position
    disabled={true} // usually !completed (data/requirements have not been met)
    completed={false} // usually complete when the data needed is set
    onEdit={() => dispatch(jump(-1))} // step position (active)
    site={site}
  >
    TODO
  </MlStepCard>
)
