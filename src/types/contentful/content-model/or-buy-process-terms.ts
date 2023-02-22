import { Document } from '@contentful/rich-text-types'
import { CheckboxProps } from '@gac/core-components/lib/atomic-components-react/components/UI/atoms/at-checkbox/types'

export interface ContentfulOrBuyProcessTerms {
  text: Document
  termsAndConditionsCheckbox: CheckboxProps
  privacyPolicyCheckbox: CheckboxProps
}
