import {
  AtButton,
  MlHeading,
  OrForm,
  OrFormVariant
} from '@gac/core-components'
import { useEffect, useMemo, useState, useRef } from 'react'
import {
  previous,
  setFetchWithErrors,
  technicalServiceSelector,
  updatePersonalData
} from '../../../../redux/features/technicalServiceSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { AtButtonVariant, BackgroundContainerColor } from '../../../../types'
import { fetchWithoutToken } from '../../../../utils/fetch'
import { initFormValues } from '../../../../utils/initFormValues'
import { isObjectEmpty } from '../../../../utils/isObjectEmpty'
import { isValidChileanPhone } from '../../../../utils/isValidChileanPhone'
import { isValidEmail } from '../../../../utils/isValidEmail'
import { contactForm } from './data'
import { ENDPOINT_CLIENT_DATA, parseApiPhoneNumber } from './api'
import { PersonalDataClasses } from './classes'
import { PersonalDataProps } from './types'
import { useReCaptcha } from '../../../../hooks/useRecaptcha'
import { toReCaptchaHeader } from '../../../../utils/toReCaptchaHeader'
import { useRouter } from 'next/router'
import { formatDate, formatToSentDate } from '../../../../utils/formatDate'
import { commonSelector } from '../../../../redux/features/commonSlice'
import { useSelector } from 'react-redux'
import { mapCardImg } from '../../data'
import useValidateDate from '../Service/hooks/useValidateDate'
import { getHeadingSiteClasses } from '../Vehicle/classes'
import { getBackButtonSiteVariants } from '../Service/classes'
import { invalidStatusCode } from '../Service/api'
import { getClientParam } from './utils'
import { getSearchRutQuery } from '../Vehicle/utils'
import { getCompanyRequestHeader } from '../../../../utils/sites'

export const PersonalData = ({ site }: PersonalDataProps) => {
  const router = useRouter()
  const shouldCancelRef = useRef(false)
  const {
    formVehicleData,
    serviceData,
    personalData,
    currentRut,
    fetchWithErrors
  } = useAppSelector(technicalServiceSelector)
  const { ReCaptcha, getReCaptchaToken } = useReCaptcha(site, true)
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const [loadingAppointment, setLoadingAppointment] = useState<boolean>(false)
  const { logo, brands } = useSelector(commonSelector)
  const cardImg = mapCardImg(logo, brands, formVehicleData)

  const buildInitialFormData = (
    form: Record<string, string | boolean | Date>
  ) => (isObjectEmpty(form) ? contactForm : initFormValues(contactForm, form))

  const [initialFormData, setInitialFormData] = useState(() => {
    const newFormData = buildInitialFormData(personalData.form)

    if (personalData.fetched) {
      return newFormData
    }

    return {
      ...newFormData,
      fields: newFormData.fields.map((field) => ({ ...field, loading: true }))
    }
  })

  const formKey = useMemo(
    () => JSON.stringify(initialFormData),
    [initialFormData]
  )

  const { validateDate } = useValidateDate(site)

  const headingClasses = useMemo(() => {
    return getHeadingSiteClasses(site)
  }, [site])

  const backButtonVariants = useMemo(() => {
    return getBackButtonSiteVariants(site)
  }, [site])

  useEffect(() => {
    if (!validateDate.assessor || !validateDate.date || !validateDate.time) {
      dispatch(previous())
    }
  }, [validateDate])

  useEffect(() => {
    /** Fetch the personal data if it hasn't been fetched yet */
    const fetchPersonalData = async () => {
      if (personalData.fetched) {
        setLoading(false)

        return
      }

      setLoading(true)

      try {
        shouldCancelRef.current = false

        const response = await fetchWithoutToken(
          `${ENDPOINT_CLIENT_DATA}${getSearchRutQuery(site)}${currentRut}`,
          site
        )

        if (response.result && !shouldCancelRef.current) {
          const form = {
            name: response.result.name,
            phone: parseApiPhoneNumber(response?.result?.phoneNumber) ?? '',
            email: response.result.email
          }

          setInitialFormData(buildInitialFormData(form))
          dispatch(
            updatePersonalData({
              form,
              error:
                !form.name ||
                !isValidChileanPhone(form.phone) ||
                !isValidEmail(form.email),
              fetched: true
            })
          )

          setLoading(false)
        }
      } catch (error) {
        console.log(error)
        if (shouldCancelRef.current) {
          return
        }

        setLoading(false)
      }
    }

    fetchPersonalData()

    return () => {
      shouldCancelRef.current = true
    }
  }, [])

  const sentAppointmentData = async () => {
    setLoadingAppointment(true)

    try {
      const token = await getReCaptchaToken()
      const response = await fetchWithoutToken(
        'customer/api/appointment',
        site,
        {
          workshopId: serviceData.assessor?.workshopId.toString(),
          comments: [
            serviceData.comment,
            formVehicleData.brand,
            formVehicleData.model,
            serviceData.service?.value
          ]
            .filter((field?: string): field is string => Boolean(field))
            .join(', '),
          vehiclePlate: formVehicleData.patent,
          mileage: serviceData.mileage
            ? parseInt(serviceData?.mileage as string)
            : 0,
          contactName: personalData.form.name,
          contactPhone: personalData.form.phone,
          contactMail: personalData.form.email,
          serviceId: +serviceData.service!.id,
          plannedData: {
            receptionistId: serviceData.assessor?.id,
            plannedDate: formatToSentDate(
              formatDate(new Date(serviceData.date))
            ),
            plannedTime: new Date(serviceData.time)?.toLocaleTimeString('it-IT')
          },
          carBrand: formVehicleData.brand,
          carModel: formVehicleData.model,
          carYear: +formVehicleData.year,
          brandLogoUrl: cardImg.imageUrl,
          ...getClientParam(site, currentRut)
        },
        'POST',
        toReCaptchaHeader(token)
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
      } else {
        router.push('/technical-service-success?step=success')
      }
    } catch (error) {
      router.push('/create-date-error')
    }
    setLoadingAppointment(false)
  }

  return (
    <>
      <MlHeading
        title='Ingresa tus datos personales'
        description='o confírmalos si ya estás registrado'
        backgroundColor={BackgroundContainerColor.LIGHT}
        titleClassName={headingClasses.title}
        descriptionClassName={headingClasses.description}
        site={site}
      />
      <div className={PersonalDataClasses.container}>
        <div className={PersonalDataClasses.card}>
          <OrForm
            {...initialFormData}
            companyId={getCompanyRequestHeader(site).companyId.toString()}
            key={formKey}
            submit={(fields, error) => {
              dispatch(
                updatePersonalData({
                  form: fields,
                  error: error ?? false,
                  fetched: true
                })
              )
            }}
            variant={OrFormVariant.PLAIN}
            site={site}
          />
          <div className='flex gap-4 justify-center'>
            <AtButton
              label='Volver'
              variant={backButtonVariants.variant}
              className='py-2 px-6'
              onClick={() => dispatch(previous())}
              site={site}
            />
            <AtButton
              label='Continuar'
              variant={
                loadingAppointment || validateDate.loading
                  ? AtButtonVariant.LOADING
                  : AtButtonVariant.PRIMARY
              }
              className='py-2 px-6'
              type='submit'
              onClick={() => sentAppointmentData()}
              disabled={loading || personalData.error || validateDate?.loading}
              site={site}
            />
          </div>
        </div>
      </div>
      <ReCaptcha />
    </>
  )
}
