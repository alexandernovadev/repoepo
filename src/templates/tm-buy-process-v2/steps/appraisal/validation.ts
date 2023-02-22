import {
  AppraisalSelection,
  BuyProcessV2State
} from '../../../../redux/features/buyProcessV2Slice'

export const validation = ({
  currentStep,
  appraisalSelection
}: BuyProcessV2State) => {
  const active = currentStep === 2
  const completed =
    appraisalSelection === AppraisalSelection.ACCEPTED ||
    appraisalSelection === AppraisalSelection.SKIPPED ||
    appraisalSelection === AppraisalSelection.TOO_OLD

  return {
    active,
    completed,
    disabled: !active && !completed
  }
}
