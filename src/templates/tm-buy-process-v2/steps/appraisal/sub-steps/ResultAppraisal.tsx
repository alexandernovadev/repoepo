import { AtButtonLink } from '@gac/core-components'
import {
  AppraisalSelection,
  next,
  setAppraisalSelection
} from '../../../../../redux/features/buyProcessV2Slice'
import { AppraisalResult } from '../../../../tm-buy-process/buy-process/Appraisal/Confirmation/AppraisalResult'
import { curveBezierStyle } from '../../../common/classes'
import { BuyProcessV2Props } from '../../../common/types'
import { useAnimationOpen } from '../../../hooks/useAnimationOpen'
import { ResultTypeText } from './ResultTypeText'

// TODO: Add event schedule (requires backend)
export const ResultAppraisal = ({
  state: { appraisalResults },
  dispatch,
  site
}: BuyProcessV2Props) => {
  const { animation } = useAnimationOpen()

  return (
    <div
      className={`${animation} flex flex-col gap-6 items-center mb-6`}
      style={curveBezierStyle}
    >
      <ResultTypeText rejected={appraisalResults === null} site={site} />
      {appraisalResults && (
        <>
          <AppraisalResult appraisalResults={appraisalResults} site={site} />
          {/* TODO: HERE COMPONENT SHEDULE AND VALIDATE */}
          <AtButtonLink
            actionValue='#financing-section'
            label='Aceptar tasación'
            variant='primary'
            onClick={() => {
              dispatch(setAppraisalSelection(AppraisalSelection.ACCEPTED))
              dispatch(next())
            }}
            site={site}
          />
        </>
      )}
    </div>
  )
}
