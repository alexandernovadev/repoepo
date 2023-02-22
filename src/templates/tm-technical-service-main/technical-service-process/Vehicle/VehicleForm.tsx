import { useEffect, useMemo, useState } from 'react'
import { AtButton, AtInput, AtInputDropdown } from '@gac/core-components'
import { useSelector, useDispatch } from 'react-redux'
import {
  technicalServiceSelector,
  next,
  setFormVehicleData,
  setServiceData
} from '../../../../redux/features/technicalServiceSlice'
import { AtButtonVariant } from '../../../../types'
import { AtInputVariant } from '../../../tm-pdp/common/form-quote/types'
import {
  getChangeAutoLinkClasses,
  InputDropdownClasses,
  InputVehicleFormClasses
} from './classes'
import { VehicleFormProps } from './types'
import { formatPatent } from '../../../../utils/formatPatent'
import { AppointmentBrand, Model } from '../Service/types'
import { toCapitalize } from '../../../../utils/toCapitalize'
import { fetchAppointmentsModel } from '../Service/api'
import { formatAvailableYears, getPatentTextVariant } from './utils'

export const VehicleForm = ({ site, openModal }: VehicleFormProps) => {
  const dispatch = useDispatch()
  const [error, setError] = useState(false)
  const {
    vehicleData,
    formVehicleData,
    appointmentBrands,
    template,
    serviceData
  } = useSelector(technicalServiceSelector)

  const [formState, setFormState] = useState({
    id: vehicleData?.id ?? '',
    patent: {
      value:
        formVehicleData?.patent?.length > 0
          ? formVehicleData?.patent
          : vehicleData?.patent ?? '',
      isEditabled: !vehicleData?.patent
    },
    vin: {
      value:
        formVehicleData?.vin?.length > 0
          ? formVehicleData?.vin
          : vehicleData?.vin ?? '',
      isEditabled: !vehicleData?.vin
    },
    brand: {
      value:
        formVehicleData?.brand?.length > 0
          ? formVehicleData?.brand
          : vehicleData?.brand ?? '',
      isEditabled: !vehicleData?.brand
    },
    model: {
      value:
        formVehicleData?.model?.length > 0
          ? formVehicleData?.model
          : vehicleData?.model ?? '',
      isEditabled: !vehicleData?.model
    },
    year: {
      value:
        formVehicleData?.year?.length > 0
          ? formVehicleData?.year
          : vehicleData?.year ?? '',
      isEditabled: !vehicleData?.year
    },
    technicalModel: {
      value: vehicleData.technicalModel
    }
  })

  const [brandsToShow] = useState<Array<string>>(() =>
    appointmentBrands.map((brand: AppointmentBrand) =>
      toCapitalize(brand.value || '')
    )
  )
  const [modelsToShow, setModelsToShow] = useState<Array<string>>(() => [])
  const [loadingModels, setLoadingModels] = useState<boolean>(false)
  const [yearsToShow, setYearsToShow] = useState<Array<string>>([])

  useMemo(() => {
    setFormState({
      id: vehicleData?.id ?? '',
      patent: {
        value:
          formVehicleData?.patent?.length > 0
            ? formVehicleData?.patent
            : vehicleData?.patent ?? '',
        isEditabled: !vehicleData?.patent
      },
      vin: {
        value:
          formVehicleData?.vin?.length > 0
            ? formVehicleData?.vin
            : vehicleData?.vin ?? '',
        isEditabled: !vehicleData?.vin
      },
      brand: {
        value:
          formVehicleData?.brand?.length > 0
            ? formVehicleData?.brand
            : vehicleData?.brand ?? '',
        isEditabled: !vehicleData?.brand
      },
      model: {
        value:
          formVehicleData?.model?.length > 0
            ? formVehicleData?.model
            : vehicleData?.model ?? '',
        isEditabled: !vehicleData?.model
      },
      year: {
        value:
          formVehicleData?.year?.length > 0
            ? formVehicleData?.year
            : vehicleData?.year ?? '',
        isEditabled: !vehicleData?.year
      },
      technicalModel: {
        value: vehicleData.technicalModel
      }
    })
  }, [vehicleData])

  const handleFormChange = (e: any) => {
    setFormState({
      ...formState,
      [e.name]: {
        value: e.value,
        isEditabled: true
      }
    })
  }

  const getModels = async (brandId?: string) => {
    if (brandId) {
      setLoadingModels(true)
      const models = await fetchAppointmentsModel(brandId, site)

      if (models.length > 0) {
        setModelsToShow(() =>
          models.map((model: Model) => toCapitalize(model.value || ''))
        )
      }
      setLoadingModels(false)
    }
  }

  const onChangeBrand = (value: string) => {
    setFormState({
      ...formState,
      brand: { value: value, isEditabled: true },
      model: { value: '', isEditabled: formState.model.isEditabled },
      year: { value: '', isEditabled: formState.year.isEditabled }
    })
  }

  useMemo(() => {
    if (formState.brand.value) {
      const currentBrand = appointmentBrands.find(
        (brand: AppointmentBrand) =>
          brand.value?.toUpperCase() === formState.brand.value.toUpperCase()
      )

      if (currentBrand?.value) {
        getModels(currentBrand.brandId)
      }
    }
  }, [formState.brand])

  useEffect(() => {
    setYearsToShow(() =>
      formatAvailableYears(template?.initialYear, template?.finalYear)
    )
  }, [])

  useEffect(() => {
    if (serviceData.brand !== formState.brand.value) {
      dispatch(
        setServiceData({
          service: undefined,
          description: undefined,
          mileage: undefined,
          city: undefined,
          branchOffice: undefined,
          date: null,
          time: null,
          assessor: undefined
        })
      )
    }
  }, [formState.brand])

  const changeAutoLinkClasses = useMemo(() => {
    return getChangeAutoLinkClasses(site)
  }, [site])

  return (
    <form className='w-full mt-14 flex flex-col items-center' typeof='submit'>
      <h3 className='text-xl text-gray-600 font-normal y-0'>
        Ingresa los datos del vehículo
      </h3>
      {formState.id !== 'new-car' && (
        <div className='flex flex-col sm:flex-row items-center justify-between w-full sm:w-[476px] md:w-[608px] mt-10'>
          <p className='text-gray-600 text-base font-normal'>
            Estás viendo los datos de tu{' '}
            <span className='font-bold'>{formState?.brand?.value}</span>
          </p>
          <button
            className={`flex items-center ${changeAutoLinkClasses.link} font-medium underline text-base mt-[10px] sm:mt-0`}
            onClick={(e) => {
              e.preventDefault()
              openModal()
            }}
          >
            Cambiar auto
            <svg
              width='17'
              height='12'
              viewBox='0 0 17 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='ml-3'
            >
              <path
                d='M1.375 4H13V5.75C13 6.6875 14.125 7.125 14.7188 6.4375L16.7188 4.1875C17.0625 3.8125 17.0625 3.21875 16.7188 2.84375L14.7188 0.593747C14.125 -0.0937533 13 0.343747 13 1.25V3H1.375C1.15625 3 1 3.1875 1 3.375V3.625C1 3.84375 1.15625 4 1.375 4ZM14 1.25L16 3.5L14 5.75V1.25ZM16.625 8H5V6.25C5 5.34375 3.84375 4.90625 3.25 5.59375L1.25 7.84375C0.90625 8.21875 0.90625 8.8125 1.25 9.1875L3.25 11.4375C3.84375 12.125 5 11.6875 5 10.75V9H16.625C16.8125 9 17 8.84375 17 8.625V8.375C17 8.1875 16.8125 8 16.625 8ZM4 10.75L2 8.5L4 6.25V10.75Z'
                fill={`${changeAutoLinkClasses.icon}`}
              />
            </svg>
          </button>
        </div>
      )}
      <AtInput
        site={site}
        className={`${InputVehicleFormClasses} ${
          formState.id !== 'new-car' ? 'mt-6' : 'mt-10'
        }`}
        id='patent'
        placeholder={`${getPatentTextVariant(site)}`}
        variant={AtInputVariant.DEFAULT}
        disabled={formState.id !== 'new-car' && !formState.patent.isEditabled}
        error={error}
        errorMessage='La patente ingresada no es válida'
        selectedValue={formatPatent(formState.patent.value, site)}
        handleChange={(v) => {
          if (/^(\w|\d){0,6}$/.test(v.value.replace(/\s/g, ''))) {
            setFormState({
              ...formState,
              patent: {
                value: v.value.toUpperCase().replace(/ /g, ''),
                isEditabled: true
              }
            })
            if (v.value.replace(/ /g, '').length === 6) {
              setError(false)
            } else {
              setError(true)
            }
          }
        }}
      />
      <AtInput
        site={site}
        className={`${InputVehicleFormClasses} mt-10`}
        id='vin'
        placeholder='VIN (opcional)'
        variant={AtInputVariant.DEFAULT}
        disabled={formState.id !== 'new-car' && !formState.vin.isEditabled}
        error={false}
        errorMessage='Por favor, ingresa los datos correctamente'
        selectedValue={formState.vin.value}
        handleChange={(e) => handleFormChange(e)}
      />
      <AtInputDropdown
        handleChange={(value) => onChangeBrand(value)}
        selectedValue={formState?.brand?.value?.toString()}
        placeholder='Marca'
        containerClassname={`${InputVehicleFormClasses} mt-10`}
        optionsClassName={InputDropdownClasses}
        disabled={formState.id !== 'new-car' && !formState.brand.isEditabled}
        options={brandsToShow}
        site={site}
      />
      <AtInputDropdown
        loading={loadingModels}
        handleChange={(value) =>
          setFormState({
            ...formState,
            model: { value: value, isEditabled: true }
          })
        }
        selectedValue={formState?.model?.value?.toString()}
        placeholder='Modelo'
        containerClassname={`${InputVehicleFormClasses} mt-10`}
        optionsClassName={InputDropdownClasses}
        disabled={
          (formState.id !== 'new-car' && !formState.model.isEditabled) ||
          loadingModels
        }
        options={modelsToShow}
        site={site}
      />
      <AtInputDropdown
        handleChange={(value) =>
          setFormState({
            ...formState,
            year: { value: value, isEditabled: true }
          })
        }
        selectedValue={formState?.year?.value?.toString()}
        placeholder='Año'
        containerClassname={`${InputVehicleFormClasses} mt-10`}
        optionsClassName={InputDropdownClasses}
        disabled={formState.id !== 'new-car' && !formState.year.isEditabled}
        options={yearsToShow}
        site={site}
      />
      <AtButton
        onClick={(e) => {
          e.preventDefault()
          dispatch(
            setFormVehicleData({
              brand: formState.brand.value,
              model: formState.model.value,
              year: formState.year.value,
              vin: formState.vin.value,
              patent: formState.patent.value,
              technicalModel: vehicleData.technicalModel
            })
          )
          dispatch(next())
        }}
        site={site}
        label='CONTINUAR'
        className='mt-10'
        disabled={
          error ||
          formState?.patent?.value?.length < 1 ||
          formState?.brand?.value?.length < 1 ||
          formState?.model?.value?.length < 1 ||
          formState?.year?.value?.length < 1
        }
        variant={AtButtonVariant.PRIMARY}
      />
    </form>
  )
}
