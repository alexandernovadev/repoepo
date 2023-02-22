import { useEffect, useState } from 'react'
import { AtInput, AtInputDropdown, AtTextArea } from '@gac/core-components'
import { fetchWithoutToken } from '../../../../utils/fetch'
import { AtInputVariant } from '../../../tm-pdp/common/form-quote/types'
import { ChooseButton } from '../../choose-button'
import { FormsClasses } from '../../classes'
import { useComplainsBook } from '../../context/complainstBookContext'
import { ContractedGoodsProps } from '../../types'
import { ContractedGoodsButtonsData } from './data'
import { getFormatBranchOffice } from '../utils'

export const ContractedGoodsForm = ({ site }: ContractedGoodsProps) => {
  const { forms, onFormChange } = useComplainsBook()
  const [branchOffices, setBranchOffices] = useState([])

  const getBranchOffices = async () => {
    try {
      const response = await fetchWithoutToken(
        'customer/api/branch-office',
        site
      )
      setBranchOffices(getFormatBranchOffice(response))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getBranchOffices()
  }, [])

  return (
    <form className={`${FormsClasses.cardContainer} gap-10`}>
      <h3 className={FormsClasses.title}>Identificación del bien contratado</h3>
      <ChooseButton
        site={site}
        buttonsData={ContractedGoodsButtonsData}
        activeButton={forms?.contractedGoods?.type}
        setActiveButton={(label: string) => {
          onFormChange('contractedGoods', 'type', label)
        }}
      />
      <AtInputDropdown
        selectedValue={forms?.contractedGoods?.branchOffice ?? ''}
        handleChange={(e) => onFormChange('contractedGoods', 'branchOffice', e)}
        placeholder='Sucursal'
        options={branchOffices}
        disabled={false}
        site={site}
        optionsClassName='max-h-48 overflow-y-auto'
        helpText='Indique la sucursal donde fue atentido'
        className={FormsClasses.inputDropdown}
        containerClassname='w-full'
      />
      <AtInput
        selectedValue={
          forms?.contractedGoods?.price.length > 0
            ? `S/${parseInt(forms?.contractedGoods?.price).toLocaleString(
                'es-CL'
              )}`
            : ''
        }
        handleChange={({ value }) => {
          const rawValue = value.replace(/(^S\/)|(\.)/g, '')
          const isNumber = /^[0-9]{1,8}$/.test(rawValue)
          if (isNumber || !rawValue) {
            onFormChange('contractedGoods', 'price', rawValue)
          }
        }}
        variant={AtInputVariant.DEFAULT}
        id='price'
        placeholder='Monto reclamado (S/)'
        error={false}
        disabled={false}
        site={site}
        helpText='Ingrese la cantidad en Soles peruanos'
        className='w-full'
      />
      <AtTextArea
        value={forms?.contractedGoods?.description ?? ''}
        handleChange={({ value }) => {
          onFormChange('contractedGoods', 'description', value)
        }}
        id='description'
        className={`${FormsClasses.inputTextArea} min-h-[13.5rem]`}
        containerClassName='!w-full md:w-auto'
        placeholder='Descripción'
        disabled={false}
        site={site}
        helpText='Indique los detalles del bien contratado'
      />
    </form>
  )
}
