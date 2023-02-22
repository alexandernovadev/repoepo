import { formatDate, formatTime } from './api'
import { AppointmentBrand, FreeSlotResponse, SlotResponse } from './types'

export const breakpoints = {
  desktop: {
    width: '601px',
    height: '554px'
  },
  tablet: {
    width: '704px',
    height: '693px'
  },
  mobile: {
    width: '333px',
    height: '249px'
  }
}

export const findAppointmentBrand = (
  appointmentBrands: Array<AppointmentBrand>,
  brand: string
): AppointmentBrand | undefined => {
  const foundedAppointmentBrand = appointmentBrands.find(
    (appointmentBrand: AppointmentBrand) =>
      appointmentBrand.value?.toUpperCase() === brand.toUpperCase()
  )

  return foundedAppointmentBrand
}

export const compareDates = (firstDate: Date, secondDate: Date): boolean => {
  const parsedFirstDate = new Date(firstDate)
  const parsedSecondDate = new Date(secondDate)
  if (
    parsedFirstDate.getDate() === parsedSecondDate.getDate() &&
    parsedFirstDate.getMonth() === parsedSecondDate.getMonth()
  ) {
    return true
  }

  return false
}

export const compareTimes = (firstTime: Date, secondTime: Date): boolean => {
  const parsedFirstTime = new Date(firstTime)
  const parsedSecondTime = new Date(secondTime)

  if (
    parsedFirstTime.getHours() === parsedSecondTime.getHours() &&
    parsedFirstTime.getMinutes() === parsedSecondTime.getMinutes()
  ) {
    return true
  }
  return false
}

export const availableAssessorsToDate = (
  date: Date,
  time: Date,
  slots?: Array<SlotResponse>
): Array<string> | undefined => {
  const slotFounded: SlotResponse | undefined = slots?.find(
    (slot: SlotResponse) => {
      if (slot.date) {
        const formatedDate = formatDate(new Date(slot.date))
        return compareDates(date, formatedDate)
      }
      return false
    }
  )

  let foundedDate: Date

  if (slotFounded?.date) {
    foundedDate = new Date(slotFounded.date)
  }

  const assessorIdFounded: FreeSlotResponse | undefined =
    slotFounded?.freeSlots?.find((slot: FreeSlotResponse) => {
      const formatedTime = formatTime(slot.startTime, foundedDate)

      return compareTimes(new Date(formatedTime), time)
    })

  return assessorIdFounded?.assessorsId
}

export const showMileageInput = (service?: string): boolean => {
  if (service) {
    return service.toString() === '1' || service.toString() === '2'
  }

  return false
}

export const onSubmitWithMax = (
  value: string,
  handler: () => void,
  maxLength?: number
) => {
  if ((maxLength && value.length <= maxLength) || !maxLength) handler()
}
