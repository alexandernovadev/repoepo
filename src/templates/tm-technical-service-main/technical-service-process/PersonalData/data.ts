import { OrForm } from '@gac/core-components'
import { ComponentProps } from 'react'

// @ts-expect-error
export const contactForm: ComponentProps<typeof OrForm> = {
  id: 'contact-data',
  fields: [
    {
      placeholder: 'Nombre y apellido',
      id: 'name',
      required: true,
      type: 'text',
      maxLength: 60
    },
    {
      placeholder: 'Teléfono',
      id: 'phone',
      required: true,
      type: 'phone'
    },
    {
      placeholder: 'Correo electrónico',
      id: 'email',
      required: true,
      type: 'email',
      maxLength: 80
    }
  ]
}
