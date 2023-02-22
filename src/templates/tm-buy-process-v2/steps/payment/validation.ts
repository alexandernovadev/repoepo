import { BuyProcessV2State } from '../../../../redux/features/buyProcessV2Slice'

export const validation = ({ currentStep }: BuyProcessV2State) => {
  const active = currentStep === 8
  const completed = false // TODO: Validate it

  return {
    active,
    completed,
    disabled: !active && !completed
  }
}
