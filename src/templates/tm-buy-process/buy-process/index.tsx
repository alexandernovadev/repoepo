import { useEffect } from 'react'
import useOverrideStepQuery, {
  queryBuyProcessProps
} from '../../../hooks/useOverrideStepQuery'
import { ContentfulTemplateBuyProcess } from '../../../types'
import { QueryUrlData } from '../data'
import { BuyProcessProps, GetReCaptchaTokenFn } from '../types'
import { AdditionalData } from './AdditionalData'
import { Appraisal } from './Appraisal'
import { ContactData } from './ContactData'
import { Financing } from './Financing'
import { Summary } from './Summary'
import { TermsAndConditions } from './TermsAndConditions'

interface BuyProcessContainerProps extends BuyProcessProps {
  template: ContentfulTemplateBuyProcess
  query: queryBuyProcessProps
  quiterIdActive: boolean
}

export const BuyProcess = ({
  data,
  dispatch,
  site,
  template,
  getReCaptchaToken,
  query,
  quiterIdActive
}: BuyProcessContainerProps & GetReCaptchaTokenFn) => {
  const { currentStep, car, subStepAppraisal, subStepFinancing } = data

  useOverrideStepQuery(
    currentStep,
    QueryUrlData,
    query,
    car!,
    quiterIdActive,
    'buy-process'
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentStep, subStepAppraisal, subStepFinancing])

  switch (currentStep) {
    case 1:
      return (
        <ContactData
          site={site}
          data={data}
          dispatch={dispatch}
          getReCaptchaToken={getReCaptchaToken}
          locations={template?.locations}
        />
      )
    case 2:
      return (
        <Appraisal
          site={site}
          data={data}
          dispatch={dispatch}
          getReCaptchaToken={getReCaptchaToken}
        />
      )
    case 3:
      return (
        <Financing
          site={site}
          data={data}
          dispatch={dispatch}
          getReCaptchaToken={getReCaptchaToken}
          financingFeatures={template?.financingFeatures}
        />
      )
    case 4:
      return (
        <AdditionalData
          site={site}
          data={data}
          dispatch={dispatch}
          getReCaptchaToken={getReCaptchaToken}
          locations={template?.locations}
        />
      )
    case 5:
      return (
        <TermsAndConditions
          site={site}
          data={data}
          dispatch={dispatch}
          getReCaptchaToken={getReCaptchaToken}
          locations={template?.locations}
          {...template?.terms}
        />
      )
    case 6:
      return <Summary data={data} site={site} />
    default:
      throw new Error('An unexpected error has ocurred')
  }
}
