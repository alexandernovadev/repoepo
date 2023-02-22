import { Sites, SitesNames } from '../../types'
import { ContentfulTmCustomerService } from '../../types/contentful/content-model/tm-customer-service'

export type SubmitServiceRequestFn = (
  state: CustomerServiceState,
  site: SitesNames
) => Promise<void>

export interface CustomerServiceRequestBody {
  requestType: string
  serviceType: string
  contactReason: string
  fullName: string
  email: string
  patent: string | null
  contactNumber: string
  city: string
  comment: string
}

export interface CustomerServiceRequestResponse {
  /** ID on successful response */
  messageId?: string
  /** 'ok' on successful response */
  status?: string
  error?: string
  /** Comes with error */
  message?: string[]
  /** Comes with error */
  statusCode?: number
  /** Whether or not email is sent */
  sendEmail?: boolean
}

export interface TmCustomerServiceProps extends Sites {
  template: ContentfulTmCustomerService
}

export interface CustomerServiceFormProps
  extends Sites,
    Pick<
      ContentfulTmCustomerService,
      'requestTypes' | 'serviceTypes' | 'contactReasons' | 'cities'
    > {
  state: CustomerServiceState
  fieldHandler: (update: Partial<CustomerServiceState>) => void
  submit: SubmitServiceRequestFn
}

export interface CustomerServiceState {
  requestType: string
  serviceType: string
  contactReason: string
  fullName: string
  email: string
  phone: string
  patent: string
  city: string
  comment: string
  rut: string
  /** Errors with key based on property name, based on required fields, except patent which is optional */
  errors: Record<
    | 'requestType'
    | 'serviceType'
    | 'contactReason'
    | 'fullName'
    | 'rut'
    | 'email'
    | 'phone'
    | 'city'
    | 'comment'
    | 'patent',
    boolean
  >
  currentStep: number
}

export interface ConfirmationProps {
  site: SitesNames,
  state: {
    email: string
  },
  button?: {
    label: string,
    show: boolean,
    onClick: () => void,
    variant: string
  }

}

export type SectionProps = Sites &
  Pick<ContentfulTmCustomerService, 'sectionTitle' | 'sections'>
