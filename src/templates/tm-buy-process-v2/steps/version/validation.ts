import { BuyProcessV2State } from '../../../../redux/features/buyProcessV2Slice'

export const validation = (state: BuyProcessV2State) => {
  const active = state.car!.isNew && state.currentStep === 0
  const completed =
    state.car!.isNew && !!state.version.colorId && !!state.version.selectedId

  return {
    active,
    disabled: !active && !completed,
    completed
  }
}
