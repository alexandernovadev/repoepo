import {
  AppraisalSelection,
  next,
  setAppraisalSelection
} from '../../../../../redux/features/buyProcessV2Slice'
import { SelectionButtons } from '../../../common/selection-buttons'
import { BuyProcessV2Props } from '../../../common/types'
import { FormAppraisal } from './FormAppraisal'
import { ResultAppraisal } from './ResultAppraisal'

export const AppraisalSubSteps = (props: BuyProcessV2Props) => {
  const { site, dispatch, state } = props

  switch (state.appraisalSelection) {
   
    case AppraisalSelection.INFORM:
      return <FormAppraisal {...props} />

    case AppraisalSelection.RESULTS:
    case AppraisalSelection.TOO_OLD:
    case AppraisalSelection.ACCEPTED:
      return <ResultAppraisal {...props} />

    default:
      return (
        <SelectionButtons
          actionValueRejected='#financing-section'
          labelAccepted='Si, quiero entregar mi auto en parte de pago'
          labelRejected='No, prefiero continuar sin entregar mi auto'
          site={site}
          onClickAccepted={() => {
            dispatch(setAppraisalSelection(AppraisalSelection.INFORM))
          }}
          onClickRejected={() => {
            if (state.appraisalSelection !== AppraisalSelection.TOO_OLD) {
              dispatch(setAppraisalSelection(AppraisalSelection.SKIPPED))
            }
            dispatch(next())
          }}
          state={state}
          disabled={state.skipSimulation}
          dispatch={dispatch}
        />
      )
  }
}
