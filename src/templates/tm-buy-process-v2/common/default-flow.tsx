import { useReCaptcha } from '../../../hooks/useRecaptcha'
import { AdditionalData } from '../steps/additional-data'
import { Appraisal } from '../steps/appraisal'
import { Contact } from '../steps/contact'
import { Financing } from '../steps/financing'
import { Insurance } from '../steps/insurance'
import { Maintenance } from '../steps/maintenance'
import { Payment } from '../steps/payment'
import { Terms } from '../steps/terms'
import { Version } from '../steps/version'
import { BuyProcessV2Props } from './types'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useMaintenanceByCarProps } from '../hooks/useMaintenanceCar'

export const DefaultProcess = (props: BuyProcessV2Props) => {
  const router = useRouter()
  const { getReCaptchaToken } = useReCaptcha(props.site, true)
  const { renderMaintenanceByCarProps } = useMaintenanceByCarProps({
    car: props.state.car!
  })

  useEffect(() => {
    const selectedSession = router.asPath.substring(
      router.asPath.lastIndexOf('#') + 1
    )

    if (selectedSession) {
      document.getElementById(selectedSession)?.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }, [])

  return (
    <div className='w-full lg:w-1/2 flex flex-col gap-4'>
      <Version {...props} />
      <Contact {...props} />
      <Appraisal {...props} />
      <Financing {...props} getReCaptchaToken={getReCaptchaToken} />
      <AdditionalData {...props} />
      <Insurance
        {...props}
        renderMaintenanceByCarProps={renderMaintenanceByCarProps}
      />
      <Maintenance
        {...props}
        renderMaintenanceByCarProps={renderMaintenanceByCarProps}
      />
      <Terms {...props} />
      <Payment {...props} />
    </div>
  )
}
