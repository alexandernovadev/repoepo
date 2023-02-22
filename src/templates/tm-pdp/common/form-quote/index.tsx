import { FormEvent, useMemo, useState } from 'react'
import { CarsInfo } from './cars-info'
import { useRouter } from 'next/router'
import {
  MlModal,
  AtInput,
  AtInputDropdown,
  AtTextArea,
  AtButton,
  AtCheckbox,
  AtInputPhone,
  AtInputEmail
} from '@gac/core-components'
import { AtCheckboxVariant, AtInputVariant, MlModalProps } from './types'
import { fetchWithoutToken } from '../../../../utils/fetch'
import { AtButtonVariant, SitesNames } from '../../../../types'
import { formatQuoteData } from '../../../../utils/pdp'
import { useDispatch, useSelector } from 'react-redux'
import { commonSelector } from '../../../../redux/features/commonSlice'
import { setData } from '../../../../redux/features/quoteSlice'
import { useReCaptcha } from '../../../../hooks/useRecaptcha'
import { toReCaptchaHeader } from '../../../../utils/toReCaptchaHeader'
import { renderInput } from './renderInput'
import { getClientParam } from './utils'
import { onSubmitWithMax } from '../../../tm-technical-service-main/technical-service-process/Service/utils'
import { WigoFields } from './wigo-fields'
import { getBrandButtonColors } from '../../../../utils/brandButtonColors'

