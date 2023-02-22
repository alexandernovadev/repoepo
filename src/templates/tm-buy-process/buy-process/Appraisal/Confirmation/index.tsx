import { useState } from 'react'
import { AtButton, MlHeading } from '@gac/core-components'
import {
  appraisalSimulationSelection,
  previous
} from '../../../../../redux/features/buyProcessSlice'
import { BuyProcessProps, GetReCaptchaTokenFn } from '../../../types'
import {
  selectionButtonsContainerClasses,
  selectionContentClasses
} from '../../../classes'
import { confirmationHeading } from '../../../data'
import { session } from '../../../session'
import { useRouter } from 'next/router'
import { AppraisalResult } from './AppraisalResult'

export const Confirmation = ({
  data,
  dispatch,
  site,
  getReCaptchaToken
}: BuyProcessProps & GetReCaptchaTokenFn) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  return (
    <>
      <div className={selectionContentClasses}>
        <MlHeading {...confirmationHeading(site)} />
        <AppraisalResult
          appraisalResults={data.appraisalSimulation}
          site={site}
        />
        <div className={selectionButtonsContainerClasses}>
          <AtButton
            onClick={async () => {
              setLoading(true)
              try {
                await session(
                  { ...data, hasAcceptedAppraisal: true },
                  site,
                  await getReCaptchaToken()
                )
              } catch (error) {
                console.log(error)
                router.push('/404')
              }
              dispatch(appraisalSimulationSelection(true))
            }}
            variant={'large'}
            disabled={loading}
            label='Si, estoy de acuerdo con la tasación'
            site={site}
            labelClassname='w-[185px] sm:w-full'
          />
          <AtButton
            labelClassname='w-[185px] sm:w-full'
            onClick={() => dispatch(appraisalSimulationSelection(false))}
            variant={'large'}
            label='No, prefiero continuar sin dar mi auto en parte de pago'
            site={site}
          />
        </div>
      </div>
      <div className='flex gap-4'>
        <AtButton
          label='Volver'
          variant='primary-text'
          className='py-2 px-6'
          onClick={() => dispatch(previous())}
          site={site}
        />
      </div>
    </>
  )
}
