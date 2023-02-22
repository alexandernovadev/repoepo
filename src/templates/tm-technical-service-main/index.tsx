import { MlSteps } from '@gac/core-components'
import { steps } from './data'
import { ClientSideOnly } from '../../utils/ClientSideOnly'
import { useDispatch, useSelector } from 'react-redux'
import {
  stepsContainerClasses,
  mainContainerClasses,
  formContainerClasses
} from './classes'
import { TechnicalServiceProcess } from './technical-service-process'
import {
  formatProcess,
  technicalServiceSelector
} from '../../redux/features/technicalServiceSlice'
import { TechnicalServiceProps } from './types'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useReset } from '../../hooks/useReset'

export const TmTechnicalServiceMain = ({
  site,
  template,
  slug
}: TechnicalServiceProps) => {
  const technicalServiceData = useSelector(technicalServiceSelector)
  const dispatch = useDispatch()
  const { currentStep, lastInteraction } = technicalServiceData
  const { onlineStatus } = useOnlineStatus()

  useReset(() => dispatch(formatProcess()), lastInteraction)

  return (
    <ClientSideOnly>
      <div
        className={`${mainContainerClasses} ${
          onlineStatus
            ? 'mt-20 md:mt-[6rem] lg:mt-12'
            : 'mt-32 md:mt-40 lg:mt-14'
        }`}
      >
        <div className={stepsContainerClasses}>
          <MlSteps steps={steps} currentStep={currentStep} site={site} />
        </div>

        <div className={formContainerClasses}>
          <TechnicalServiceProcess
            slug={slug}
            data={technicalServiceData}
            site={site}
            template={template}
          />
        </div>
      </div>
    </ClientSideOnly>
  )
}
