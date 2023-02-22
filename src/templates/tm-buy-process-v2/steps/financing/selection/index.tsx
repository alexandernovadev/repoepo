import { AtButton, AtButtonLink } from '@gac/core-components'
import React, { useEffect } from 'react'
import {
  financingSelection,
  setSkipSimulation
} from '../../../../../redux/features/buyProcessV2Slice'
import { stepTitleClasses } from '../../../common/classes'
import { SelectionProps } from './types'

export const Selection = ({
  site,
  openSimulationModal,
  state,
  template,
  dispatch
}: SelectionProps) => {
  useEffect(() => {
    const carYear = parseInt(
      state.car!.features.find((f) => f.id === 'year')?.label ?? '0',
      10
    )

    const carFinancing = state.car!.financing
    const carUsed = !state.car!.isNew
    const smartMinYear =
      template?.financingFeatures?.smartFinancingMinimumYear ?? 0
    const conventionalMinYear =
      template?.financingFeatures?.conventionalFinancingMinimumYear ?? 0

    dispatch(
      setSkipSimulation(
        !carFinancing ||
          (carUsed && carYear < smartMinYear && carYear < conventionalMinYear)
      )
    )
  }, [state?.car, template?.financingFeatures])

  return (
    <>
      <p className={`${stepTitleClasses} mb-6  `}>
        ¿Necesitas financiamiento para tu vehículo? Te podemos pre-aprobar en
        línea
      </p>
      <div className=' md:px-6 flex gap-y-6 flex-wrap'>
        <AtButton
          onClick={() => {
            dispatch(
              financingSelection({
                needsFinancing: true,
                skipSimulation: state.skipSimulation
              })
            )
            openSimulationModal()
          }}
          labelClassname='w-[238px] md:w-full'
          variant={'large'}
          label='Sí, quiero evaluar opciones de financiamiento'
          site={site}
          disabled={state.skipSimulation}
        />
        <AtButtonLink
          labelClassname='w-[238px] md:w-full'
          actionValue='#additionalData-section'
          label='No, continuar sin financiamiento'
          variant={'large'}
          site={site}
          onClick={() => {
            dispatch(
              financingSelection({
                needsFinancing: false,
                skipSimulation: state.skipSimulation
              })
            )
          }}
        />
      </div>
    </>
  )
}
