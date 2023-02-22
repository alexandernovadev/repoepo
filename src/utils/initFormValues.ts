import { ComponentProps } from 'react'
import { OrForm } from '@gac/core-components'

/**
 * Inject initial values to an OrForm props object
 * @param formProps OrForm props containing no initialValue property for each field
 * @param values Object with initial values
 */
export const initFormValues = (
  formProps: ComponentProps<typeof OrForm>,
  values: { [field: string]: string | Date | boolean }
): ComponentProps<typeof OrForm> => ({
  ...formProps,
  fields: formProps.fields.map((field) => {
    let initialValue

    if (values[field.id]) {
      if (field.type === 'date') {
        initialValue = new Date(values[field.id] as Date)
      } else {
        initialValue = values[field.id]
      }
    }

    return {
      ...field,
      initialValue
    }
  })
})
