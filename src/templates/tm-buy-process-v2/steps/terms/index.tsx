import { BLOCKS, Document } from '@contentful/rich-text-types'
import {
  AtButton,
  AtButtonLink,
  MlRichText,
  MlRichTextVariant,
  MlStepCard
} from '@gac/core-components'
import { useState } from 'react'
import {
  jump,
  next,
  setIsFinancingPreApproved
} from '../../../../redux/features/buyProcessV2Slice'
import { stepTitleClasses } from '../../common/classes'
import { GetColorList } from '../../common/getListColorByModel'
import { BuyProcessV2Props } from '../../common/types'
import { useStockAvailable } from '../../hooks/useStockAvailable'
import { getPreApprovalResponse } from '../financing/api/simulation'
import { CheckBoxTerms } from './CheckBoxTerms'
import { ModalTerms } from './ModalTerms'
import { validation } from './validation'

export const Terms = ({
  dispatch,
  site,
  template,
  state,
  car
}: BuyProcessV2Props) => {
  const { disabled, active, completed } = validation(state)
  const [isOpen, setisOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const firstClauseTerms: Document = {
    data: {},
    nodeType: BLOCKS.DOCUMENT,
    content: [template!.terms.text.content[0], template!.terms.text.content[1]]
  }

  const preAprobationFinancing = async () => {
    setLoading(true)
    try {
      const isFinancingPreApproved = await getPreApprovalResponse(
        state,
        site,
        template!.locations
      )
      dispatch(setIsFinancingPreApproved(isFinancingPreApproved))
      dispatch(next())
    } catch (error) {
      console.log(error)
      // router.push('/404')
      dispatch(next())
    }
    setLoading(false)
  }

  const { stockCar } = useStockAvailable(state.car?.isNew, car!, site, dispatch)

  const isColorAvailable = GetColorList(
    stockCar,
    state.version.selectedId,
    car?.contentfulColors
  )

  return (
    <>
      <MlStepCard
        idSection={'terms-section'}
        title='Términos y condiciones'
        active={active}
        disabled={disabled}
        completed={completed}
        onEdit={() => dispatch(jump(7))}
        site={site}
      >
        <p className={stepTitleClasses}>
          Lee atentamente lo indicado y acepta los términos y condiciones para
          continuar Completa los datos solicitados
        </p>
        <MlRichText
          text={firstClauseTerms}
          site={site}
          variant={MlRichTextVariant.TERMS_AND_CONDITIONS}
        />
        <div className='flex flex-col justify-center mb-12'>
          <AtButton
            label='SEGUIR LEYENDO'
            variant='primary-text'
            site={site}
            className='self-center'
            onClick={() => setisOpen(true)}
          />
          <CheckBoxTerms
            state={state}
            dispatch={dispatch}
            site={site}
            template={template}
          />
        </div>
        <hr className='bg-gray-200' />
        <div className='flex flex-col justify-center mt-8 gap-8 content-center'>
          {completed && (
            <p className='text-gray-900 text-center'>
              Términos y condiciones aceptadas
            </p>
          )}
          <AtButtonLink
            actionValue={
              stockCar.length === 0 || isColorAvailable?.length === 0
                ? ''
                : '#payment-section'
            }
            label='Continuar'
            variant={loading ? 'loading' : 'primary'}
            site={site}
            className='self-center w-full md:w-auto'
            disabled={!completed}
            onClick={() =>
              stockCar.length === 0 || isColorAvailable?.length === 0
                ? dispatch(jump(9))
                : preAprobationFinancing()
            }
          />
        </div>
      </MlStepCard>
      <ModalTerms
        state={state}
        dispatch={dispatch}
        site={site}
        template={template}
        isOpen={isOpen}
        onClose={setisOpen}
      />
    </>
  )
}
