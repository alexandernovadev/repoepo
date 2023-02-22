import { MlStepCard } from '@gac/core-components'
import { useState } from 'react'
import { jump } from '../../../../redux/features/buyProcessV2Slice'
import { BuyProcessV2Props } from '../../common/types'
import { AditionalDataForm } from './AditionalDataForm'
import { ModalPreAprobation } from './AditionalDataForm/ModalPreAprobation'
import { validation } from './validation'

/**
 * TODO: Here goes expected behavior of step
 */
export const AdditionalData = ({
  dispatch,
  site,
  state,
  template
}: BuyProcessV2Props) => {
  const { active, completed, disabled } = validation(state)
  const [openModal, setOpenModal] = useState<boolean>(false)

  return (
    <>
      <MlStepCard
        title={
          state.needsFinancing ? 'Busca tu pre-aprobación' : 'Datos adicionales'
        }
        active={active}
        disabled={disabled}
        completed={completed}
        onEdit={() => dispatch(jump(4))}
        site={site}
        idSection={'additionalData-section'}
      >
        <AditionalDataForm
          site={site}
          dispatch={dispatch}
          state={state}
          locations={template!.locations}
          setOpenModal={setOpenModal}
        />
      </MlStepCard>

      <ModalPreAprobation
        site={site}
        setOpenModal={setOpenModal}
        openModal={openModal}
        dispatch={dispatch}
      />
    </>
  )
}
