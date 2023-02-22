import { BuyProcessV2State } from '../../../../redux/features/buyProcessV2Slice'
export const validation = ({ terms, currentStep }: BuyProcessV2State) => {
  const active = currentStep === 7
  const completed = terms.hasAcceptedPrivacyTerms && terms.hasAcceptedTerms

  return {
    active,
    completed,
    disabled: !active && !completed
  }
}
