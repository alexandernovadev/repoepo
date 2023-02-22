import { useState } from 'react'
import { ClientSideOnly } from '../../utils/ClientSideOnly'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useDispatch, useSelector } from 'react-redux'
import { buyProcessV2Selector } from '../../redux/features/buyProcessV2Slice'
import { Loading } from '../../components/Loading'
import { TmBuyProcessProps } from '../tm-buy-process/types'
import { prepareBaseCarData, prepareCardSummary } from './common/data'
import { MlVehicleInfoCard } from '@gac/core-components'
import { DefaultProcess } from './common/default-flow'
import { useReCaptcha } from '../../hooks/useRecaptcha'
import { MobileSummary } from './steps/summary/mobile-summary'
import { useSessionValidation } from './common/use-session-validation'
import { baseClasses } from './common/classes'
import { Summary } from './steps/summary'

export const TmBuyProcessV2 = ({
  site,
  global,
  ...props
}: TmBuyProcessProps) => {
  const dispatch = useDispatch()
  const { onlineStatus } = useOnlineStatus()
  const { ReCaptcha } = useReCaptcha(site, true)
  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState(false)

  const state = useSelector(buyProcessV2Selector)
  const ready = useSessionValidation(state, props.car, global!, site)

  const isSummaryReady = state.currentStep === 9

  return (
    <ClientSideOnly>
      <div
        className={`${baseClasses.baseContainer} ${
          onlineStatus ? 'mt-8 md:mt-12 lg:mt-0' : 'mt-20 md:mt-32 lg:mt-2'
        }`}
      >
        {!ready ? (
          <Loading className='mt-12' />
        ) : (
          <>
            {isSummaryReady ? (
              <Summary state={state} site={site} dispatch={dispatch} />
            ) : (
              <>
                <MobileSummary
                  state={state}
                  site={site}
                  open={isMobileSummaryOpen}
                  className={baseClasses.summaryMargins}
                  onClick={() => setIsMobileSummaryOpen((v) => !v)}
                />
                <div className={baseClasses.processContainer}>
                  <MlVehicleInfoCard
                    {...prepareBaseCarData(state.car!)}
                    summary={prepareCardSummary(state)}
                    className={baseClasses.infoCard}
                    site={site}
                  />
                  <DefaultProcess
                    {...props}
                    state={state}
                    dispatch={dispatch}
                    site={site}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      <ReCaptcha />
    </ClientSideOnly>
  )
}
