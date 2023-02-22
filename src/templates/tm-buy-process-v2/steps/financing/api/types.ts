import { BuyProcessV2State } from '../../../../../redux/features/buyProcessV2Slice'
import { Location } from '../../../../../utils/regions/types'

/* Aprovation Responses */
export type PreApprovalMapFn = (
  state: BuyProcessV2State,
  locations: Location
) => PreApprovalRequestBody

export interface PreApprovalRequestBody {
  carId: number
  purchaseType: number
  initialPayment: number
  dues: number
  clientRut: string
  clientMail: string
  clientPhone: number
  regionId: number
  region: string
  commune: string
  address: string
  addressNumber: number
  salary: number
  educationType: number
  remunerationType: number
  contractType: number
  realEstateType?: number
  activityType: number
}

export interface PreApprovalResponse {
  requiredDate: string
  errorMessage: string
  data: {
    financial: string
    message: string
    description: string
    /** "Aprobado" if response is successful */
    status: string
  }
}
