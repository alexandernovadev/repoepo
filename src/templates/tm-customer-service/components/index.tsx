import { CustomerServiceFormProps } from '../types'
import { Confirmation } from './Confirmation'
import { CustomerServiceForm } from './Form'

export const CustomerServiceSteps = ({
  state,
  fieldHandler,
  submit,
  site,
  ...selectFields
}: CustomerServiceFormProps) => {
  switch (state.currentStep) {
    case 1:
      return (
        <CustomerServiceForm
          state={state}
          fieldHandler={fieldHandler}
          submit={submit}
          site={site}
          {...selectFields}
        />
      )
    case 2:
      return <Confirmation state={state} site={site} />
    default:
      throw new Error('Invalid position')
  }
}
