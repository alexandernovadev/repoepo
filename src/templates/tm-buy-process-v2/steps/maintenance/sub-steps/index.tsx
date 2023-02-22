import { DefaultStep } from './default-step'
import { ContentfulTemplateBuyProcess, Sites } from '../../../../../types'
import { BuyProcessV2State } from '../../../../../redux/features/buyProcessV2Slice'
import { Warranty } from './warranty'

interface MaintenanceSubStepsProps extends Sites {
  state: BuyProcessV2State
  template: ContentfulTemplateBuyProcess
}

export const MaintenanceSubSteps = ({
  state,
  site,
  template
}: MaintenanceSubStepsProps) => {
  const { maintenanceSubStep, car } = state

  switch (maintenanceSubStep) {
    case 0:
      return <DefaultStep site={site} state={state} />

    case 1:
      if (car?.isNew) {
        return <span>Mantenciones prepagadas</span>
      }

      return <Warranty template={template} state={state} site={site} />

    default:
      return null
  }
}
