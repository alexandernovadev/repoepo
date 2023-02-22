import { useEffect, useMemo } from 'react'
import { AtButton } from '@gac/core-components'
import { ConfirmationIcon } from './ConfirmationIcon'
import {
  confirmationContainerClasses,
  formTitleClasses,
  siteClasses
} from '../classes'
import { ConfirmationProps } from '../types'

export const Confirmation = ({
  state: { email },
  site,
  button
}: ConfirmationProps) => {
  useEffect(() => {
    scroll(0, 0)
  }, [])

  const SiteClasses = useMemo(() => siteClasses(site), [site])

  return (
    <div className={`${confirmationContainerClasses} mb-12 md:mb-10 lg:mb-12`}>
      <h2 className={formTitleClasses}>¡Hemos recibido tus datos!</h2>

      <span className={SiteClasses.iconWrapper}>
        <ConfirmationIcon />
      </span>
      <p className='text-gray-600 leading-6'>
        A tu correo{' '}
        <span className={`font-medium ${SiteClasses.email}`}>{email}</span>{' '}
        recibirás un resumen de tu consulta, ya nos contactaremos contigo
      </p>
      {button?.show && (
        <AtButton
          site={site}
          label={button.label}
          variant={button.variant}
          onClick={button.onClick}
        />
      )}
    </div>
  )
}
