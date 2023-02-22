import { MlModal } from '@gac/core-components'
import { useEffect } from 'react'
import { GetReCaptchaTokenFn } from '../../../../tm-buy-process/types'
import { Simulation } from '../simulation'
import { FinancingModalProps } from './types'

export const FinancingModal = ({
  site,
  isOpen,
  onCloseClick,
  state,
  dispatch,
  getReCaptchaToken,
  template
}: FinancingModalProps & GetReCaptchaTokenFn) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])

  return (
    <MlModal
      site={site}
      titleClassName='mx-3'
      title=''
      isOpen={isOpen}
      onCloseClick={onCloseClick}
      containerClassName='h-auto w-[336px] md:w-auto sm:w-full'
      contentClassName='!px-6 w-full h-full overflow-y-scroll overflow-x-hidden scrollbar'
    >
      <Simulation
        onCloseClick={onCloseClick}
        site={site}
        state={state}
        dispatch={dispatch}
        getReCaptchaToken={getReCaptchaToken}
        {...template?.financingFeatures}
      />
    </MlModal>
  )
}
