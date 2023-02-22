import { SitesNames } from '../../types'
import { fetchWithoutToken } from '../../utils/fetch'
import { formatRut } from '../../utils/formatRut'
import { toSlug } from '../../utils/toSlug'
import {
  CustomerServiceRequestBody,
  CustomerServiceRequestResponse,
  CustomerServiceState,
  SubmitServiceRequestFn
} from './types'

const CUSTOMER_SERVICE_ENDPOINT = 'customer/api/client-service/send-email'

const prepareServiceRequestData = (
  {
    requestType,
    serviceType,
    contactReason,
    fullName,
    rut,
    email,
    phone,
    patent,
    city,
    comment
  }: CustomerServiceState,
  site: SitesNames
): CustomerServiceRequestBody => ({
  requestType: toSlug(requestType),
  serviceType: toSlug(serviceType),
  contactReason: toSlug(contactReason),
  fullName: fullName.trim(),
  [site === SitesNames.WIGO_MOTORS ? 'dni' : 'rut']:
    site === SitesNames.WIGO_MOTORS ? rut : formatRut(rut),
  email,
  patent: patent !== '' ? patent : null,
  contactNumber: phone.replace(/^\+56/, ''),
  city: city.trim(),
  comment: comment.trim()
})

export const submitServiceRequest: SubmitServiceRequestFn = async (
  state,
  site
) => {
  const data = prepareServiceRequestData(state, site)

  const response: CustomerServiceRequestResponse = await fetchWithoutToken(
    CUSTOMER_SERVICE_ENDPOINT,
    site,
    data,
    'POST'
  )

  if (response.error) throw new Error(response.error)
  else if (!response.sendEmail) throw new Error('Email not sent')
}
