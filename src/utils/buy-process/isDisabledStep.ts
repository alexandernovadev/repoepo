export const isDisabledStep = (step: number, disabledSteps: Array<number>) => {
  return disabledSteps.find((disabledStep) => disabledStep === step)
}
