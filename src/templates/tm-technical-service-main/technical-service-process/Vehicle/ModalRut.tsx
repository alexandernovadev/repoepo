import { AtButton, MlModal, MlRadioButton } from '@gac/core-components'
import { useMemo, useState } from 'react'
import { AtButtonVariant } from '../../../../types'
import { formatSearchData } from './formatSearchData'
import {
  formatRadioButtonProps,
  ModalRutProps,
  radioButtonProps
} from './types'
import { getMaintenanceTextVariant } from './utils'

export const ModalRut = ({
  site,
  toggleModal,
  isModalOpen,
  searchData,
  selectVehicle,
  setSelectVehicle,
  setShowForm,
  setSelectedVehicleOnRedux
}: ModalRutProps) => {
  const [radioButtonData, setRadioButtonData] = useState<
    Array<formatRadioButtonProps>
  >([])

  useMemo(() => {
    const formatData: Array<formatRadioButtonProps> = formatSearchData(
      searchData,
      site
    )
    setRadioButtonData(formatData)
  }, [searchData])

  const handleClick = () => {
    if (!selectVehicle) return

    setShowForm(true)
    toggleModal()
    setSelectedVehicleOnRedux(selectVehicle)
  }

  return (
    <section>
      <MlModal
        site={site}
        onCloseClick={toggleModal}
        isOpen={isModalOpen}
        title={`Selecciona el auto que quieres ingresar a ${getMaintenanceTextVariant(
          site
        )}`}
        containerClassName='w-full sm:w-[500px] md:w-[608px] h-[430px]'
        contentClassName='px-6 sm:p-6 w-full h-[430px]'
        className='justify-center'
        titleClassName='!text-gray-600 text-base sm:text-lg'
        childrenClassName='h-full pb-10 w-full flex flex-col justify-between'
        internalBoxClassName='h-full'
      >
        <div className='w-full overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'>
          <MlRadioButton
            className='py-4 px-1 !w-full'
            site={site}
            data={radioButtonData!}
            onchange={(select: radioButtonProps) => setSelectVehicle(select)}
          />
        </div>
        <div className='w-full flex justify-end mt-5'>
          <AtButton
            onClick={() => handleClick()}
            site={site}
            label='CONTINUAR'
            disabled={selectVehicle === undefined}
            variant={AtButtonVariant.PRIMARY}
          />
        </div>
      </MlModal>
    </section>
  )
}
