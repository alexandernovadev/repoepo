import {
  MlCardSelectedCar,
  MlCardSelectedCardVariants,
  MlHeading,
  AtButton
} from '@gac/core-components'
import { useMemo } from 'react'
import {
  financingSelection,
  jump,
  previous,
  setDisabledSteps,
  STEP_ADDITIONAL_DATA,
  STEP_TERMS
} from '../../../../redux/features/buyProcessSlice'
import {
  selectionButtonsContainerClasses,
  selectionContentClasses
} from '../../classes'
import { financingTitleHeading, mapCarCard } from '../../data'
import { BuyProcessProps } from '../../types'

export const Selection = ({
  data: { car },
  dispatch,
  site,
  financingFeatures
}: BuyProcessProps) => {
  const skipSimulation = useMemo(() => {
    const carYear = parseInt(
      car!.features.find((f) => f.id === 'year')?.label ?? '0',
      10
    )

    const carFinancing = car!.financing
    const carUsed = !car!.isNew
    const smartMinYear = financingFeatures?.smartFinancingMinimumYear ?? 0
    const conventionalMinYear =
      financingFeatures?.conventionalFinancingMinimumYear ?? 0

    return (
      !carFinancing ||
      (carUsed && carYear < smartMinYear && carYear < conventionalMinYear)
    )
  }, [car, financingFeatures])

  return (
    <>
      <div className={selectionContentClasses}>
        <MlCardSelectedCar
          {...mapCarCard(car!)}
          site={site}
          variant={MlCardSelectedCardVariants.SMALL}
        />
        <MlHeading {...financingTitleHeading(site)} />
        <div className={selectionButtonsContainerClasses}>
          <AtButton
            onClick={() => {
              skipSimulation
                ? dispatch(setDisabledSteps(STEP_ADDITIONAL_DATA))
                : dispatch(setDisabledSteps())

              dispatch(
                financingSelection({ needsFinancing: true, skipSimulation })
              )
            }}
            variant={'large'}
            label='Sí, quiero evaluar opciones de financiamiento y pre-aprobarme en línea'
            site={site}
            labelClassname='w-[185px] sm:w-full'
          />
          <AtButton
            onClick={() => {
              dispatch(setDisabledSteps(STEP_ADDITIONAL_DATA))
              dispatch(
                financingSelection({ needsFinancing: false, skipSimulation })
              )
              dispatch(jump(STEP_TERMS))
            }}
            variant={'large'}
            label='No, continuar sin revisar opciones de financiamiento'
            site={site}
            labelClassname='w-[185px] sm:w-full'
          />
        </div>
      </div>
      <AtButton
        label='Volver'
        variant='primary-text'
        className='py-2 px-6'
        onClick={() => dispatch(previous())}
        site={site}
      />
    </>
  )
}
