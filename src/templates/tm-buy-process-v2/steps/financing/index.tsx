import { MlStepCard } from '@gac/core-components'
import { useState } from 'react'
import { jump } from '../../../../redux/features/buyProcessV2Slice'
import { BuyProcessV2Props } from '../../common/types'
import { FinancingModal } from './financingModal'
import { validation } from './validation'
import { Selection } from './selection'
import { GetReCaptchaTokenFn } from '../../../tm-buy-process/types'
/**
 * TODO: Here goes expected behavior of step
 */
export const Financing = ({
  state,
  dispatch,
  site,
  getReCaptchaToken,
  template
}: BuyProcessV2Props & GetReCaptchaTokenFn) => {
  const { active, completed, disabled } = validation(state)
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <>
      <FinancingModal
        getReCaptchaToken={getReCaptchaToken}
        state={state}
        site={site}
        dispatch={dispatch}
        isOpen={openModal}
        onCloseClick={() => setOpenModal(false)}
        template={template}
      />
      <MlStepCard
        title='Financiamiento'
        active={active}
        disabled={disabled}
        completed={completed}
        onEdit={() => dispatch(jump(3))}
        site={site}
        idSection={'financing-section'}
      >
        <Selection
          template={template}
          site={site}
          state={state}
          dispatch={dispatch}
          openSimulationModal={() => setOpenModal(true)}
        />
      </MlStepCard>
    </>
  )
}
