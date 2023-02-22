/* PreAprobation Methods */

import { BuyProcessV2State } from '../../../../../redux/features/buyProcessV2Slice'
import { SitesNames } from '../../../../../types'
import { fetchWithoutToken } from '../../../../../utils/fetch'
import { isObjectEmpty } from '../../../../../utils/isObjectEmpty'
import { Chile } from '../../../../../utils/regions/chile'
import { ChileLocation, Location } from '../../../../../utils/regions/types'
import { optionIdSearch } from '../../../../tm-buy-process/buy-process/AdditionalData/preApprovalOptions'
import { PreApprovalMapFn, PreApprovalResponse } from './types'

// TODO: Not ready for Wigo
const mapPreApprovalData: PreApprovalMapFn = (
  {
    car,
    initialPaymentPercentage,
    financingSimulation,
    contact,
    occupationalData,
    personalData
  },
  locations
) => {
  const chile = new Chile(locations as ChileLocation)
  const { region, commune, rut, email, phone } = contact.fields
  const { income, incomeType, studies, activity, contractType, realState } =
    occupationalData.fields
  const { address, addressNumber } = personalData.fields

  return {
    carId: parseInt(car?.id! ?? '0'),
    purchaseType: /inteligente/i.test(financingSimulation?.purchaseType ?? '')
      ? 1
      : 2,
    initialPayment: initialPaymentPercentage!,
    dues: parseInt((financingSimulation?.dues as unknown as string) ?? '0'),
    clientRut: rut as string,
    clientMail: email as string,
    clientPhone: parseInt((phone as string).replace(/^\+56/, ''), 10),
    region:
      (region as string).length > 20
        ? (region! as string).slice(0, 20)
        : (region! as string),
    regionId: chile.findRegionId(region as string) ?? 0,
    commune:
      (commune as string).length > 20
        ? (commune! as string).slice(0, 20)
        : (commune! as string),
    address:
      (address as string).length > 20
        ? (address! as string).slice(0, 20)
        : (address! as string),
    addressNumber: parseInt(addressNumber as string, 10),
    salary: parseInt(income as string),
    educationType: optionIdSearch(0, studies as string) ?? 0,
    activityType: optionIdSearch(1, activity as string) ?? 0,
    remunerationType: optionIdSearch(3, incomeType as string) ?? 0,
    contractType: optionIdSearch(4, contractType as string) ?? 0,
    realEstateType: optionIdSearch(5, realState as string)
  }
}

export const PRE_APPROVAL_ENDPOINT = 'customer/api/financial/pre-approbation'

/**
 * @returns if financing is pre approved
 */
export const getPreApprovalResponse = async (
  state: BuyProcessV2State,
  site: SitesNames,
  locations: Location
) => {
  if (
    !state.needsFinancing ||
    isObjectEmpty(state.contact.fields) ||
    isObjectEmpty(state.occupationalData.fields) ||
    site === SitesNames.WIGO_MOTORS // TODO: Check once financing is enabled
  )
    return false

  const data = mapPreApprovalData(state, locations)

  const response: PreApprovalResponse = await fetchWithoutToken(
    PRE_APPROVAL_ENDPOINT,
    site,
    data,
    'POST'
  )

  if (response.errorMessage && response.errorMessage !== '')
    throw new Error(response.errorMessage)

  // credinissan validation
  if (/^OK$/i.test(response.data.description ?? '')) return true

  return /^aprobado$/i.test(response.data.status ?? '')
}
