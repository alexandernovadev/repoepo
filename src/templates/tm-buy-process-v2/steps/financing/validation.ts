import {
  BuyProcessV2State,
  FinancingSelection
} from '../../../../redux/features/buyProcessV2Slice'

export const validation = ({
  currentStep,
  financingSelection
}: BuyProcessV2State) => {
  const completed =
    financingSelection === FinancingSelection.ACCEPTED ||
    financingSelection === FinancingSelection.SKIPPED
  const active = currentStep === 3

  return {
    active,
    completed,
    disabled: !active && !completed
  }
}
