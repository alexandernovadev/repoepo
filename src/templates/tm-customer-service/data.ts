import { CustomerServiceState } from './types'

export const customerServicePath = (label: string) => [
  {
    label: 'Home',
    url: '/'
  },
  {
    label,
    url: '#'
  }
]

export const initialFormState: CustomerServiceState = {
  requestType: '',
  serviceType: '',
  contactReason: '',
  fullName: '',
  email: '',
  rut: '',
  phone: '',
  patent: '',
  city: '',
  comment: '',
  errors: {
    requestType: true,
    serviceType: true,
    contactReason: true,
    fullName: true,
    email: true,
    rut: true,
    phone: true,
    patent: false,
    city: true,
    comment: true
  },
  currentStep: 1
}
