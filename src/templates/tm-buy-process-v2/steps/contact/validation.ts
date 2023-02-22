import { BuyProcessV2State } from '../../../../redux/features/buyProcessV2Slice'

export const validation = ({ currentStep, contact }: BuyProcessV2State) => {
  const completed = !contact.error
  const active = currentStep === 1
  const disabled = currentStep !== 1 && !completed

  return {
    active,
    completed,
    disabled
  }
}
