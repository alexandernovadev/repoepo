import { AtButton, AtButtonVariant, MlModal } from '@gac/core-components'
import React, { useEffect } from 'react'
import { SitesNames } from '../../../../../types'
import { useDispatch } from 'react-redux'
import { jump, jumpSubStep, STEP_FINANCING, STEP_FINANCING_SUBSTEP_SELECTION } from '../../../../../redux/features/buyProcessSlice'

interface ModalApraisalErrorProps {
  site: SitesNames
  isOpenModalError: boolean
  setIsOpenModalError: Function
}

export const ModalErrorApraisal = ({
  isOpenModalError,
  setIsOpenModalError,
  site
}: ModalApraisalErrorProps) => {
  
  const dispatch = useDispatch()

  useEffect(() => {
    document.body.style.overflow = isOpenModalError ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpenModalError])

  return (
    <MlModal
      containerClassName='w-full sm:w-[500px] md:w-[608px] h-auto py-6 px-6 md:py-0 md:px-0 '
      contentClassName='px-6 sm:p-6 w-full h-auto '
      title='Atención'
      isOpen={isOpenModalError}
      onCloseClick={() => setIsOpenModalError(false)}
      site={site}
      className='flex justify-center'
    >
      <p className='my-5'>
        El vehículo que ingresaste necesita mayor revisión, por lo que el
        ejecutivo gestionará su inspección
      </p>
      <hr className='bg-gray-200 w-full my-5' />
      <div className='w-full flex justify-center'>
        <AtButton
          label='Continuar'
          variant={AtButtonVariant.PRIMARY}
          className='py-2 px-6 '
          onClick={() => {
            dispatch(jumpSubStep(STEP_FINANCING_SUBSTEP_SELECTION))
            dispatch(jump(STEP_FINANCING))
            setIsOpenModalError(false)
          }}
          site={site}
        />
      </div>
    </MlModal>
  )
}
