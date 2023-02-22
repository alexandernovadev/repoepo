import { BuyProcessProps, GetReCaptchaTokenFn } from '../../types'
import { Confirmation } from './Confirmation'
import { FormProcess } from './FormProcess'
import { Selection } from './Selection'

export const Appraisal = ({
  data,
  dispatch,
  site,
  getReCaptchaToken
}: BuyProcessProps & GetReCaptchaTokenFn) => {
  const { subStepAppraisal } = data

  switch (subStepAppraisal) {
    case 0:
      return <Selection site={site} data={data} dispatch={dispatch} />
    case 1:
      return <FormProcess site={site} data={data} dispatch={dispatch} />
    case 2:
      return (
        <Confirmation
          site={site}
          data={data}
          dispatch={dispatch}
          getReCaptchaToken={getReCaptchaToken}
        />
      )
    default:
      throw new Error('An unexpected error ocurred')
  }
}
