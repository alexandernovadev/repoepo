import { AtButtonLink, MlModal } from '@gac/core-components'
import React from 'react'
import { next } from '../../../../../redux/features/buyProcessV2Slice'
import { ModalPreAprobationProps } from '../types'

export const ModalPreAprobation = ({
  setOpenModal,
  site,
  openModal,
  dispatch
}: ModalPreAprobationProps) => {
  return (
    <>
      <MlModal
        containerClassName=' max-w-[500px] !p-6'
        title='Atención'
        onCloseClick={() => setOpenModal(false)}
        site={site}
        isOpen={openModal}
        className='w-screen'
      >
        <p className=' text-base font-normal leading-6 text-gray-500'>
          En el paso final realizaremos tu solicitud de pre-aprobación de
          crédito
        </p>
        <div className=' flex justify-center mt-6'>
          <AtButtonLink
            actionValue={'#insurance-section'}
            label='Aceptar'
            variant={'primary'}
            className='py-2 px-6 cursor-pointer'
            onClick={() => {
              dispatch(next())
              setOpenModal(false)
            }}
            site={site}
          />
        </div>
      </MlModal>
    </>
  )
}
