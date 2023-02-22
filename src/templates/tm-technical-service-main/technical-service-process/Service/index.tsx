import {
  MlCardSelectedCar,
  MlCardFeature,
  AtInputDropdown,
  AtButton,
  AtButtonVariant,
  MlDatepicker,
  MlCardSelectedCardVariants,
  AtIcon,
  AtTextArea,
  AtInput
} from '@gac/core-components'
import { useEffect, useMemo, useState } from 'react'
import { toCapitalize } from '../../../../utils/toCapitalize'
import { inputSelectOptionsClasses } from '../../../tm-buy-process/classes'
import {
  fetchServices,
  fetchAssesors,
  formatAssessors,
  formatSlots,
  fetchSlotAssessors,
  fetchCities,
  formatCities,
  fetchBranchOffices,
  formatBranchOffices,
  formatCoordinates,
  invalidStatusCode
} from './api'
import { getBackButtonSiteVariants, ServiceClasses } from './classes'
import {
  next,
  previous,
  technicalServiceSelector,
  setServiceData,
  setFetchWithErrors
} from '../../../../redux/features/technicalServiceSlice'
import { useDispatch, useSelector } from 'react-redux'
import { Map } from '../../../../components/Map/index'
import {
  AppointmentBrand,
  AssessorType,
  BranchOffice,
  ServiceProps,
  ServiceState,
  ServiceType,
  SlotsType,
  SlotType,
  SlotResponse,
  ValidateDate
} from './types'
import {
  availableAssessorsToDate,
  breakpoints,
  compareDates,
  compareTimes,
  findAppointmentBrand,
  onSubmitWithMax,
  showMileageInput
} from './utils'
import { mapCardImg, mapServiceCardData } from '../../data'
import { commonSelector } from '../../../../redux/features/commonSlice'
import { AlertError } from './AlertError/index'
import { useRouter } from 'next/router'
import { AtInputVariant } from '../../../tm-pdp/common/form-quote/types'

const numberFormat = new Intl.NumberFormat('es-CL')

