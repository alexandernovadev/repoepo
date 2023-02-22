import { AtInput, AtInputRut } from '@gac/core-components'
import React, { useEffect, useState } from 'react'
import { SitesNames } from '../../../../types'
import { onSubmitWithMax } from '../../../tm-technical-service-main/technical-service-process/Service/utils'
import { AtInputVariant } from './types'

export const renderInput = (
  site: SitesNames,
  value: string,
  classname: string,
  onChange: (e: any) => void,
  onDniError?: (dniError: boolean) => void
) => {
  const [dniError, setDniError] = useState<boolean>(false)

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
          className={classname}
          id='rut'
          disabled={false}
          value={value}
          onChange={(e) => {
            onChange(e)
          }}
        />
      )
    case SitesNames.WIGO_MOTORS:
      return (
        <AtInput
          className={classname}
          selectedValue={value}
          handleChange={(e) => {
            onSubmitWithMax(
              e.value,
              () => {
                if (e.value === '' || /^\d{1,8}$/.test(e.value)) {
                  setDniError(() => !/^\d{8}$/.test(e.value))
                  onChange(e)
                } else {
                  setDniError(() => true)
                }
              },
              8
            )
          }}
          variant={AtInputVariant.DEFAULT}
          id='rut'
          placeholder='DNI'
          error={dniError}
          site={site}
        />
      )
    default:
      return (
        <AtInputRut
          site={site}
          className={classname}
          id='rut'
          disabled={false}
          value={value}
          onChange={(e) => {
            onChange(e)
          }}
        />
      )
  }
}
