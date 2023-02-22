import { BuyProcessProps, GetReCaptchaTokenFn } from '../../types'
import { Selection } from './Selection'
import { Simulation } from './Simulation'

export const Financing = ({
  data,
  dispatch,
  financingFeatures = {},
  site,
  getReCaptchaToken
}: BuyProcessProps & GetReCaptchaTokenFn) => {
  const { subStepFinancing } = data

  switch (subStepFinancing) {
    case 0:
      return (
        <Selection
          site={site}
          data={data}
          dispatch={dispatch}
          financingFeatures={financingFeatures}
        />
      )
    case 1:
      return (
        <Simulation
          site={site}
          data={data}
          dispatch={dispatch}
          getReCaptchaToken={getReCaptchaToken}
          {...financingFeatures}
        />
      )
    default:
      throw new Error('An unexpected error ocurred')
  }
}
