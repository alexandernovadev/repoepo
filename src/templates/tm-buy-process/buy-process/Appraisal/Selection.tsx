import {
  AtButton,
  MlCardSelectedCar,
  MlCardSelectedCardVariants,
  MlHeading
} from '@gac/core-components'
import {
  appraisalSelection,
  previous
} from '../../../../redux/features/buyProcessSlice'
import {
  selectionButtonsContainerClasses,
  selectionContentClasses
} from '../../classes'
import { appraisalTitleHeading, mapCarCard } from '../../data'
import { BuyProcessProps } from '../../types'

export const Selection = ({
  data: { car },
  dispatch,
  site
}: BuyProcessProps) => (
  <div className={selectionContentClasses}>
    <MlCardSelectedCar
      {...mapCarCard(car!)}
      site={site}
      variant={MlCardSelectedCardVariants.SMALL}
    />
    <MlHeading {...appraisalTitleHeading(site)} />
    <div className={selectionButtonsContainerClasses}>
      <AtButton
        site={site}
        onClick={() => dispatch(appraisalSelection({ isAppraisingCar: true }))}
        variant={'large'}
        label='Sí, quiero tasar mi auto'
      />
      <AtButton
        site={site}
        onClick={() => dispatch(appraisalSelection({ isAppraisingCar: false }))}
        variant={'large'}
        label='No, prefiero continuar'
      />
    </div>
    <AtButton
      label='Volver'
      variant='primary-text'
      className='py-2 px-6'
      onClick={() => dispatch(previous())}
      site={site}
    />
  </div>
)
