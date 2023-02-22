import { AppraisalForm } from '../../../../tm-buy-process/buy-process/Appraisal/FormProcess/AppraisalForm'
import { PatentSearchForm } from '../../../../tm-buy-process/buy-process/Appraisal/FormProcess/PatentSearchForm'
import { useAppraisalController } from '../../../../tm-buy-process/buy-process/Appraisal/FormProcess/useAppraisalController'
import { curveBezierStyle } from '../../../common/classes'
import { BuyProcessV2Props } from '../../../common/types'
import { useAnimationOpen } from '../../../hooks/useAnimationOpen'

export const FormAppraisal = ({ state, site }: BuyProcessV2Props) => {
  const {
    handler,
    hasMissingField,
    isUploading,
    optionsCallback,
    selectState,
    setEmailValid,
    submitHandler
  } = useAppraisalController(state.appraisal, state.contact.fields, site, true)

  const { animation } = useAnimationOpen()

  return (
    <div
      className={`${animation} my-12 transition-all duration-1000`}
      style={curveBezierStyle}
    >
      <PatentSearchForm
        patent={state.appraisal.patent}
        action={optionsCallback}
        disabled={isUploading}
        setPatent={(value) => {
          handler({ name: 'patent', value })
        }}
        site={site}
      />
      <hr className='bg-gray-200 my-8' />
      <AppraisalForm
        className='gap-8'
        buttonText='Tasar mi auto'
        hasMissingField={hasMissingField}
        submitHandler={submitHandler}
        appraisal={state.appraisal}
        handler={handler}
        isUploading={isUploading}
        selectState={selectState}
        setEmailValid={setEmailValid}
        site={site}
      />
    </div>
  )
}
