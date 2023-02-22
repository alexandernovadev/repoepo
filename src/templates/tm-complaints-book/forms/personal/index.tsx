import {
  AtInput,
  AtInputDropdown,
  AtInputEmail,
  AtInputPhone
} from '@gac/core-components'
import { AtInputVariant } from '../../../tm-pdp/common/form-quote/types'
import { onSubmitWithMax } from '../../../tm-technical-service-main/technical-service-process/Service/utils'
import { FormsClasses } from '../../classes'
import { useComplainsBook } from '../../context/complainstBookContext'
import { PersonalFormProps } from '../../types'
import { getDocumentValidation, getDocumentValidationError } from '../utils'

export const PersonalForm = ({ site }: PersonalFormProps) => {
  const { forms, onFormChange } = useComplainsBook()

  return (
    <form className={`${FormsClasses.cardContainer} gap-10`}>
      <h3 className={FormsClasses.title}>
        Datos de la Persona que presenta el Reclamo
      </h3>
      <AtInputDropdown
        selectedValue={forms?.personal?.typeDocument ?? ''}
        handleChange={(e) => {
          onFormChange('personal', 'typeDocument', e)
        }}
        placeholder='Tipo de Documento'
        options={['DNI', 'C.E.']}
        disabled={false}
        site={site}
        optionsClassName='max-h-48 overflow-y-auto'
        className={FormsClasses.inputDropdown}
        containerClassname='w-full'
      />
      <AtInput
        selectedValue={forms?.personal?.id.value ?? ''}
        handleChange={({ value }) => {
          const isNumber = getDocumentValidation(
            forms?.personal?.typeDocument,
            value
          )
          if (isNumber || !value) {
            onFormChange('personal', 'id', {
              value: value,
              error: getDocumentValidationError(
                forms?.personal?.typeDocument,
                value
              )
            })
          }
        }}
        variant={AtInputVariant.DEFAULT}
        id='id'
        placeholder='Número de Documento'
        error={
          forms.personal.typeDocument.length <= 0
            ? false
            : forms?.personal?.id.error
        }
        errorMessage={`Ingrese un ${forms?.personal?.typeDocument} valido`}
        disabled={forms.personal.typeDocument.length <= 0}
        site={site}
        className='w-full'
      />
      <AtInput
        selectedValue={forms?.personal?.name ?? ''}
        handleChange={({ value }) => {
          onSubmitWithMax(
            value,
            () => onFormChange('personal', 'name', value),
            60
          )
        }}
        variant={AtInputVariant.DEFAULT}
        id='name'
        placeholder='Nombres'
        error={false}
        disabled={false}
        site={site}
        className='w-full'
      />
      <AtInput
        selectedValue={forms?.personal?.address ?? ''}
        handleChange={({ value }) => {
          onSubmitWithMax(
            value,
            () => onFormChange('personal', 'address', value),
            80
          )
        }}
        variant={AtInputVariant.DEFAULT}
        id='address'
        placeholder='Dirección'
        error={false}
        disabled={false}
        site={site}
        className='w-full'
      />
      <AtInputPhone
        value={forms?.personal.phone.value ?? ''}
        onChange={(value) => onFormChange('personal', 'phone', value)}
        id='phone'
        label='Número de celular'
        disabled={false}
        site={site}
        className='w-full'
      />
      <AtInputEmail
        value={forms.personal.email.value ?? ''}
        onChange={(value) => {
          onSubmitWithMax(
            value.value,
            () => onFormChange('personal', 'email', value),
            80
          )
        }}
        id='email'
        disabled={false}
        site={site}
        className='w-full'
      />
    </form>
  )
}
