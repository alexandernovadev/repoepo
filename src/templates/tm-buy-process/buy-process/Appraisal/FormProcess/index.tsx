import {
  AtButton,
  MlHeading,
} from '@gac/core-components'
import {
  formProcessContainerClasses,
  selectionContentClasses
} from '../../../classes'
import { appraisalFormHeading } from '../../../data'
import { BuyProcessProps } from '../../../types'
import { PatentSearchForm } from './PatentSearchForm'

import { previous } from '../../../../../redux/features/buyProcessSlice'
import { useAppraisalController } from './useAppraisalController'
import { AppraisalForm } from './AppraisalForm'
import { ModalErrorApraisal } from './ModalErrorApraisal'

export const FormProcess = ({
  data: { appraisal, contact },
  dispatch,
  site
}: BuyProcessProps) => {
  const { patent } = appraisal


  const {
    handler,
    hasMissingField,
    isUploading,
    optionsCallback,
    selectState,
    setEmailValid,
    submitHandler,
    isApraisalError, 
    setIsApraisalError
  } = useAppraisalController(appraisal, contact.contactData, site)

  return (
    <div className={selectionContentClasses}>
      <MlHeading {...appraisalFormHeading(site)} />
      <div className={formProcessContainerClasses}>
        <PatentSearchForm
          patent={patent}
          setPatent={(value) => handler({ name: 'patent', value })}
          site={site}
          action={optionsCallback}
          disabled={isUploading}
        />
        <hr className='bg-gray-200 w-full md:w-[44rem] lg:w-[48rem]' />
        <AppraisalForm
          appraisal={appraisal}
          handler={handler}
          hasMissingField={hasMissingField}
          submitHandler={submitHandler}
          isUploading={isUploading}
          selectState={selectState}
          setEmailValid={setEmailValid}
          site={site}
        />
      </div>
      <AtButton
        label='Volver'
        variant='primary-text'
        className='py-2 px-6'
        onClick={() => dispatch(previous())}
        site={site}
      />

      <ModalErrorApraisal
        site={site}
        isOpenModalError={isApraisalError}
        setIsOpenModalError={setIsApraisalError}
      />
    </div>
  )
}
