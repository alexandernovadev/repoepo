import { AtCheckbox, AtCheckboxVariant, AtLink } from '@gac/core-components'
import React, { Dispatch, SetStateAction } from 'react'
import { AtLinkVariants, Sites } from '../../../../types'

interface WigoFieldsProps<TState> extends Sites {
  setFormState: Dispatch<SetStateAction<TState>>
  formState: TState
}

export const WigoFields = <
  TState extends {
    authorizedDataUsage: boolean
    agreedTermsAndConditions: boolean
  }
>({
  site,
  formState,
  setFormState
}: WigoFieldsProps<TState>) => {
  return (
    <div className='mt-7 relative'>
      <p className='text-sm font-bold'>Términos y condiciones</p>
      <AtCheckbox
        site={site}
        className='mt-7 relative'
        label='Autorizo el tratamiento de mis datos*'
        id='carPayment'
        variant={AtCheckboxVariant.PRIMARY}
        onChange={(_, value) =>
          setFormState({ ...formState, authorizedDataUsage: value })
        }
        checked={formState.authorizedDataUsage || false}
      />
      <div className='flex items-center mt-7'>
        <AtCheckbox
          site={site}
          className='relative'
          label='Acepto los'
          id='financiamiento'
          variant={AtCheckboxVariant.PRIMARY}
          onChange={(_, value) =>
            setFormState({
              ...formState,
              agreedTermsAndConditions: value
            })
          }
          checked={formState.agreedTermsAndConditions || false}
        />
        <AtLink
          site={site}
          href='/terminos-y-condiciones'
          target='_blank'
          className='text-sm -ml-3'
          label='términos y condiciones*'
          variant={AtLinkVariants.HORIZONTAL_INFO}
        />
      </div>
      <p className='mt-4 text-xs text-gray-800 italic'>
        *Campos requeridos para cotizar
      </p>
    </div>
  )
}
