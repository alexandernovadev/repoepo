import { AtButtonLink, MlStepCard } from '@gac/core-components'
import { useEffect } from 'react'
import { jump, next } from '../../../../redux/features/buyProcessV2Slice'
import { stepSubtitleClasses, stepTitleClasses } from '../../common/classes'
import { BuyProcessV2Props } from '../../common/types'
import { useStockAvailable } from '../../hooks/useStockAvailable'
import { ColorSelect } from './color-select'
import { validation } from './validation'
import { VersionSelect } from './version-select'

import { NoStockWarning } from './NoStockWarning'

/**
 * Component for selecting a car variant and color, dependent if the car is new, otherwise, this view should be hidden
 *
 * Currently only available in default flow
 */
export const Version = ({ state, dispatch, site, car }: BuyProcessV2Props) => {
  const { active, disabled, completed } = validation(state)

  const { stockCar, isLoadingStock } = useStockAvailable(
    state.car?.isNew,
    car!,
    site,
    dispatch
  )

  useEffect(() => {
    if (!state.car!.isNew && state.currentStep === 0) dispatch(jump(1))
    if (state.currentStep === 0) {
      scroll({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }, [])

  if (!state.car!.isNew) return null

  return (
    <MlStepCard
      title='Versión auto y color'
      active={active}
      disabled={disabled}
      completed={completed}
      onEdit={() => dispatch(jump(0))}
      site={site}
      idSection={'version-section'}
    >
      <div className='flex flex-col gap-6'>
        <p className={stepTitleClasses}>
          Selecciona la versión y color del auto a cotizar
        </p>
        <p className={stepSubtitleClasses}>
          Versiones del {`${state.car!.brand} ${state.car!.model}`}
        </p>
        <div
          className={`flex flex-col gap-10 ${
            isLoadingStock && 'animate-pulse '
          }`}
        >
          <VersionSelect
            state={state}
            dispatch={dispatch}
            site={site}
            stockCar={stockCar}
            isLoading={isLoadingStock}
          />
          <hr className='bg-gray-200' />
          {!isLoadingStock && stockCar.length === 0 ? (
            <NoStockWarning />
          ) : (
            !isLoadingStock && (
              <ColorSelect
                state={state}
                dispatch={dispatch}
                site={site}
                stockCar={stockCar}
                car={car}
              />
            )
          )}
        </div>
        <AtButtonLink
          actionValue='#contact-section'
          label='Continuar'
          variant='primary'
          site={site}
          className='self-center'
          disabled={!completed}
          onClick={() => {
            dispatch(next())
          }}
        />
      </div>
    </MlStepCard>
  )
}
