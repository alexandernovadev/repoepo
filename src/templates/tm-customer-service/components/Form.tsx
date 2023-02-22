import {
  AtButton,
  AtInput,
  AtInputDropdown,
  AtInputEmail,
  AtInputPhone,
  AtTextArea
} from '@gac/core-components'
import { useRouter } from 'next/router'
import { FormEventHandler, useState } from 'react'
import { formatPatent } from '../../../utils/formatPatent'
import { renderInput } from '../../tm-pdp/common/form-quote/renderInput'
import { AtInputVariant } from '../../tm-pdp/common/form-quote/types'
import { onSubmitWithMax } from '../../tm-technical-service-main/technical-service-process/Service/utils'
import { getPatentTextVariant } from '../../tm-technical-service-main/technical-service-process/Vehicle/utils'
import {
  formContainerClasses,
  formFieldsClasses,
  formTitleClasses
} from '../classes'
import { CustomerServiceFormProps } from '../types'

export const CustomerServiceForm = ({
  state,
  fieldHandler,
  submit,
  requestTypes,
  serviceTypes,
  contactReasons,
  site
}: CustomerServiceFormProps) => {
  const {
    requestType,
    serviceType,
    contactReason,
    fullName,
    rut,
    email,
    patent,
    phone,
    city,
    comment,
    errors
  } = state
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const textHandler = ({
    name,
    value,
    error
  }: {
    name: string
    value: string
    error?: boolean
  }) => {
    const isEmptyNumber = name === 'phone' && value === '+56'
    fieldHandler({
      [name]: value,
      ...(name !== 'patent'
        ? {
            errors: {
              ...errors,
              [name]: error || value === '' || isEmptyNumber
            }
          }
        : {
            errors: {
              ...errors,
              [name]: value !== '' && value.length !== 6
            }
          })
    })
  }

  const dropdownHandler = (name: string) => (value: string) =>
    textHandler({ name, value })

  const onSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await submit(state, site)
      fieldHandler({ currentStep: 2 })
    } catch (error) {
      router.push('/404')
    }
  }

  return (
    <form className={formContainerClasses} onSubmit={onSubmit}>
      <div className={formFieldsClasses}>
        <h2 className={formTitleClasses}>Formulario de contacto</h2>
        <AtInputDropdown
          selectedValue={requestType}
          handleChange={dropdownHandler('requestType')}
          placeholder='Tipo de solicitud'
          options={requestTypes}
          disabled={loading}
          site={site}
          optionsClassName='max-h-48 overflow-y-auto'
        />
        <AtInputDropdown
          selectedValue={serviceType}
          handleChange={dropdownHandler('serviceType')}
          placeholder='Tipo de servicio'
          options={serviceTypes}
          disabled={loading}
          site={site}
          optionsClassName='max-h-48 overflow-y-auto'
        />
        <AtInputDropdown
          selectedValue={contactReason}
          handleChange={dropdownHandler('contactReason')}
          placeholder='Motivo de contacto'
          options={contactReasons}
          disabled={loading}
          site={site}
          optionsClassName='max-h-48 overflow-y-auto'
        />
        <AtInput
          selectedValue={fullName}
          handleChange={({ name, value, error }) => {
            onSubmitWithMax(
              value,
              () => textHandler({ name, value, error }),
              60
            )
          }}
          variant={AtInputVariant.DEFAULT}
          id='fullName'
          placeholder='Nombre y apellido'
          error={false}
          disabled={loading}
          site={site}
        />
        {renderInput(
          site,
          rut,
          '',
          (e) => {
            textHandler({ name: 'rut', value: e.value, error: e.error })
          },
          () => {}
        )}
        <AtInputEmail
          value={email}
          onChange={({ name, value, error }) => {
            onSubmitWithMax(
              value,
              () => textHandler({ name, value, error }),
              80
            )
          }}
          id='email'
          disabled={loading}
          site={site}
        />
        <AtInputPhone
          value={phone}
          onChange={textHandler}
          id='phone'
          label='Teléfono de contacto'
          disabled={loading}
          site={site}
        />
        <AtInput
          selectedValue={formatPatent(patent, site)}
          handleChange={({ name, value: formattedValue }) => {
            const value = formattedValue.replace(/\s/g, '').toUpperCase()

            if (value === '' || /^(\w|\d){0,6}$/.test(value))
              textHandler({ name, value })
          }}
          variant={AtInputVariant.DEFAULT}
          id='patent'
          placeholder={`${getPatentTextVariant(site)}`}
          error={false}
          disabled={loading}
          site={site}
        />
        <AtInput
          selectedValue={city}
          handleChange={({ name, value, error }) => {
            onSubmitWithMax(
              value,
              () => textHandler({ name, value, error }),
              40
            )
          }}
          variant={AtInputVariant.DEFAULT}
          id='city'
          placeholder='Ciudad'
          error={false}
          disabled={loading}
          site={site}
        />
        <AtTextArea
          value={comment}
          handleChange={({ name, value, error }) => {
            textHandler({ name, value, error })
          }}
          id='comment'
          className='min-h-[13.5rem] w-full'
          placeholder='Comentario'
          disabled={loading}
          site={site}
        />
      </div>
      <AtButton
        variant={loading ? 'loading' : 'primary'}
        label='Enviar'
        disabled={Object.values(errors).find((b) => b) || loading}
        className='mt-6 py-3 w-full md:w-40'
        site={site}
      />
    </form>
  )
}
