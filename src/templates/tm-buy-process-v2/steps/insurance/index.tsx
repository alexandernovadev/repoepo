import { MlStepCard } from '@gac/core-components'
import {
  jump,
  next,
  setInsurance
} from '../../../../redux/features/buyProcessV2Slice'
import { stepTitleClasses } from '../../common/classes'
import { SelectionButtons } from '../../common/selection-buttons'
import { BuyProcessV2Props } from '../../common/types'
import { validation } from './validation'

/**
 * TODO: Here goes expected behavior of step
 */
export const Insurance = ({
  state,
  dispatch,
  site,
  renderMaintenanceByCarProps
}: BuyProcessV2Props & { renderMaintenanceByCarProps: boolean }) => {
  const { active, completed, disabled } = validation(state)

  return (
    <MlStepCard
      idSection={'insurance-section'}
      title='Seguros'
      active={active}
      disabled={disabled}
      completed={completed}
      onEdit={() => dispatch(jump(5))}
      site={site}
    >
      <p className={stepTitleClasses}>¿Quieres asegurar tu auto?</p>
      <SelectionButtons
        actionValueAccepted={
          renderMaintenanceByCarProps
            ? '#maintenance-section'
            : '#terms-section'
        }
        actionValueRejected={
          renderMaintenanceByCarProps
            ? '#maintenance-section'
            : '#terms-section'
        }
        labelAccepted='Si, quiero evaluar opciones de seguros'
        labelRejected='No, prefiero continuar sin asegurar mi auto'
        site={site}
        onClickAccepted={() => {
          dispatch(
            setInsurance({
              isComplete: true,
              needsInsurance: true
            })
          )
          // Si el auto no tiene mantencion lo mandamos a terminos y condiciones
          renderMaintenanceByCarProps ? dispatch(next()) : dispatch(jump(7))
        }}
        onClickRejected={() => {
          dispatch(
            setInsurance({
              isComplete: true,
              needsInsurance: false
            })
          )
          // Si el auto no tiene mantencion lo mandamos a terminos y condiciones
          renderMaintenanceByCarProps ? dispatch(next()) : dispatch(jump(7))
        }}
        state={state}
        disabled={state.skipSimulation}
        dispatch={dispatch}
      />
    </MlStepCard>
  )
}
