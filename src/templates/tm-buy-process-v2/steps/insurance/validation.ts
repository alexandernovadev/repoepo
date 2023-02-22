import { BuyProcessV2State,  } from "../../../../redux/features/buyProcessV2Slice"

export const validation = ({
  currentStep,
  insurance
} : BuyProcessV2State) => {
  const completed = insurance.isComplete === true
  const active = currentStep === 5
  const disabled = currentStep !== 5 && !completed

  return {
    active,
    completed,
    disabled
  }
}