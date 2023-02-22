import { AtCheckbox } from '@gac/core-components'
import React from 'react'
import {
  updatePrivacyTerms,
  updateTerms
} from '../../../../redux/features/buyProcessV2Slice'
import { BuyProcessV2Props } from '../../common/types'
export const CheckBoxTerms = ({
  site,
  template,
  dispatch,
  state
}: BuyProcessV2Props) => {
  const { privacyPolicyCheckbox, termsAndConditionsCheckbox } = template!.terms
  const { hasAcceptedPrivacyTerms, hasAcceptedTerms } = state.terms

  return (
    <div className='flex flex-col gap-6 mt-6'>
      <AtCheckbox
        {...termsAndConditionsCheckbox}
        checked={hasAcceptedTerms}
        onChange={(_, value) => dispatch(updateTerms(value))}
        site={site}
      />
      <AtCheckbox
        {...privacyPolicyCheckbox}
        checked={hasAcceptedPrivacyTerms}
        onChange={(_, value) => dispatch(updatePrivacyTerms(value))}
        className=''
        site={site}
      />
    </div>
  )
}
