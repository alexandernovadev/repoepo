import {
  AtButtonLink,
  MlStepCard,
  OrForm,
  OrFormVariant
} from '@gac/core-components'
import { BuyProcessV2Props } from '../../common/types'
import {
  setContact,
  next,
  jump
} from '../../../../redux/features/buyProcessV2Slice'
import { useMemo } from 'react'
import { contactForm } from '../../../tm-buy-process/data'
import { initFormValues } from '../../../../utils/initFormValues'
import { validation } from './validation'
import { stepTitleClasses } from '../../common/classes'
import { getCompanyRequestHeader } from '../../../../utils/sites'

/**
 * Form containing contact data, also used for Test Drive (which will go later, not to be implemented now)
 */
export const Contact = ({
  state,
  dispatch,
  site,
  template
}: BuyProcessV2Props) => {
  const { active, disabled, completed } = validation(state)

  const contactFormData = useMemo(() => {
    const { car } = state

    if (active) {
      const branchOfficeSolver = car?.isNew
        ? () =>
            Promise.resolve(
              car?.newCarBranches!.map(
                (branch) => branch.name + ', ' + branch.commune
              )
            )
        : undefined

      return initFormValues(
        contactForm(site, branchOfficeSolver, template?.locations),
        state.contact.fields
      )
    }
  }, [active])

  return (
    <MlStepCard
      active={active}
      disabled={disabled}
      completed={completed}
      title='Datos de contacto'
      onEdit={() => dispatch(jump(1))}
      site={site}
      idSection={'contact-section'}
    >
      <p className={`${stepTitleClasses} mb-6`}>
        Completa los datos solicitados
      </p>
      <OrForm
        variant={OrFormVariant.PLAIN}
        {...contactFormData!}
        companyId={getCompanyRequestHeader(site).companyId.toString()}
        submit={(fields: any, error: any) => {
          dispatch(setContact({ fields: { ...fields }, error }))
        }}
      />
      <div className='flex justify-center mt-6'>
        <AtButtonLink
          actionValue='#appraisal-section'
          label='Continuar'
          variant='primary'
          site={site}
          className='self-center'
          disabled={!completed || state.contact.error}
          onClick={() => {
            dispatch(next())
          }}
        />
      </div>
    </MlStepCard>
  )
}
