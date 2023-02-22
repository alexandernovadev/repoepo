import { Dispatch } from 'redux'
import { BuyProcessStateProps } from '../../redux/features/buyProcessSlice'
import {
  ContentfulOrFinancingFeatures,
  ContentfulTemplateBuyProcess,
  GlobalInformation,
  Sites
} from '../../types'
import { Car } from '../../types/contentful/car'
import { Location } from '../../utils/regions/types'

export interface BuyProcessProps extends Sites {
  data: BuyProcessStateProps
  dispatch: Dispatch
  needsFinancing?: boolean
  financingFeatures?: ContentfulOrFinancingFeatures
  locations?: Location
}

export type GetReCaptchaTokenFn = {
  getReCaptchaToken: () => Promise<string>
}

export type Locations = Pick<ContentfulTemplateBuyProcess, 'locations'>

export interface TmBuyProcessProps extends Sites {
  template: ContentfulTemplateBuyProcess
  car: Car
  global?: GlobalInformation
  hostName?: string
}

export type PreApprovalMapFn = (
  state: BuyProcessStateProps,
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
  branchOfficeId?: number
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
