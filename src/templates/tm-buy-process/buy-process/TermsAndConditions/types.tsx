import { CheckboxProps } from '@gac/core-components/lib/atomic-components-react/components/UI/atoms/at-checkbox/types'
import { BuyProcessProps } from '../../types'
import { Document } from '@contentful/rich-text-types'

export interface TermsAndConditionsProps extends BuyProcessProps {
  text: Document
  termsAndConditionsCheckbox: CheckboxProps
  privacyPolicyCheckbox: CheckboxProps
}
