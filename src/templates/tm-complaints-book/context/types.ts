import { Dispatch, ReactNode, SetStateAction } from 'react'
import { ComplainstButtonsData } from '../forms/complaints/data'
import { ContractedGoodsButtonsData } from '../forms/contracted-goods/data'

export interface formsProps {
  personal: {
    typeDocument: string,
    id: {
      value: string,
      error: boolean
    },
    name: string,
    address: string,
    phone: {
      value: string,
      name: string,
      error: boolean
    },
    email: {
      value: string,
      name: string,
      error: boolean
    }
  },
  contractedGoods: {
    type: string,
    branchOffice: string,
    price: string,
    description: string
  },
  complaints: {
    type: string,
    description: string,
    complaintsOrder: string
  }
}

export interface complainsBookContextType {
  forms: formsProps,
  render: string,
  onFormChange: (
    formName: string,
    fieldName: string,
    value: string | {}
  ) => void
  setRender: Dispatch<SetStateAction<string>>,
  error: boolean
}

export type Props = {
  children: ReactNode
}

export const authContextDefaultValues: complainsBookContextType = {
  forms: {
    personal: {
      typeDocument: '',
      id: {
        value: '',
        error: true
      },
      name: '',
      address: '',
      phone: {
        value: '',
        name: '',
        error: true
      },
      email: {
        value: '',
        name: '',
        error: true
      }
    },
    contractedGoods: {
      type: ContractedGoodsButtonsData.options[0].label,
      branchOffice: '',
      price: '',
      description: ''
    },
    complaints: {
      type: ComplainstButtonsData.options[0].label,
      description: '',
      complaintsOrder: ''
    }
  },
  render: 'forms',
  onFormChange: () => {},
  setRender: () => {},
  error: true
}