import {
  AtButton,
  AtCheckbox,
  MlHeading,
  MlRichText,
  MlRichTextVariant
} from '@gac/core-components'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {
  next,
  previous,
  setIsFinancingPreApproved,
  setPreApprovedStatus,
  updatePrivacyTerms,
  updateTerms
} from '../../../../redux/features/buyProcessSlice'
import {
  selectionContentClasses,
  TermsAndConditionsRichTextClasses
} from '../../classes'
import { appraisalTitleHeading } from '../../data'
import { session } from '../../session'
import { GetReCaptchaTokenFn, Locations } from '../../types'
import { getPreApprovalResponse, submitBuyRequest } from './submit'
import { TermsAndConditionsProps } from './types'

export const TermsAndConditions = ({
  data,
  dispatch,
  text,
  site,
  termsAndConditionsCheckbox,
  privacyPolicyCheckbox,
  getReCaptchaToken,
  locations
}: TermsAndConditionsProps & GetReCaptchaTokenFn & Locations) => {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { hasAcceptedTerms, hasAcceptedPrivacyTerms } = data.terms

  const finishFlow = async () => {
    setLoading(true)

    try {
      const token = await getReCaptchaToken()
      const { isFinancingPreApproved, preApprovedStatus } =
        await getPreApprovalResponse(data, site, locations)
      const state = { ...data, isFinancingPreApproved }
      dispatch(setIsFinancingPreApproved(isFinancingPreApproved))
      dispatch(setPreApprovedStatus(preApprovedStatus))
      await submitBuyRequest(state, site, token)
      await session(state, site, token)

      dispatch(next())
      setLoading(false)
    } catch (error) {
      console.log(error)
      router.push('/404')
    }
  }

  return (
    <div className={selectionContentClasses}>
      <MlHeading
        {...appraisalTitleHeading(site)}
        title='Términos y condiciones'
        description='Lee atentamente lo indicado a continuación'
      />
      <div className='shadow-selectDragable bg-white rounded-2xl py-10 pl-6 pr-3 flex flex-col'>
        <MlRichText
          text={text}
          variant={MlRichTextVariant.TERMS_AND_CONDITIONS}
          site={site}
          className={TermsAndConditionsRichTextClasses}
        />
        <div className='flex flex-col pt-4 space-y-10'>
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
            site={site}
          />
        </div>
      </div>
      <div className='flex gap-4'>
        <AtButton
          label='Volver'
          variant='primary-text'
          className='py-2 px-6'
          onClick={() => dispatch(previous())}
          site={site}
        />
        <AtButton
          label='Continuar'
          variant={loading ? 'loading' : 'primary'}
          className='py-2 px-6'
          onClick={() => {
            finishFlow()
          }}
          disabled={loading || !hasAcceptedTerms || !hasAcceptedPrivacyTerms}
          site={site}
        />
      </div>
    </div>
  )
}
