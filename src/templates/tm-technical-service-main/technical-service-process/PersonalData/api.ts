export const ENDPOINT_CLIENT_DATA = 'customer/api/gac-soap/client-data?'

export const parseApiPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) {
    return ''
  }
  if (phoneNumber.includes('|')) {
    const firstPhoneNumber = phoneNumber.split('|')[0]
    return normalizeApiPhoneNumber(firstPhoneNumber)
  }

  return normalizeApiPhoneNumber(phoneNumber)
}

const normalizeApiPhoneNumber = (phoneNumber: string): string => {
  let normalizedPhoneNumber = phoneNumber

  if (phoneNumber.startsWith('+56')) {
    normalizedPhoneNumber = phoneNumber.replace(/^\+56/, '')
  } else if (phoneNumber.length > 9 && phoneNumber.startsWith('56')) {
    normalizedPhoneNumber = phoneNumber.substring(2)
  }

  return normalizedPhoneNumber
}
