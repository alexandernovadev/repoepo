import { createContext, useContext, useState } from 'react'
import {
  authContextDefaultValues,
  complainsBookContextType,
  formsProps,
  Props
} from './types'

const ComplainsBookContext = createContext<complainsBookContextType>(
  authContextDefaultValues
)

export function useComplainsBook() {
  return useContext(ComplainsBookContext)
}

export function ComplainsBookProvider({ children }: Props) {
  const [render, setRender] = useState<string>('forms')
  const [state, setState] = useState<formsProps | any>({
    ...authContextDefaultValues.forms
  })

  const onFormChange = (
    formName: string,
    fieldName: string,
    value: string | {}
  ) => {
    setState({
      ...state,
      [formName]:
        fieldName === 'typeDocument'
          ? {
              ...state[formName],
              [fieldName]: value,
              id: {
                value: '',
                error: false
              }
            }
          : {
              ...state[formName],
              [fieldName]: value
            }
    })
  }

  const value = {
    forms: state,
    onFormChange,
    render: render,
    setRender: setRender,
    error:
      state.personal.typeDocument.length <= 0 ||
      state.personal.id.error ||
      state.personal.id.value.length <= 0 ||
      state.personal.name.length <= 0 ||
      state.personal.address.length <= 0 ||
      state.personal.phone.error ||
      state.personal.email.error ||
      state.contractedGoods.type.length <= 0 ||
      state.contractedGoods.branchOffice.length <= 0 ||
      state.contractedGoods.description.length <= 0 ||
      state.contractedGoods.price.length <= 0 ||
      state.complaints.type.length <= 0 ||
      state.complaints.complaintsOrder.length <= 0 ||
      state.complaints.description.length <= 0
  }

  return (
    <>
      <ComplainsBookContext.Provider value={value}>
        {children}
      </ComplainsBookContext.Provider>
    </>
  )
}
