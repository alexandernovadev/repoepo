import { AtButtonLink, MlStepCard } from '@gac/core-components'
import {
  AppraisalSelection,
  jump,
  next,
  setAppraisalSelection
} from '../../../../redux/features/buyProcessV2Slice'
import { stepTitleClasses } from '../../common/classes'
import { BuyProcessV2Props } from '../../common/types'
import { AppraisalSubSteps } from './sub-steps'
import { validation } from './validation'

/**
 * View for optional entry for appraisal of a client's own car, features 4 posible states
 * @see {AppraisalSelection} in the Redux slice for state definitions
 */
export const Appraisal = ({ state, dispatch, site }: BuyProcessV2Props) => {
  const { active, completed, disabled } = validation(state)

  return (
    <>
      <MlStepCard
        idSection={'appraisal-section'}
        title='Tasación'
        active={active}
        completed={completed}
        disabled={disabled}
        onEdit={() => dispatch(jump(2))}
        site={site}
      >
        <p className={stepTitleClasses}>
          ¿Quieres entregar tu auto en parte de pago? Puedes obtener una
          tasación inmediata
        </p>
        <AppraisalSubSteps state={state} dispatch={dispatch} site={site} />
        {state.appraisalSelection !== 0 && (
          <>
            <hr className='bg-gray-200 mb-8' />
            <div className='flex justify-center content-center'>
              <AtButtonLink
                variant='primary-text'
                label='CONTINUAR SIN TASAR'
                site={site}
                className='cursor-pointer'
                onClick={() => {
                  dispatch(setAppraisalSelection(AppraisalSelection.SKIPPED))
                  dispatch(next())
                }}
              />
            </div>
          </>
        )}
      </MlStepCard>
    </>
  )
}
