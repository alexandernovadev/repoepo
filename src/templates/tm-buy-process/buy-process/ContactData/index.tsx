import {
  AtButton,
  MlCardSelectedCar,
  MlCardSelectedCardVariants,
  MlHeading,
  OrForm
} from '@gac/core-components'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import {
  next,
  skipNotImplemented,
  updateContactData
} from '../../../../redux/features/buyProcessSlice'
import { isObjectEmpty } from '../../../../utils/isObjectEmpty'
import { selectionContentClasses } from '../../classes'
import { appraisalTitleHeading, contactForm, mapCarCard } from '../../data'
import { initFormValues } from '../../../../utils/initFormValues'
import { BuyProcessProps, GetReCaptchaTokenFn } from '../../types'
import { session } from '../../session'
import { getCompanyRequestHeader } from '../../../../utils/sites'

export const ContactData = ({
  data: { contact, car, ...data },
  dispatch,
  site,
  getReCaptchaToken,
  locations
}: BuyProcessProps & GetReCaptchaTokenFn) => {
  const [loading, setLoading] = useState(false)

  const [, , , , contactFormError] = contact.errors

  // Load initial data from Redux, if available
  const contactFormData = useMemo(() => {
    // If car is used, branchOffice will be already selected, since it's a single value, otherwise let user decide which branch office to use
    const branchOfficeSolver = car?.isNew
      ? () =>
          Promise.resolve(
            car.newCarBranches!.map(
              (branch) => branch.name + ', ' + branch.commune
            )
          )
      : undefined

    return isObjectEmpty(contact.contactData)
      ? contactForm(site, branchOfficeSolver, locations)
      : initFormValues(
          contactForm(site, branchOfficeSolver, locations),
          contact.contactData
        )
  }, [])

  // If clean state, initialize errors
  useEffect(() => {
    if (isObjectEmpty(contact.contactData)) {
      dispatch(updateContactData({ error: true }))
    }
  }, [])

  const router = useRouter()

  return (
    <div className={selectionContentClasses}>
      <MlCardSelectedCar
        {...mapCarCard(car!)}
        site={site}
        variant={MlCardSelectedCardVariants.SMALL}
      />
      <MlHeading
        {...appraisalTitleHeading(site)}
        title='Datos de contacto'
        description='Ingresa tus datos de contacto para realizar una cotización en línea y ser atendido por un ejecutivo'
      />
      <OrForm
        {...contactFormData}
        companyId={getCompanyRequestHeader(site).companyId.toString()}
        submit={(fields, error) =>
          dispatch(updateContactData({ fields, error }))
        }
      />
      <div className='flex gap-4'>
        <AtButton
          label='Volver'
          variant='primary-text'
          className='py-2 px-6'
          onClick={() => router.push(`vehicle/${car?.id}`)}
          site={site}
          disabled={true}
        />
        <AtButton
          label='Continuar'
          variant={loading ? 'loading' : 'primary'}
          className='py-2 px-6'
          onClick={async () => {
            setLoading(true)
            try {
              await session(
                { ...data, contact, car },
                site,
                await getReCaptchaToken()
              )
            } catch (error) {
              console.log(error)
              router.push('/404')
            }
            dispatch(site === 'WI' ? skipNotImplemented(false) : next())
          }}
          disabled={contactFormError || loading}
          site={site}
        />
      </div>
    </div>
  )
}
