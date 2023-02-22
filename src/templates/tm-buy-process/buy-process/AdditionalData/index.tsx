import { BuyProcessProps, GetReCaptchaTokenFn, Locations } from '../../types'
import { AdditionalDataForm } from './AdditionalDataForm'

export const AdditionalData = ({
  data,
  dispatch,
  site,
  locations,
  getReCaptchaToken
}: BuyProcessProps & Locations & GetReCaptchaTokenFn) => {
  return (
    <AdditionalDataForm
      site={site}
      data={data}
      dispatch={dispatch}
      needsFinancing={data.needsFinancing!}
      locations={locations}
      getReCaptchaToken={getReCaptchaToken}
    />
  )
}