export const Service = ({ site, template }: ServiceProps) => {
  const { serviceData, formVehicleData, appointmentBrands, fetchWithErrors } =
    useSelector(technicalServiceSelector)
  const { logo, brands } = useSelector(commonSelector)

  const car = mapServiceCardData(formVehicleData, site)

  const cardImg = mapCardImg(logo, brands, formVehicleData)
  const [services, setServices] = useState<Array<ServiceType>>([])
  const [assessors, setAssessors] = useState<Array<AssessorType>>([])
  const [assessorsToShow, setAssessorsToShow] = useState<Array<string>>([])
  const [cities, setCities] = useState<Array<string>>([])
  const [slots, setSlots] = useState<SlotsType>()
  const [availablesTimes, setAvailableTimes] = useState<
    Array<Date> | undefined
  >([])
  const [branchOfficesToShow, setBranchOfficeToShow] = useState<Array<string>>(
    []
  )
  const [branchOffices, setBranchOffice] = useState<Array<BranchOffice>>([])
  const [validate, setValidate] = useState<boolean>(false)
  const [currentAppointmentBrand, setCurrentAppointmentBrand] =
    useState<AppointmentBrand>()
  const [slotResponse, setSlotResponse] = useState<Array<SlotResponse>>()
  const [brand] = useState<string>(formVehicleData.brand)
  const [map, setMap] = useState(null as google.maps.Map | null)
  const router = useRouter()

  // Loaders
  const [loadingCities, setLoadingCities] = useState<boolean>(false)
  const [loadingBranchOffices, setLoadingBranchOffices] =
    useState<boolean>(false)
  const [loadingAssesors, setLoadingAssesors] = useState<boolean>(false)
  const [loadingDate, setLoadingDate] = useState<boolean>(false)
  const [loadingTime, setLoadingTime] = useState<boolean>(false)
  const [loadingServices, setLoadingServices] = useState<boolean>(false)

  const dispatch = useDispatch()

  const [formValues, setFormValues] = useState<ServiceState>({
    service: serviceData?.service ?? undefined,
    description: serviceData?.description ?? undefined,
    mileage: serviceData?.mileage ?? undefined,
    city: serviceData?.city ?? undefined,
    branchOffice: serviceData?.branchOffice ?? undefined,
    date: serviceData?.date !== null ? new Date(`${serviceData?.date}`) : null,
    time: serviceData?.time !== null ? new Date(`${serviceData?.time}`) : null,
    comment: serviceData?.comment ?? undefined,
    assessor: serviceData?.assessor ?? undefined
  })

  const [validateDate, setValidateDate] = useState<ValidateDate>({
    date: true,
    time: true,
    assessor: true
  })

  const backButtonVariants = useMemo(() => {
    return getBackButtonSiteVariants(site)
  }, [site])

  const handleServiceClick = (service: string) => {
    const serviceFounded = services.find((item) => item.value === service)

    if (serviceFounded?.id !== formValues?.service?.id) {
      setFormValues({
        ...formValues,
        description: serviceFounded?.description,
        service: serviceFounded,
        city: undefined,
        branchOffice: undefined,
        mileage: undefined,
        assessor: undefined,
        date: null,
        time: null,
        comment: undefined
      })

      setCities(() => [])
      setAssessorsToShow(() => [])
      setAssessors(() => [])
      setBranchOfficeToShow(() => [])
      setBranchOffice(() => [])
      setSlots(undefined)
      setAvailableTimes(undefined)
    }
    return ''
  }

  const getSlotAssesors = async (signal: any) => {
    setLoadingDate(true)
    setLoadingTime(true)

    if (formValues.branchOffice?.id && currentAppointmentBrand?.brandId) {
      const date = new Date()
      const assessorId = formValues?.assessor?.id

      let response = await fetchSlotAssessors(
        signal,
        formValues.branchOffice?.id,
        date.toLocaleDateString('en-CA'),
        currentAppointmentBrand.brandId,
        site,
        assessorId
      )
      // Validación para cuando falla el back
      if (invalidStatusCode(response.statusCode)) {
        // Si lleva menos de 2 intentos aumenta el contador de intentos en 1 y redirige al error de creación de cita
        if (fetchWithErrors <= 1) {
          let errors = fetchWithErrors + 1
          dispatch(setFetchWithErrors(errors))
          router.push('/create-date-error')
        } else {
          // Si lleva 2 intentos reinicia el contador de intentos a 0 y redirige al error general para que intente más tarde
          dispatch(setFetchWithErrors(0))
          router.push('404')
        }
      } else if (response.length > 0) {
        setSlotResponse(() => response)

        const slotsFormated: SlotsType = formatSlots(response)

        setSlots(slotsFormated)
      }
    }

    setLoadingDate(false)
    setLoadingTime(false)
  }

  const getServices = async (signal: any) => {
    setLoadingServices(true)
    let response = await fetchServices(signal, formVehicleData.brand, site)

    // Validación para cuando falla el back
    if (invalidStatusCode(response.statusCode)) {
      // Si lleva menos de 2 intentos aumenta el contador de intentos en 1 y redirige al error de creación de cita
      if (fetchWithErrors <= 1) {
        let errors = fetchWithErrors + 1
        dispatch(setFetchWithErrors(errors))
        router.push('/create-date-error')
      } else {
        // Si lleva 2 intentos reinicia el contador de intentos a 0 y redirige al error general para que intente más tarde
        dispatch(setFetchWithErrors(0))
        router.push('404')
      }
    } else if (response.length > 0) {
      setServices(
        response.sort(
          (a: ServiceType, b: ServiceType) =>
            Number.parseInt(a.id, 10) - Number.parseInt(b.id, 10)
        )
      )
    } else {
      setServices(() => [])
    }
    setLoadingServices(false)
  }

  const getAssesors = async (signal: any) => {
    setLoadingAssesors(true)
    if (formValues.branchOffice?.id && currentAppointmentBrand?.brandId) {
      let response = await fetchAssesors(
        signal,
        formValues.branchOffice?.id,
        currentAppointmentBrand.brandId,
        site
      )

      // Validación para cuando falla el back
      if (invalidStatusCode(response.statusCode)) {
        // Si lleva menos de 2 intentos aumenta el contador de intentos en 1 y redirige al error de creación de cita
        if (fetchWithErrors <= 1) {
          let errors = fetchWithErrors + 1
          dispatch(setFetchWithErrors(errors))
          router.push('/create-date-error')
        } else {
          // Si lleva 2 intentos reinicia el contador de intentos a 0 y redirige al error general para que intente más tarde
          dispatch(setFetchWithErrors(0))
          router.push('404')
        }
      } else if (response?.receptionists?.length > 0) {
        setAssessors(() => [...response?.receptionists])
        setAssessorsToShow(() => [...formatAssessors(response)])
      }
    }
    setLoadingAssesors(false)
  }

  const getCities = async (signal: any) => {
    setLoadingCities(true)
    if (formVehicleData?.brand && formValues?.service?.id) {
      let response = await fetchCities(
        signal,
        formVehicleData?.brand,
        formValues?.service?.id,
        site
      )
      // Validación para cuando falla el back
      if (invalidStatusCode(response.statusCode)) {
        // Si lleva menos de 2 intentos aumenta el contador de intentos en 1 y redirige al error de creación de cita
        if (fetchWithErrors <= 1) {
          let errors = fetchWithErrors + 1
          dispatch(setFetchWithErrors(errors))
          router.push('/create-date-error')
        } else {
          // Si lleva 2 intentos reinicia el contador de intentos a 0 y redirige al error general para que intente más tarde
          dispatch(setFetchWithErrors(0))
          router.push('404')
        }
      } else if (response.length > 0) {
        setCities(() => [...formatCities(response)])
      }
    } else {
      setCities(() => [])
    }
    setLoadingCities(false)
  }

  const getBranchOffices = async (signal: any) => {
    setLoadingBranchOffices(true)
    if (
      formValues.city &&
      currentAppointmentBrand?.brandId &&
      formValues.service?.id
    ) {
      let response = await fetchBranchOffices(
        signal,
        formValues.city,
        site,
        currentAppointmentBrand.brandId,
        formValues.service.id
      )
      // Validación para cuando falla el back
      if (invalidStatusCode(response.statusCode)) {
        // Si lleva menos de 2 intentos aumenta el contador de intentos en 1 y redirige al error de creación de cita
        if (fetchWithErrors <= 1) {
          let errors = fetchWithErrors + 1
          dispatch(setFetchWithErrors(errors))
          router.push('/create-date-error')
        } else {
          // Si lleva 2 intentos reinicia el contador de intentos a 0 y redirige al error general para que intente más tarde
          dispatch(setFetchWithErrors(0))
          router.push('404')
        }
      } else if (response.length > 0) {
        setBranchOffice(() => [...response])
        setBranchOfficeToShow(() => [...formatBranchOffices(response)])
      }
    } else {
      setBranchOfficeToShow(() => [])
    }
    setLoadingBranchOffices(false)
  }

  const validateForm = (): boolean => {
    const { service, description, city, date, time, branchOffice } = formValues
    const obligatoryFields =
      service && description && city && date && time && branchOffice

    if (obligatoryFields) {
      return true
    }

    return false
  }

  const handleContinueClick = () => {
    if (formValues.assessor === undefined) {
      if (assessors.length === 1) {
        dispatch(setServiceData({ ...formValues, assessor: assessors[0] }))
      } else if (assessors.length > 1) {
        let randomAssessor: AssessorType | undefined

        const availableAssessors = availableAssessorsToDate(
          formValues.date,
          formValues.time,
          slotResponse
        )

        if (availableAssessors) {
          let randomAssessorIndex = Math.floor(
            Math.random() * availableAssessors.length
          )

          let foundedRandomAssesorByIndex =
            availableAssessors[randomAssessorIndex]

          randomAssessor = assessors.find(
            (assesor: AssessorType) =>
              assesor.id === foundedRandomAssesorByIndex
          )

          if (randomAssessor) {
            dispatch(
              setServiceData({ ...formValues, assessor: randomAssessor })
            )
          }
        }
      }
    }
    dispatch(next())
  }

  const handleChangeCity = (city: string) => {
    if (city !== formValues.city) {
      setFormValues({
        ...formValues,
        city,
        branchOffice: undefined,
        assessor: undefined,
        date: null,
        time: null
      })

      setAssessorsToShow(() => [])
      setAssessors(() => [])
      setBranchOfficeToShow(() => [])
      setBranchOffice(() => [])
      setSlots(undefined)
      setAvailableTimes(undefined)
    }
  }

  const handleChangeBranchOffice = (branchOffice: string) => {
    let branchOfficeFounded = branchOffices.find(
      (item: BranchOffice) =>
        item.fullName + ', ' + item.commune === branchOffice
    )

    if (branchOfficeFounded?.id !== formValues?.branchOffice?.id) {
      setFormValues({
        ...formValues,
        assessor: undefined,
        date: null,
        time: null,
        branchOffice: branchOfficeFounded
      })
      setAssessorsToShow(() => [])
      setAssessors(() => [])
      setSlots(undefined)
      setAvailableTimes(undefined)
    }
  }

  const handleChangeAssessor = (assessor: string) => {
    if (!validateDate.assessor) {
      setValidateDate((state: ValidateDate) => {
        return {
          ...state,
          assessor: true
        }
      })
    }
    let assessorFounded = assessors.find(
      (item: AssessorType) => toCapitalize(item.name) === toCapitalize(assessor)
    )

    if (assessorFounded?.id !== formValues?.assessor?.id) {
      setFormValues({
        ...formValues,
        assessor: assessorFounded || undefined,
        date: null,
        time: null
      })
    }
  }

  const handleChangeDate = (date: Date | null) => {
    if (!validateDate.date) {
      setValidateDate((state: ValidateDate) => {
        return {
          ...state,
          date: true
        }
      })
    }
    setFormValues({ ...formValues, date: date, time: null })
  }

  const handleChangeTime = (time: Date | null) => {
    if (!validateDate.time) {
      setValidateDate((state: ValidateDate) => {
        return {
          ...state,
          time: true
        }
      })
    }

    setFormValues({ ...formValues, time })
  }

  const handleSelectedAssessor = (): string => {
    if (formValues?.assessor?.name) {
      // Si hay una asessor en los valores guardados devolver el nombre de este
      return toCapitalize(formValues?.assessor?.name)
    } else if (assessorsToShow.length === 1) {
      // Si solo hay un asesor devolver el nombre de ese asesor unico
      return assessorsToShow[0]
    }

    return 'Sin Preferencia' // Si hay varios asesores devolver sin preferencia
  }

  useEffect(() => {
    const abortController = new AbortController()
    getServices(abortController.signal)
  }, [])

  useMemo(() => {
    if (appointmentBrands.length > 0) {
      setCurrentAppointmentBrand(() =>
        findAppointmentBrand(appointmentBrands, formVehicleData.brand)
      )
    }
  }, [appointmentBrands])

  useEffect(() => {
    const abortController = new AbortController()
    getCities(abortController.signal)
  }, [formValues.service])

  useEffect(() => {
    const abortController = new AbortController()
    getBranchOffices(abortController.signal)
  }, [formValues.city])

  useEffect(() => {
    const abortController = new AbortController()
    getAssesors(abortController.signal)
    getSlotAssesors(abortController.signal)
  }, [formValues.branchOffice])

  useEffect(() => {
    dispatch(setServiceData({ ...formValues }))
    setValidate(validateForm())
  }, [formValues])

  useEffect(() => {
    if (formValues.date && compareDates(new Date(), formValues.date)) {
      setValidateDate((state: ValidateDate) => {
        return {
          ...state,
          date: false
        }
      })
      setFormValues({ ...formValues, date: null, time: null })
    }

    setAvailableTimes(
      slots?.times?.find((item: SlotType) => {
        if (!formValues.date || compareDates(item?.date, formValues.date)) {
          return true
        }
        return false
      })?.slots
    )
  }, [slots, formValues.date])

  useEffect(() => {
    if (formValues.time && availablesTimes && availablesTimes.length > 0) {
      const foundedTime = availablesTimes?.find((time: Date) => {
        return compareTimes(time, formValues.time)
      })

      if (!foundedTime) {
        setValidateDate((state: ValidateDate) => {
          return {
            ...state,
            time: false
          }
        })
        setFormValues({ ...formValues, time: null })
      }
    }
  }, [availablesTimes])

  useEffect(() => {
    if (
      formValues.assessor &&
      slotResponse &&
      slotResponse.length > 0 &&
      formValues.date
    ) {
      const availableAssessors = availableAssessorsToDate(
        formValues.date,
        formValues.time,
        slotResponse
      )
      const availableAssessor = availableAssessors?.find(
        (assessorId: string) => assessorId === formValues.assessor?.id
      )

      if (!availableAssessor) {
        setValidateDate((state: ValidateDate) => {
          return {
            ...state,
            assessor: false
          }
        })
        setFormValues({
          ...formValues,
          assessor: undefined,
          date: null,
          time: null
        })
      }
    }
  }, [slotResponse, formValues.time])

  useEffect(() => {
    dispatch(setServiceData({ ...formValues, brand }))
  }, [brand])

  useEffect(() => {
    // Esta condición cambia dinamicamente cada que cambie la sucursal lo que se muestra en el map

    if (formValues.branchOffice !== undefined) {
      map?.panTo({
        lat: formValues.branchOffice.latitude,
        lng: formValues.branchOffice.longitude
      })
    }
  }, [formValues.branchOffice?.latitude, formValues.branchOffice?.longitude])

  return (
    <>
      <div className={`${ServiceClasses.container} `}>
        <div className={`${ServiceClasses.cardFeatures}`}>
          <div className={`${ServiceClasses.carCardContainer} `}>
            <MlCardSelectedCar
              {...car}
              {...cardImg}
              site={site}
              variant={MlCardSelectedCardVariants.TECHNICAL_SERVICE}
            />
          </div>

          {services.length !== 0 ? (
            <>
              <p className={`${ServiceClasses.title}`}>
                Selecciona el servicio a Agendar
              </p>
              <div className={`${ServiceClasses.servicesContainer}`}>
                {services &&
                  services?.map((item) => (
                    <MlCardFeature
                      key={item.id}
                      onClick={handleServiceClick}
                      id={item?.value}
                      selected={formValues?.service?.value === item.value}
                      disabled={
                        formValues?.service !== undefined &&
                        formValues?.service?.value !== item.value
                      }
                      iconClassName={`${ServiceClasses.servicesIcon}`}
                      titleClassName={`${ServiceClasses.servicesTitle}`}
                      className={`${ServiceClasses.services}`}
                      title={toCapitalize(item?.value) || ''}
                      site={site}
                      icon={{
                        url: template.serviceIcon.file.url || '',
                        name: 'Service Icon'
                      }}
                    />
                  ))}
              </div>
              {formValues.service !== undefined && (
                <p className={`${ServiceClasses.servicesSectionTitle}`}>
                  {toCapitalize(formValues?.service?.value || '')}
                </p>
              )}
              {formValues.description !== undefined && (
                <p className={`${ServiceClasses.servicesSectionDescription}`}>
                  {formValues.description}
                </p>
              )}
            </>
          ) : loadingServices ? (
            <div className='flex justify-center py-8'>
              <AtIcon type='spinner' />
            </div>
          ) : (
            <div className='flex justify-center mt-8'>
              <AlertError className=''>
                No encontramos ningun servicio para la marca
                <strong>{` ${toCapitalize(
                  formVehicleData.brand || ''
                )}`}</strong>
                .
              </AlertError>
            </div>
          )}
        </div>
        <div className={`${ServiceClasses.card} `}>
          <p className={`${ServiceClasses.cardTitle} `}>
            Selecciona ciudad y sucursal
          </p>
          <AtInputDropdown
            disabled={loadingCities || cities.length === 0}
            loading={loadingCities}
            containerClassname={`${ServiceClasses.input} mb-10 `}
            selectedValueClassname={`${ServiceClasses.dropdownPlacholder}`}
            placeholderClassname={`${ServiceClasses.dropdownPlacholder}`}
            site={site}
            selectedValue={formValues.city}
            handleChange={(city) => handleChangeCity(city)}
            placeholder='Selecciona una ciudad'
            options={cities}
            optionsClassName={inputSelectOptionsClasses}
          />

          <AtInputDropdown
            containerClassname={`${ServiceClasses.input}`}
            selectedValueClassname={`${ServiceClasses.dropdownPlacholder}`}
            placeholderClassname={`${ServiceClasses.dropdownPlacholder}`}
            site={site}
            selectedValue={
              formValues.branchOffice
                ? formValues.branchOffice?.fullName +
                  ', ' +
                  formValues.branchOffice?.commune
                : undefined
            }
            handleChange={(branchOffice) =>
              handleChangeBranchOffice(branchOffice)
            }
            placeholder='Selecciona una sucursal'
            disabled={
              (branchOfficesToShow.length === 0 &&
                serviceData?.branchOffice === undefined) ||
              loadingBranchOffices ||
              cities.length === 0
            }
            error={
              branchOfficesToShow.length === 0 &&
              formValues?.city !== undefined &&
              !loadingBranchOffices
            }
            errorMessage='No hay sucursales disponibles'
            loading={loadingBranchOffices}
            options={branchOfficesToShow}
            optionsClassName={inputSelectOptionsClasses}
          />
          {cities.length === 0 &&
            !loadingCities &&
            serviceData.service !== undefined && (
              <AlertError className='mt-10'>
                No tenemos sucursales que atiendan el servicio “
                <strong>{`${toCapitalize(
                  serviceData?.service?.value || ''
                )}`}</strong>
                “ para la marca “<strong>{`${formVehicleData.brand}`}</strong>
                “.
              </AlertError>
            )}

          {formValues.branchOffice !== undefined && cities.length !== 0 && (
            <div className='mt-10'>
              <Map
                initialZoom={20}
                onMapReady={setMap}
                breakpoints={breakpoints}
                coordinates={formatCoordinates(
                  formValues.branchOffice.latitude,
                  formValues.branchOffice.longitude
                )}
              />
            </div>
          )}
        </div>
        {formValues.service?.id && showMileageInput(formValues.service.id) && (
          <div className={`${ServiceClasses.card} `}>
            <p className={`${ServiceClasses.cardTitle} `}>
              Ingresa el kilometraje de tu auto
            </p>
            <AtInput
              className={`${ServiceClasses.input}`}
              site={site}
              handleChange={({ value }) => {
                const dots = /[.]/g
                const rawValue = value.replace(dots, '')
                if (value === '' || /^[0-9]+$/.test(rawValue)) {
                  onSubmitWithMax(
                    rawValue,
                    () => setFormValues({ ...formValues, mileage: rawValue }),
                    6
                  )
                }
              }}
              selectedValue={
                formValues.mileage && formValues.mileage !== ''
                  ? numberFormat.format(
                      Number.parseInt(formValues.mileage as string, 10)
                    )
                  : ''
              }
              id='mileage'
              placeholder='Ingrese la cantidad de kilometraje de su auto'
              variant={AtInputVariant.DEFAULT}
              error={false}
            />
          </div>
        )}

        <div className={`${ServiceClasses.card}`}>
          <p className={`${ServiceClasses.cardTitle}`}>
            ¿Hay algo que quieras mencionar? (Opcional)
          </p>
          <AtTextArea
            site={site}
            handleChange={(e) => {
              setFormValues({ ...formValues, comment: e.value })
            }}
            containerClassName={`${ServiceClasses.input} min-h-[136px]`}
            className={`${ServiceClasses.input} min-h-[136px]`}
            value={formValues.comment ?? ''}
            disabled={
              formValues.branchOffice === undefined || cities.length === 0
            }
            id='message'
            placeholder='Ingresa un comentario'
          />
        </div>
        <div className={`${ServiceClasses.card}`}>
          <p className={`${ServiceClasses.cardTitle}`}>
            Selecciona un asesor/a (Opcional)
          </p>
          <AtInputDropdown
            containerClassname={`${ServiceClasses.input}`}
            selectedValueClassname={`${ServiceClasses.dropdownPlacholder}`}
            placeholderClassname={`${ServiceClasses.dropdownPlacholder}`}
            site={site}
            selectedValue={handleSelectedAssessor()}
            handleChange={(assessor) => handleChangeAssessor(assessor)}
            placeholder='Selecciona una opción'
            disabled={
              (assessorsToShow.length === 0 &&
                serviceData?.assessor === undefined) ||
              loadingAssesors ||
              cities.length === 0 ||
              assessorsToShow.length === 1
            }
            loading={loadingAssesors}
            options={assessorsToShow}
            optionsClassName={inputSelectOptionsClasses}
            error={
              (assessorsToShow.length === 0 &&
                formValues?.branchOffice !== undefined &&
                !loadingAssesors) ||
              !validateDate.assessor
            }
            errorMessage={
              !validateDate.assessor
                ? 'El asesor seleccionado ya no está disponible para la cita que seleccionaste'
                : 'No hay asesores disponibles'
            }
          />
        </div>
        <div className={`${ServiceClasses.card}`}>
          <p className={`${ServiceClasses.cardTitle} `}>
            Selecciona una fecha y hora de agendamiento
          </p>
          <div className={`${ServiceClasses.input} mb-10`}>
            <MlDatepicker
              includeDates={slots?.dates}
              excludeDates={[new Date()]}
              minDate={new Date()}
              dateFormat='dd/MM/yyyy'
              selected={formValues.date || undefined}
              placeholderText='Fecha'
              showPopperArrow={false}
              disabled={
                slots === undefined ||
                slots?.dates.length === 0 ||
                loadingDate ||
                cities.length === 0
              }
              loading={loadingDate}
              error={
                (slots?.dates.length === 0 &&
                  serviceData?.assessor !== undefined &&
                  !loadingDate) ||
                !validateDate.date
              }
              errorMessage={
                !validateDate.date
                  ? 'Esta fecha ya no está disponible'
                  : 'No hay fechas disponibles'
              }
              site={site}
              onChange={(date) => handleChangeDate(date)}
            />
          </div>

          <div className={`${ServiceClasses.input}`}>
            <MlDatepicker
              locale='pt-BR'
              selected={formValues.time || undefined}
              placeholderText='Hora'
              includeTimes={availablesTimes}
              disabled={
                availablesTimes === undefined ||
                availablesTimes?.length === 0 ||
                loadingTime ||
                cities.length === 0
              }
              error={
                (availablesTimes?.length === 0 &&
                  serviceData?.date !== null &&
                  !loadingTime) ||
                !validateDate.time
              }
              site={site}
              onChange={(time) => {
                handleChangeTime(time)
              }}
              timeCaption='Hora'
              timeIntervals={15}
              showTimeSelect
              showTimeSelectOnly
              showPopperArrow={false}
              dateFormat='HH:mm'
              loading={loadingTime}
              errorMessage={
                !validateDate.time
                  ? 'Esta hora ya no está disponible'
                  : 'No hay horas disponibles'
              }
            />
          </div>
        </div>

        <div className={`${ServiceClasses.buttonsContainer}`}>
          <AtButton
            className=' mr-12'
            site={site}
            label='VOLVER'
            onClick={() => dispatch(previous())}
            variant={backButtonVariants.variant}
          />
          <AtButton
            site={site}
            label='CONTINUAR'
            onClick={() => handleContinueClick()}
            variant={AtButtonVariant.PRIMARY}
            disabled={!validate}
          />
        </div>
      </div>
    </>
  )
}
