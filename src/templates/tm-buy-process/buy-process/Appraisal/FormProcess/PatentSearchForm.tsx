import { useState } from 'react'
import { AtButton, AtInput } from '@gac/core-components'
import { formatPatent, patentRegex } from '../../../../../utils/formatPatent'
import { AtInputVariant } from '../../../../tm-pdp/common/form-quote/types'
import { patentResponseMap } from './fieldConfig'
import { getPatent } from './resolvers'
import { PatentResponse, PatentSearchFormProps, PatentAction } from './types'

export const PatentSearchForm = ({
  patent,
  setPatent,
  action,
  disabled,
  site
}: PatentSearchFormProps) => {
  const [current, setCurrent] = useState(PatentAction.PRISTINE)

  const searchPatent = async (patent: string) => {
    try {
      if (!patentRegex.test(patent)) throw new Error('Invalid patent')

      setCurrent(PatentAction.SEARCH_STARTED)
      action(PatentAction.SEARCH_STARTED)

      const response = await getPatent(patent, site)

      if (Object.keys(response).length === 0) {
        setCurrent(PatentAction.SEARCH_FINISHED_EMPTY)
        action(PatentAction.SEARCH_FINISHED_EMPTY, { patent })
      } else {
        setCurrent(PatentAction.SEARCH_FINISHED)
        action(PatentAction.SEARCH_FINISHED, {
          patent,
          ...patentResponseMap(response as PatentResponse),
          isAutocompleted: true
        })
      }
    } catch {
      setCurrent(PatentAction.ERROR)
      action(PatentAction.ERROR)
    }
  }

  return (
    <form className='w-full'>
      <div className='text-center md:text-left mb-8 md:mb-4 text-gray-600'>
        Si ingresas tu patente buscaremos la información por ti
      </div>
      <div className='flex flex-col md:flex-row justify-between items-center md:items-start gap-6 md:gap-8'>
        <AtInput
          id='patent'
          variant={AtInputVariant.WITH_ICON}
          placeholder='Ingresa tu patente'
          selectedValue={formatPatent(patent, site)}
          handleChange={(v) => {
            const rawValue = v.value.toUpperCase().replace(/ /g, '')
            const patent = /^(\w|\d){0,6}$/

            if (patent.test(rawValue)) setPatent(rawValue)
          }}
          error={current === PatentAction.ERROR}
          errorMessage='La patente ingresada no es válida'
          className='w-full'
          site={site}
          disabled={disabled}
        />
        <AtButton
          label='Buscar'
          className='uppercase w-full md:w-[6.25rem] h-8 md:mt-2'
          variant={
            current === PatentAction.SEARCH_STARTED
              ? 'loading'
              : 'primary-outlined'
          }
          onClick={(e) => {
            e.preventDefault()
            searchPatent(patent)
          }}
          site={site}
          disabled={
            current === PatentAction.SEARCH_STARTED ||
            !patent ||
            patent.length !== 6 ||
            disabled
          }
        />
      </div>
      {current === PatentAction.SEARCH_FINISHED_EMPTY && (
        <div className='mt-1 text-gray-600'>
          No hemos encontrado información acerca de la patente ingresada, por
          favor, ingresa los datos manualmente
        </div>
      )}
    </form>
  )
}
