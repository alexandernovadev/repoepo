import { useState, useEffect } from 'react'
import { technicalServiceSelector } from '../../../../../redux/features/technicalServiceSlice'
import { useAppSelector } from '../../../../../redux/hooks'
import { SitesNames } from '../../../../../types'
import { fetchSlotAssessors, formatSlots } from '../api'
import {
  AppointmentBrand,
  SlotResponse,
  ValidateDate,
  SlotsType,
  SlotType
} from '../types'
import {
  availableAssessorsToDate,
  compareDates,
  compareTimes,
  findAppointmentBrand
} from '../utils'

const useValidateDate = (site: SitesNames) => {
  const { serviceData, appointmentBrands, formVehicleData } = useAppSelector(
    technicalServiceSelector
  )
  const { brand } = formVehicleData
  const { branchOffice, assessor, date, time } = serviceData

  const [validateDate, setValidateDate] = useState<ValidateDate>({
    date: true,
    time: true,
    assessor: true,
    loading: true
  })
  const [currentAppointmentBrand, setCurrentAppointmentBrand] =
    useState<AppointmentBrand>()
  const [slotResponse, setSlotResponse] = useState<Array<SlotResponse>>()
  const [slots, setSlots] = useState<SlotsType>()
  const [availablesTimes, setAvailableTimes] = useState<
    Array<Date> | undefined
  >([])

  const getSlotAssesors = async (signal:any, site: SitesNames) => {
    if (branchOffice?.id && currentAppointmentBrand?.brandId) {
      const date = new Date()
      let slotAssessorsFetched = await fetchSlotAssessors(
        signal,
        branchOffice?.id,
        date.toLocaleDateString('en-CA'),
        currentAppointmentBrand.brandId,
        site
      )

      if (slotAssessorsFetched.length > 0) {
        setSlotResponse(() => slotAssessorsFetched)
        const slotsFormated: SlotsType = formatSlots(slotAssessorsFetched)
        setSlots(slotsFormated)
      }
    }
    setValidateDate((state: ValidateDate) => {
      return {
        ...state,
        loading: false
      }
    })
  }

  useEffect(() => {
    if (assessor && slotResponse && slotResponse.length > 0 && date) {
      const availableAssessors = availableAssessorsToDate(
        date,
        time,
        slotResponse
      )
      const availableAssessor = availableAssessors?.find(
        (assessorId: string) => assessorId === assessor?.id
      )

      if (!availableAssessor) {
        setValidateDate((state: ValidateDate) => {
          return {
            ...state,
            assessor: false
          }
        })
      }
    }
  }, [slotResponse, time])

  useEffect(() => {
    if (time && availablesTimes && availablesTimes.length > 0) {
      const foundedTime = availablesTimes?.find((availableTime: Date) => {
        return compareTimes(new Date(availableTime), time)
      })

      if (!foundedTime) {
        setValidateDate((state: ValidateDate) => {
          return {
            ...state,
            time: false
          }
        })
      }
    }
  }, [availablesTimes])

  useEffect(() => {
    if (date && compareDates(new Date(), date)) {
      setValidateDate((state: ValidateDate) => {
        return {
          ...state,
          date: false
        }
      })
    }

    setAvailableTimes(
      slots?.times?.find((item: SlotType) => {
        if (!date) {
          return true
        } else if (compareDates(item?.date, date)) {
          return true
        }
        return false
      })?.slots
    )
  }, [slots, date])

  useEffect(() => {
    if (appointmentBrands.length > 0) {
      setCurrentAppointmentBrand(() =>
        findAppointmentBrand(appointmentBrands, brand)
      )
    }
  }, [appointmentBrands])

  useEffect(() => {
        const abortController = new AbortController()

    if (branchOffice) {
      getSlotAssesors(abortController.signal, site)
    }
  }, [currentAppointmentBrand])

  return {
    validateDate
  }
}
export default useValidateDate
