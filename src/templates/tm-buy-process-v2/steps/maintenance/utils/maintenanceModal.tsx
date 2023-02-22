import { MlModal, MlRichText } from '@gac/core-components'
import { createPortal } from 'react-dom'
import { Sites } from '../../../../../types'

export interface WarrantyModal extends Sites {
  setModal: (modal: WarrantyModalState) => void
  modal: WarrantyModalState
}

export interface WarrantyModalState {
  open: boolean
  title: string
  text: any
}

export const MaintenanceModal = ({ site, modal, setModal }: WarrantyModal) => {
  return createPortal(
    <MlModal
      className='px-5'
      containerClassName='w-full max-w-[600px] px-3'
      site={site}
      isOpen={modal.open}
      onCloseClick={() => setModal({ open: false, text: null, title: '' })}
      title={modal.title}
    >
      <MlRichText site={site} text={modal.text} />
    </MlModal>,
    document.getElementById('portal') as Element
  )
}
