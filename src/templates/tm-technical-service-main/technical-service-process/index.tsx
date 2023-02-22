import { Vehicle } from './Vehicle'
import { Service } from './Service/index'
import { PersonalData } from './PersonalData'
import { TechnicalServiceProccessProps } from '../types'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { Confirmation } from './Confirmation'
import { useEffect } from 'react'
import {
  formatProcess,
  setAppointmentBrands,
  setTemplate,
  technicalServiceSelector
} from '../../../redux/features/technicalServiceSlice'
import { fetchAppointmentsBrands } from '../technical-service-process/Service/api'
import { QueryUrlData } from '../data'
import useOverrideStepQuery from '../../../hooks/useOverrideStepQuery'

export const TechnicalServiceProcess = ({
  data,
  site,
  template,
  slug
}: TechnicalServiceProccessProps) => {
  const dispatch = useAppDispatch()
  const { currentStep } = data
  const { finishProcess } = useAppSelector(technicalServiceSelector)

  const getAppointmentsBrands = async () => {
    try {
      const brands = await fetchAppointmentsBrands(site)
      if (brands.length > 0) {
        dispatch(setAppointmentBrands(brands))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useOverrideStepQuery(currentStep, QueryUrlData, { id: slug })

  useEffect(() => {
    dispatch(setTemplate(template))
    getAppointmentsBrands()

    if (finishProcess) {
      dispatch(formatProcess())
    }
  }, [])

  switch (currentStep) {
    case 1:
      return <Vehicle />
    case 2:
      return <Service site={site} template={template} />
    case 3:
      return <PersonalData site={site} />
    case 4:
      return <Confirmation site={site} />
    default:
      throw new Error('An unexpected error has ocurred')
  }
}
