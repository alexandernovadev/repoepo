import { BuyProcessV2State } from '../../../../../redux/features/buyProcessV2Slice'

export const maintenanceValidation = ({
  currentStep,
  maintenance
}: BuyProcessV2State) => {
  const completed = maintenance.isComplete === true
  const active = currentStep === 6
  const disabled = currentStep !== 6 && !completed

  return {
    active,
    completed,
    disabled
  }
}
