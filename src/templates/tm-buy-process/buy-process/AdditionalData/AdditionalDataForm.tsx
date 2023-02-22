import { AtButton, MlHeading, MlModal, OrForm } from '@gac/core-components'
import { useEffect, useMemo, useState } from 'react'
import {
  next,
  previous,
  skipFinancingForm,
  skipNotImplemented,
  updateOccupationalData,
  updatePersonalData,
  updatePersonalFinancingData
} from '../../../../redux/features/buyProcessSlice'
import { AtButtonVariant } from '../../../../types'
import { isObjectEmpty } from '../../../../utils/isObjectEmpty'
import { selectionContentClasses } from '../../classes'
import { headingFormTitle, laborForm, personalForm } from '../../data'
import { initFormValues } from '../../../../utils/initFormValues'
import { BuyProcessProps, GetReCaptchaTokenFn, Locations } from '../../types'
import { session } from '../../session'
import { useRouter } from 'next/router'
import { getCompanyRequestHeader } from '../../../../utils/sites'

export const AdditionalDataForm = ({
  data,
  dispatch,
  site,
  needsFinancing,
  locations,
  getReCaptchaToken
}: BuyProcessProps & Locations & GetReCaptchaTokenFn) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { contact } = data
  const [personalFormError, , laborFormError, personalFinancingError] =
    contact!['errors']!
  const disabledCondition = needsFinancing
    ? personalFinancingError || laborFormError
    : personalFormError

  const [openModal, setOpenModal] = useState<boolean>(false)

  // Load initial data from Redux, if available
  const { personalFormData, laborFormData, personalFinancingFormData } =
    useMemo(() => {
      const personalFormData = !isObjectEmpty(contact?.personalData)
        ? initFormValues(
            personalForm(site, !!needsFinancing, locations),
            contact?.personalData
          )
        : personalForm(site, !!needsFinancing, locations)

      const laborFormData = !isObjectEmpty(contact?.occupationalData)
        ? initFormValues(laborForm, contact?.occupationalData)
        : laborForm

      const personalFinancingFormData = !isObjectEmpty(
        contact?.personalFinancingData
      )
        ? initFormValues(
            personalForm(site, !!needsFinancing, locations),
            contact?.personalFinancingData
          )
        : personalForm(site, !!needsFinancing, locations)

      return { personalFormData, laborFormData, personalFinancingFormData }
    }, [needsFinancing])

  const getPersonalFormData = useMemo(() => {
    if (needsFinancing) {
      return { ...personalFinancingFormData }
    }

    return { ...personalFormData }
  }, [needsFinancing])

  // If clean state, initialize errors
  useEffect(() => {
    // Go to top
    scroll(0, 0)

    if (isObjectEmpty(contact?.personalData)) {
      dispatch(updatePersonalData({ error: true }))
    }
    if (isObjectEmpty(contact?.personalFinancingData)) {
      dispatch(updatePersonalFinancingData({ error: true }))
    }
    if (isObjectEmpty(contact?.occupationalData)) {
      dispatch(updateOccupationalData({ error: true }))
    }
  }, [])

  return (
    <div className={selectionContentClasses}>
      <MlHeading {...headingFormTitle(!!needsFinancing, site)} />
      {needsFinancing && (
        <AtButton
          site={site}
          label='SALTAR >>'
          onClick={() => dispatch(skipFinancingForm())}
          variant={AtButtonVariant.PRIMARY_TEXT}
        />
      )}
      <OrForm
        {...getPersonalFormData}
        companyId={getCompanyRequestHeader(site).companyId.toString()}
        submit={(fields, error) => {
          dispatch(
            needsFinancing
              ? updatePersonalFinancingData({ fields, error })
              : updatePersonalData({ fields, error })
          )
        }}
        site={site}
      />
      {needsFinancing && (
        <OrForm
          {...laborFormData}
          companyId={getCompanyRequestHeader(site).companyId.toString()}
          submit={(fields, error) =>
            dispatch(updateOccupationalData({ fields, error }))
          }
          site={site}
        />
      )}
      <div className='flex gap-4'>
        <AtButton
          label='Volver'
          variant='primary-text'
          className='py-2 px-6'
          onClick={() =>
            dispatch(site === 'WI' ? skipNotImplemented(true) : previous())
          }
          site={site}
        />
        <AtButton
          label='Continuar'
          variant={loading ? 'loading' : 'primary'}
          className='py-2 px-6'
          onClick={async () => {
            if (needsFinancing) {
              setOpenModal(true)
            } else {
              setLoading(true)
              try {
                await session(data, site, await getReCaptchaToken())
              } catch (error) {
                console.log(error)
                router.push('/404')
              }
              dispatch(next())
            }
          }}
          disabled={disabledCondition}
          site={site}
        />
      </div>
      <MlModal
        containerClassName=' max-w-[500px] !p-6'
        title='Atención'
        onCloseClick={() => setOpenModal(false)}
        site={site}
        isOpen={openModal}
      >
        <p className=' text-base font-normal leading-6 text-gray-500'>
          En el paso final realizaremos tu solicitud de pre-aprobación de
          crédito
        </p>
        <div className=' flex justify-center mt-6'>
          <AtButton
            site={site}
            label='Aceptar'
            onClick={async () => {
              setOpenModal(false)
              setLoading(true)
              try {
                await session(data, site, await getReCaptchaToken())
              } catch (error) {
                console.log(error)
                router.push('/404')
              }
              dispatch(next())
            }}
          />
        </div>
      </MlModal>
    </div>
  )
}