export const FormQuoteModal = ({
  toggleModal,
  isModalOpen,
  title,
  car,
  carInfo,
  idSelectedVersion,
  site
}: MlModalProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const { getReCaptchaToken, ReCaptchaText } = useReCaptcha(site)
  const { carPlaceholderImg, brands } = useSelector(commonSelector)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    rut: false,
    phoneNumber: false,
    email: false,
    dni: false
  })
  const [formState, setFormState] = useState({
    name: '',
    lastname: '',
    rut: '',
    email: '',
    phoneNumber: '',
    message: '',
    branchOfficeId: car.isNew ? '' : car.branchOffice?.id,
    partPayment: false,
    financing: false,
    authorizedDataUsage: false,
    agreedTermsAndConditions: false
  })

  const branches = useMemo(() => {
    if (!car.isNew || !car.branches) {
      return null
    }

    return car.branches.map((item) => item.name + ', ' + item.commune)
  }, [car.id])

  const validateButton = (site: SitesNames) => {
    switch (site) {
      case SitesNames.WIGO_MOTORS:
        return (
          formState.name.length <= 0 ||
          formState.email.length <= 0 ||
          formState.lastname.length <= 0 ||
          formState.phoneNumber.length <= 0 ||
          formState.rut.length <= 0 ||
          !formState.agreedTermsAndConditions ||
          !formState.authorizedDataUsage ||
          !formState.branchOfficeId
        )

      default:
        return (
          formState.name.length <= 0 ||
          formState.email.length <= 0 ||
          formState.lastname.length <= 0 ||
          formState.phoneNumber.length <= 0 ||
          formState.rut.length <= 0 ||
          !formState.branchOfficeId
        )
    }
  }

  const handleFormChange = (e: any) => {
    setFormState({
      ...formState,
      [e.name]: e.value
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const dataLayer = (window as any).dataLayer || []

    let branchId
    let branchName = ''

    if (!car.isNew && car.branchOffice) {
      branchId = parseInt(car.branchOffice.id)
      branchName = car.branchOffice.name
    } else if (branches && branches.length > 0) {
      const branch = car.branches?.find(
        (item) =>
          item.name?.split(',')?.[0] ===
          formState.branchOfficeId?.split(',')?.[0]
      )
      branchId = parseInt(branch?.id as string)
      branchName = branch?.name as string
    }

    // label for the email
    const priceInfo = carInfo.find((items) => items.label.includes('Precio'))

    const reCaptchaToken = await getReCaptchaToken()
    const formData = {
      name: formState.name,
      email: formState.email,
      phoneNumber: formState.phoneNumber,
      message: formState.message,
      lastname: formState.lastname,
      financing: formState.financing,
      partPayment: formState.partPayment,
      id: parseInt(idSelectedVersion),
      priceLabel: priceInfo?.label ?? '',
      branchOfficeId: branchId,
      ...getClientParam(site, formState.rut)
    }

    try {
      const result = await fetchWithoutToken(
        'customer/api/lead/quote',
        site,
        formData,
        'POST',
        toReCaptchaHeader(reCaptchaToken)
      )

      const gtmData = {
        carId: idSelectedVersion,
        quiterId: car.carId,
        error: result.error,
        errorMessage: result.errorMessage,
        data: {
          ...result.data
        }
      }

      if (result?.error || result?.statusCode === 400) {
        router.push('/form-error')
        dataLayer.push({
          event: 'ErrorCotizacion',
          ...gtmData
        })
      } else {
        dataLayer.push({
          event: 'ExitoCotizacion',
          ...gtmData
        })
        const quoteData = formatQuoteData(
          car,
          { ...formState, branchOfficeId: branchName },
          carPlaceholderImg!,
          carInfo
        )
        dispatch(setData(quoteData))
        router.push(`/success-quote?${car.queryParams}`)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      dataLayer.push({
        event: 'ErrorCotizacion',
        carId: idSelectedVersion,
        quiterId: car.carId,
        error: 'Error de servidor / Conexion'
      })
      router.push('/form-error')
    }
  }

  const onDniError = (dniError: boolean) => {
    setErrors({ ...errors, dni: dniError })
  }

  const buttonStyles = getBrandButtonColors(
    brands,
    car.carBrandType.value,
    car.isNew
  )

  return (
    <MlModal
      site={site}
      onCloseClick={toggleModal}
      isOpen={isModalOpen}
      title={title}
      containerClassName='w-[95%] sm:w-[500px] md:w-[608px] h-auto'
      contentClassName='!px-6 w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'
    >
      <CarsInfo info={carInfo} site={site} />
      <form className='overflow-hidden' onSubmit={handleSubmit}>
        <AtInput
          site={site}
          className='mt-4'
          id='name'
          placeholder='Nombres'
          variant={AtInputVariant.DEFAULT}
          disabled={false}
          error={false}
          errorMessage='Por favor, ingresa los datos correctamente'
          selectedValue={formState.name}
          handleChange={(e) => {
            onSubmitWithMax(e.value, () => handleFormChange(e), 80)
          }}
        />
        <AtInput
          site={site}
          className='mt-6'
          id='lastname'
          placeholder='Apellido'
          variant={AtInputVariant.DEFAULT}
          disabled={false}
          error={false}
          errorMessage='Por favor, ingresa los datos correctamente'
          selectedValue={formState.lastname}
          handleChange={(e) => {
            onSubmitWithMax(e.value, () => handleFormChange(e), 80)
          }}
        />

        {renderInput(
          site,
          formState.rut,
          'mt-6',
          (e) => {
            setErrors({ ...errors, rut: e.error })

            handleFormChange(e)
          },
          onDniError
        )}
        <AtInputEmail
          site={site}
          className='mt-6'
          id='email'
          label='E-mail'
          disabled={false}
          value={formState.email}
          onChange={(e) => {
            setErrors({ ...errors, email: e.error })
            handleFormChange(e)
          }}
        />
        <AtInputPhone
          site={site}
          className='mt-6'
          id='phoneNumber'
          disabled={false}
          value={formState.phoneNumber}
          onChange={(e) => {
            setErrors({ ...errors, phoneNumber: e.error })
            handleFormChange(e)
          }}
        />

        {branches && branches.length > 0 && (
          <AtInputDropdown
            site={site}
            className='mt-6'
            optionsClassName='w-full !max-h-[250px] overflow-y-auto'
            placeholder='Sucursal'
            disabled={false}
            selectedValue={formState.branchOfficeId}
            handleChange={(option) => {
              setFormState({ ...formState, branchOfficeId: option })
            }}
            options={branches}
          />
        )}

        <AtTextArea
          site={site}
          handleChange={(e) => setFormState({ ...formState, message: e.value })}
          className='w-full min-h-[144px] mt-6'
          value={formState.message}
          id='message'
          placeholder='Comentarios'
        />
        <AtCheckbox
          site={site}
          className='mt-7 relative'
          label='Quiero dar mi auto en parte de pago'
          id='carPayment'
          variant={AtCheckboxVariant.PRIMARY}
          onChange={(_, value) =>
            setFormState({ ...formState, partPayment: value })
          }
          checked={formState.partPayment || false}
        />
        <AtCheckbox
          site={site}
          className='mt-7 relative'
          label='Quiero ver opciones de financiamiento'
          id='financiamiento'
          variant={AtCheckboxVariant.PRIMARY}
          onChange={(_, value) =>
            setFormState({ ...formState, financing: value })
          }
          checked={formState.financing || false}
        />
        {site === SitesNames.WIGO_MOTORS && (
          <WigoFields
            site={site}
            formState={formState}
            setFormState={setFormState}
          />
        )}
        <div className='flex items-center justify-center w-full mt-6'>
          <AtButton
            styles={buttonStyles}
            site={site}
            variant={
              !loading ? AtButtonVariant.PRIMARY : AtButtonVariant.LOADING
            }
            type='submit'
            label='ENVIAR'
            disabled={
              validateButton(site) ||
              errors.phoneNumber ||
              errors.rut ||
              errors.email ||
              errors.dni
            }
          />
        </div>
        <div className='mt-6'>
          <ReCaptchaText />
        </div>
      </form>
    </MlModal>
  )
}
