import { fetchWithoutToken } from '../../../utils/fetch'
import { SitesNames } from '../../../types'
import { formsProps } from '../context/types'

const COMPLAINTS_BOOK_ENDPOINT = 'customer/api/client-service/claims-book'

export const OnSubmitComplaintsBook = async (
  site: SitesNames,
  forms: formsProps
) => {
  const formData = {
    documentType: forms.personal.typeDocument === 'DNI' ? 1 : 2,
    documentNumber: forms.personal.id.value,
    name: forms.personal.name,
    address: forms.personal.address,
    phoneNumber: forms.personal.phone.value,
    email: forms.personal.email.value,
    productType: forms.contractedGoods.type === 'producto' ? 1 : 2,
    branchOffice: forms.contractedGoods.branchOffice,
    claimAmount: forms.contractedGoods.price,
    productDescription: forms.contractedGoods.description,
    claimType: forms.complaints.type === 'reclamo' ? 1 : 2,
    claimDescription: forms.complaints.description,
    claimRequest: forms.complaints.complaintsOrder
  }

  try {
    const response = await fetchWithoutToken(
      COMPLAINTS_BOOK_ENDPOINT,
      site,
      formData,
      'POST',
      {}
    )

    if (response.error) throw new Error(response.error)
    else if (!response.sendEmail) throw new Error('Email not sent')
    return response.sendEmail
  } catch (error) {
    console.log(error)
    return false
  }
}
