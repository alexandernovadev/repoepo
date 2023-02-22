import {
  AtButton,
  AtButtonLink,
  OrForm,
  OrFormVariant
} from '@gac/core-components'
import { useEffect, useMemo } from 'react'
import {
  next,
  setOccupationalData,
  setPersonalData
} from '../../../../../redux/features/buyProcessV2Slice'
import { AtButtonVariant } from '../../../../../types'
import { initFormValues } from '../../../../../utils/initFormValues'
import { getCompanyRequestHeader } from '../../../../../utils/sites'
import { laborForm, personalForm } from '../../../../tm-buy-process/data'
import { Locations } from '../../../../tm-buy-process/types'
import { BuyProcessV2Props } from '../../../common/types'

export const AditionalDataForm = ({
  site,
  state,
  locations,
  dispatch,
  setOpenModal
}: BuyProcessV2Props & Locations & { setOpenModal: Function }) => {
  const { needsFinancing, occupationalData, personalData } = state
  const disabledCondition = needsFinancing
    ? personalData.error || occupationalData.error
    : personalData.error

  // Load initial data from Redux, if available
  const { personalFormData, laborFormData } = useMemo(() => {
    const personalFormData =
      personalData?.fields?.birthDate !== ''
        ? initFormValues(
            personalForm(site, !!needsFinancing, locations, 'v2'),
            personalData?.fields
          )
        : personalForm(site, !!needsFinancing, locations)

    const laborFormData =
      occupationalData?.fields?.activity !== ''
        ? initFormValues(laborForm, occupationalData?.fields)
        : laborForm
    return { personalFormData, laborFormData }
  }, [])

  // If clean state, initialize errors
  useEffect(() => {
    // Go to top
    scrollTo(0, 0)
  }, [])

  return (
    <>
      <p className='  text-xl font-normal leading-7 text-gray-600 mb-9'>
        {needsFinancing
          ? 'Con esta información podremos pre aprobarte en línea y entregarte una estimación más acabada. Recuerda que puedes continuar sin ingresar estos datos.'
          : 'Completa estos datos para continuar'}
      </p>
      {needsFinancing && (
        <div className=' my-8  flex justify-center'>
          <AtButtonLink
            actionValue={'#insurance-section'}
            onClick={() => {
              dispatch(setOccupationalData({}))
              dispatch(setPersonalData({}))
              dispatch(next())
            }}
            site={site}
            label='SALTAR >>'
            variant={AtButtonVariant.PRIMARY_TEXT}
          />
        </div>
      )}

      <OrForm
        {...personalFormData}
        companyId={getCompanyRequestHeader(site).companyId.toString()}
        site={site}
        variant={OrFormVariant.PLAIN}
        submit={(fields, error) => {
          dispatch(setPersonalData({ fields: { ...fields }, error }))
        }}
      />
      {needsFinancing && (
        <OrForm
          className='mt-9'
          variant={OrFormVariant.PLAIN}
          {...laborFormData}
          companyId={getCompanyRequestHeader(site).companyId.toString()}
          submit={(fields, error) => {
            dispatch(setOccupationalData({ fields: { ...fields }, error }))
          }}
          site={site}
        />
      )}
      <div className=' flex justify-center mt-6'>
        {state.needsFinancing ? (
          <AtButton
            label='Continuar'
            variant={'primary'}
            className='py-2 px-6 cursor-pointer'
            onClick={() => setOpenModal(true)}
            disabled={disabledCondition}
            site={site}
          />
        ) : (
          <AtButtonLink
            actionValue={'#insurance-section'}
            label='Continuar'
            variant={'primary'}
            className='py-2 px-6 cursor-pointer'
            onClick={() => dispatch(next())}
            disabled={disabledCondition}
            site={site}
          />
        )}
      </div>
    </>
  )
}
