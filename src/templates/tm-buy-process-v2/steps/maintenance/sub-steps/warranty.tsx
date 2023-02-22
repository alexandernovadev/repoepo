import { AtButtonLink, AtLink } from '@gac/core-components'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  next,
  setMaintenance,
  setMaintenanceSubStep,
  setWarranty
} from '../../../../../redux/features/buyProcessV2Slice'
import {
  AtLinkVariants,
  ContentfulTemplateBuyProcess
} from '../../../../../types'
import { stepTitleClasses } from '../../../common/classes'
import { ItemCard } from '../../../common/item-card'
import { BuyProcessV2Props } from '../../../common/types'
import { MaintenanceModal, WarrantyModalState } from '../utils/maintenanceModal'

/**
 * Warranty.tsx: this component handles the logic for the USED cars warranty
 * this component doesn't apply to NEW cars
 */

export const Warranty = ({
  state,
  site,
  template
}: Omit<BuyProcessV2Props, 'dispatch'>) => {
  const dispatch = useDispatch()
  const { warranties, warrantyModalContent } =
    template as ContentfulTemplateBuyProcess

  const [modal, setModal] = useState<WarrantyModalState>({
    open: false,
    text: null,
    title: ''
  })

  return (
    <div className='flex flex-col w-full'>
      <p className={`${stepTitleClasses} mb-6`}>
        Extiende la vida de tu vehículo.
      </p>
      {warrantyModalContent && (
        <AtLink
          className='cursor-pointer'
          site={site}
          variant={AtLinkVariants.HORIZONTAL_INFO}
          label='Conoce los principales beneficios de una garantía extendida.'
          onClick={() => {
            setModal({
              open: true,
              text: warrantyModalContent,
              title: 'Beneficios de Garantía extendida'
            })
          }}
        />
      )}

      <div className='mb-6 mt-6 lg:mt-12 flex flex-wrap gap-x-10 gap-y-8 justify-center'>
        {warranties?.map((item) => {
          const price = state.needsFinancing ? item.creditPrice : item.cashPrice
          // const label = state.financing ? 'Precio Crédito' : 'Precio Contado'
          // const value = `${item.title}, ${label} ${price}`

          return (
            <ItemCard
              className='w-[8.25rem] md:w-[16rem] lg:w-[8.25rem] xl:w-[16rem] relative'
              disabled={false}
              key={item.title}
              site={site}
              onClick={() => dispatch(setWarranty(`${item.title}`))}
              selected={state.warranty === `${item.title}`}
            >
              <div className='flex flex-col gap-y-2 items-center'>
                <img
                  className='w-full max-w-[112px] md:max-w-[160px]'
                  src={item.logo.file.url}
                  alt={item.logo.title}
                />
                <p className='text-lg font-bold leading-7'>{item.title}</p>
                <p className='text-lg font-bold leading-7'>{price}</p>
                {item.modalContent && (
                  <AtLink
                    className='cursor-pointer relative z-10'
                    site={site}
                    variant={AtLinkVariants.HORIZONTAL_INFO}
                    label='Ver detalle.'
                    onClick={(e: any) => {
                      e.stopPropagation()
                      setModal({
                        open: true,
                        text: item.modalContent,
                        title: `Beneficios de ${item.title}`
                      })
                    }}
                  />
                )}
              </div>
            </ItemCard>
          )
        })}
      </div>
      <AtButtonLink
        actionValue='#terms-section'
        label='Continuar'
        variant='primary'
        site={site}
        className='self-center w-full md:w-auto mt-'
        disabled={!state.warranty}
        onClick={() => {
          dispatch(next())
          dispatch(
            setMaintenance({
              isComplete: true,
              needsMaintenance: true
            })
          )
        }}
      />
      <hr className='bg-gray-200 my-6' />
      <AtButtonLink
        actionValue='#terms-section'
        label='CONTINUAR SIN GARANTÍA EXTENDIDA'
        variant='primary-text'
        site={site}
        className='self-center'
        onClick={() => {
          dispatch(setWarranty(''))
          dispatch(
            setMaintenance({
              isComplete: true,
              needsMaintenance: false
            })
          )
          dispatch(setMaintenanceSubStep('prev'))
          dispatch(next())
        }}
      />
      <MaintenanceModal site={site} modal={modal} setModal={setModal} />
    </div>
  )
}
