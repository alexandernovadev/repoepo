import { Sites } from '../../../../types'
import { Car } from '../../../../types/contentful/car'

export interface MlModalProps extends Sites {
  idSelectedVersion: string
  title: string
  isModalOpen: boolean
  toggleModal: () => void
  className?: string
  car: Car
  carInfo: {
    label: string
    value: string | undefined
  }[]
}

export interface QuotationData {
  name: string
  lastname: string
  rut: string
  email: string
  phoneNumber: string
  message: string
  branchOfficeId: string
  partPayment: boolean
  financing: boolean
}

export enum AtInputVariant {
  DEFAULT = 'default',
  WITH_ICON = 'withIcon',
  TELEPHONE = 'telephone',
  EMAIL = 'email'
}

export enum AtCheckboxVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary'
}
