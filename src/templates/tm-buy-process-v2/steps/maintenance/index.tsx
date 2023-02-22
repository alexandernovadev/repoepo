import { MlStepCard } from '@gac/core-components'
import { jump } from '../../../../redux/features/buyProcessV2Slice'
import { BuyProcessV2Props } from '../../common/types'
import { MaintenanceSubSteps } from './sub-steps'
import { maintenanceValidation } from './utils/maintenanceValidation'

/**
 * This component handles two different cases one for new cars and one for used cars
 *  NEW cars have a "prepaid maintenance option"
 *  USED cars have a "extended warranty option"
 */
export const Maintenance = ({
  state,
  dispatch,
  site,
  template,
  renderMaintenanceByCarProps
}: BuyProcessV2Props & { renderMaintenanceByCarProps: boolean }) => {
  const { active, completed, disabled } = maintenanceValidation(state)
  const { isNew } = state.car!

  return (
    <>
      {renderMaintenanceByCarProps ? (
        <>
          <MlStepCard
            idSection={'maintenance-section'}
            title={isNew ? 'Mantenciones prepagadas' : 'Garantía extendida'}
            active={active}
            disabled={disabled}
            completed={completed}
            onEdit={() => dispatch(jump(6))}
            site={site}
          >
            {MaintenanceSubSteps({ state, site, template: template! })}
          </MlStepCard>
        </>
      ) : null}
    </>
  )
}
