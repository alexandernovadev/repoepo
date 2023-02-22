import { BuyProcessV2State } from '../../../../redux/features/buyProcessV2Slice'

export const validation = ({
  currentStep,
  personalData,
  occupationalData,
  needsFinancing
}: BuyProcessV2State) => {
  const completed = needsFinancing
    ? !personalData.error && !occupationalData.error
    : !personalData.error
  const active = currentStep === 4
  const disabled = currentStep !== 4 && !completed

  return {
    active,
    completed,
    disabled
  }
}
