import { SitesNames } from '../../types'
import { fetchWithoutToken } from '../../utils/fetch'
import { toReCaptchaHeader } from '../../utils/toReCaptchaHeader'
import {
  mapAppraisal,
  mapBaseUser,
  mapFinancing
} from './buy-process/TermsAndConditions/submit'

export const INCOMPLETE_BUYING_LEAD = 'customer/api/lead/incomplete-buying-flow'

export const session = async (
  state: any,
  site: SitesNames,
  token: string,
  v2 = false
) => {
  const { userId, currentStep } = state
  const body = {
    userId,
    step: currentStep,
    version: v2 ? 'V2' : 'V1',
    isCompleted: currentStep === 5,
    data: {
      ...mapBaseUser(state),
      ...mapAppraisal(state),
      ...mapFinancing(state)
    }
  }

  await fetchWithoutToken(
    INCOMPLETE_BUYING_LEAD,
    site,
    body,
    'POST',
    toReCaptchaHeader(token)
  )
}
