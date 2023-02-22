import { AtInput, AtInputRut } from '@gac/core-components'
import { useEffect, useState } from 'react'
import { SitesNames } from '../../../../types'
import { AtInputVariant } from '../../../tm-pdp/common/form-quote/types'
import { onSubmitWithMax } from '../Service/utils'
import { VehicleStepClasses } from './classes'

export const renderSearchInput = (
  site: SitesNames,
  value: string,
  onChange: ({ value, error }: { value: string; error: boolean }) => void,
  onDniError?: (dniError: boolean) => void
) => {
  const [dni, setDni] = useState<string>(value)
  const [dniError, setDniError] = useState<boolean>(false)

  useEffect(() => {
    if (dni?.length === 8 && /^[0-9]+$/.test(dni)) {
      setDniError(() => false)
    } else if (dni !== '') {
      setDniError(() => true)
    }
  }, [dni])

  useEffect(() => {
    if (onDniError) {
      onDniError(dniError)
    }
  }, [dniError])

  switch (site) {
    case SitesNames.SALAZAR_ISRAEL:
      return (
        <AtInputRut
          site={site}
          className={VehicleStepClasses.searchRutClasses.inputRut}
          value={value}
          onChange={onChange}
          id='rut'
        />
      )
    case SitesNames.WIGO_MOTORS:
      return (
        <AtInput
          selectedValue={value}
          handleChange={({ value }) => {
            onSubmitWithMax(
              value,
              () => {
                const error = dniError
                setDni(() => value)
                onChange({ value, error })
              },
              8
            )
          }}
          variant={AtInputVariant.DEFAULT}
          id='dni'
          placeholder='DNI'
          error={dniError}
          site={site}
          className={VehicleStepClasses.searchRutClasses.inputRut}
        />
      )
    default:
      return (
        <AtInputRut
          site={site}
          className={VehicleStepClasses.searchRutClasses.inputRut}
          value={value}
          onChange={onChange}
          id='rut'
        />
      )
  }
}
