import React, { useEffect } from 'react'
import {
  AtButton,
  MlModal,
  MlRichText,
  MlRichTextVariant
} from '@gac/core-components'
import { BuyProcessV2Props } from '../../common/types'
import { validation } from './validation'
import { CheckBoxTerms } from './CheckBoxTerms'
import { modal_contentScrollTerms } from '../../common/classes'
import { next } from '../../../../redux/features/buyProcessV2Slice'

interface Props {
  isOpen: boolean
  onClose: Function
}

export const ModalTerms = ({
  site,
  isOpen,
  onClose,
  template,
  state,
  dispatch
}: BuyProcessV2Props & Props) => {
  const { completed } = validation(state)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto'

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isOpen])
  return (
    <MlModal
      containerClassName='w-full sm:w-[500px] md:w-[608px] h-auto py-6 px-6 md:py-0 md:px-0'
      contentClassName='px-6 sm:p-6 w-full h-auto'
      title='Términos y condiciones'
      isOpen={isOpen}
      onCloseClick={() => onClose(false)}
      site={site}
    >
      <div className={modal_contentScrollTerms}>
        <MlRichText
          text={template!.terms.text}
          site={site}
          variant={MlRichTextVariant.TERMS_AND_CONDITIONS}
        />
      </div>
      <CheckBoxTerms
        state={state}
        dispatch={dispatch}
        site={site}
        template={template}
      />
      <div className='flex justify-center mt-6'>
        <AtButton
          label='Continuar'
          variant='primary'
          site={site}
          className='self-center w-full md:w-auto'
          disabled={!completed}
          onClick={() => {
            onClose(false)
            dispatch(next())
          }}

        />
      </div>
    </MlModal>
  )
}
