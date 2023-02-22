import { SelectionButtons } from '../../../common/selection-buttons'
import { stepTitleClasses } from '../../../common/classes'
import { useDispatch } from 'react-redux'
import { Sites } from '../../../../../types'
import {
  BuyProcessV2State,
  next,
  setMaintenance,
  setMaintenanceSubStep
} from '../../../../../redux/features/buyProcessV2Slice'

interface DefaultStepProps extends Sites {
  state: BuyProcessV2State
}

export const DefaultStep = ({ site, state }: DefaultStepProps) => {
  const dispatch = useDispatch()
  const { car } = state
  const dataByCar = {
    title: car?.isNew
      ? '¿Quieres prepagar tus mantenciones?'
      : '¿Quieres contratar tu garantía extendida?',
    labelAccepted: car?.isNew
      ? 'Si, quiero prepagar mis mantenciones.'
      : 'Si, quiero contratar mi garantía extendida.',
    labelRejected: car?.isNew
      ? 'No, quiero continuar sin prepagar mis mantenciones.'
      : 'No, quiero continuar sin contratar mi garantía extendida.'
  }

  return (
    <>
      <p className={stepTitleClasses}>{dataByCar.title}</p>

      <SelectionButtons
        actionValueRejected='#terms-section'
        labelAccepted={dataByCar.labelAccepted}
        labelRejected={dataByCar.labelRejected}
        site={site}
        onClickAccepted={() => {
          // Esta validacion se debe eliminar cuando se maquete el step de mantencion prepagada para nuevos OJO!!!
          if (car?.isNew) {
            dispatch(
              setMaintenance({
                isComplete: true,
                needsMaintenance: true
              })
            )
            dispatch(next())
          } else {
            dispatch(setMaintenanceSubStep('next'))
          }
        }}
        onClickRejected={() => {
          dispatch(
            setMaintenance({
              isComplete: true,
              needsMaintenance: false
            })
          )
          dispatch(next())
        }}
        state={state}
        disabled={state.skipSimulation}
        dispatch={dispatch}
      />
    </>
  )
}
