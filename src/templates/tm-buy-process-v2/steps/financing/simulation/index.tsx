import { MlModal, OrSimulation } from '@gac/core-components'
import { OrSimulationCreditType } from '@gac/core-components/lib/atomic-components-react/components/UI/organism/or-simulation/types'
import { useMemo, useRef, useState } from 'react'
import { useSimulation } from '../../../../../hooks/useSimulation'
import { updateFinancingSimulation } from '../../../../../redux/features/buyProcessV2Slice'
import { AtButtonActionType, Target } from '../../../../../types'
import { formatFinancingPrice } from '../../../../../utils/formatFinancingPrice'
import { Currencies } from '../../../../../utils/formatPrice'
import {
  HigherAppraisalAlert,
  LowerAppraisalAlert,
  MediumAppraisalAlert
} from '../../../../tm-buy-process/buy-process/Financing/Simulation/alerts'
import { GetReCaptchaTokenFn } from '../../../../tm-buy-process/types'
import { Details } from '../../../../tm-pdp/common/simulation/details'
import { SimulationProps } from './types'

export const Simulation = ({
  site,
  state,
  smartFinancingMinimumYear = 0,
  conventionalFinancingFeatures = [],
  smartFinancingFeatures = [],
  conventionalFinancingMinimumYear = 0,
  termsAndConditionsUrl,
  dispatch,
  onCloseClick
}: SimulationProps & GetReCaptchaTokenFn) => {
  const [showDetails, setShowDetails] = useState(false)

  const currency = state?.car?.price?.currency ?? Currencies.CLP
  const carName = `${state.car?.brand ?? ''} ${state.car?.model ?? ''}`

  const smartFinancingPrice = !state.car!.isNew
    ? state?.car?.price?.priceSC ?? state?.car?.price?.listPrice ?? 0
    : +state.version.priceSmart ?? 0

  const conventionalFinancingPrice = !state.car!.isNew
    ? state?.car?.price?.priceCC ?? state?.car?.price?.listPrice ?? 0
    : +state.version.priceConvensional ?? 0

  const insuranceSectionAnchor = useRef(null)

  const creditTypes = useMemo(() => {
    const newCreditTypes = [] as OrSimulationCreditType[]
    const carYear = parseInt(
      state.car!.features.find((f) => f.id === 'year')?.label ?? '0',
      10
    )

    if (
      state.car!.isNew ||
      (!state.car!.isNew && carYear >= smartFinancingMinimumYear)
    ) {
      newCreditTypes.push({
        label: 'Crédito inteligente',
        id: 0,
        features: smartFinancingFeatures
      })
    }

    if (
      state.car!.isNew ||
      (!state.car!.isNew && carYear >= conventionalFinancingMinimumYear)
    ) {
      newCreditTypes.push({
        label: 'Crédito convencional',
        id: 1,
        features: conventionalFinancingFeatures
      })
    }

    return newCreditTypes
  }, [
    smartFinancingFeatures,
    conventionalFinancingFeatures,
    smartFinancingMinimumYear,
    conventionalFinancingMinimumYear
  ])
  const [simulationResults, setSimulation] = useSimulation({
    financing: true,
    car: !state.car!.isNew
      ? state.car?.id ?? ''
      : state.version.carVersionID ?? '',
    initialCreditType: creditTypes[0]?.id,
    site
  })

  const carPrice =
    simulationResults.selectedCreditType === 0
      ? smartFinancingPrice
      : conventionalFinancingPrice

  const calculatedInitialPaymentValue =
    carPrice * (simulationResults.initialPaymentDisplayPercentage / 100)

  const carAsPayment = useMemo(() => {
    if (
      !state.appraisalResults?.suggestedPrice ||
      !state.isAppraisingCar ||
      !state.hasAcceptedAppraisal
    ) {
      return null
    } else if (state.appraisalResults.suggestedPrice < carPrice * 0.2) {
      return {
        alert: (
          <LowerAppraisalAlert
            appraisal={state.appraisalResults.suggestedPrice}
            minInitial={carPrice * 0.2}
            maxInitial={carPrice * 0.5}
            currency={currency}
            hasAcceptedAppraisal={state.hasAcceptedAppraisal}
          />
        ),
        carValue: formatFinancingPrice(
          state.appraisalResults.suggestedPrice,
          currency
        ),
        additionalContribution: formatFinancingPrice(
          calculatedInitialPaymentValue - state.appraisalResults.suggestedPrice,
          currency
        )
      }
    } else if (
      state.appraisalResults.suggestedPrice >= carPrice * 0.2 &&
      state.appraisalResults.suggestedPrice <= carPrice * 0.5
    ) {
      const diff =
        calculatedInitialPaymentValue - state.appraisalResults.suggestedPrice
      return {
        alert: (
          <MediumAppraisalAlert
            appraisal={state.appraisalResults.suggestedPrice}
            minInitial={carPrice * 0.2}
            maxInitial={carPrice * 0.5}
            currency={currency}
            hasAcceptedAppraisal={state.hasAcceptedAppraisal}
          />
        ),
        carValue: formatFinancingPrice(
          state.appraisalResults.suggestedPrice,
          currency
        ),
        additionalContribution:
          diff > 0 ? formatFinancingPrice(diff, currency) : '',
        refundAmount: diff < 0 ? formatFinancingPrice(-diff, currency) : ''
      }
    } else {
      return {
        alert: (
          <HigherAppraisalAlert
            appraisal={state.appraisalResults.suggestedPrice}
            minInitial={carPrice * 0.2}
            maxInitial={carPrice * 0.5}
            currency={currency}
            hasAcceptedAppraisal={state.hasAcceptedAppraisal}
          />
        ),
        carValue: formatFinancingPrice(
          state.appraisalResults.suggestedPrice,
          currency
        ),
        refundAmount: formatFinancingPrice(
          state.appraisalResults.suggestedPrice - calculatedInitialPaymentValue,
          currency
        )
      }
    }
  }, [
    state.appraisalResults?.suggestedPrice,
    carPrice,
    calculatedInitialPaymentValue
  ])

  const formattedCarPrice = formatFinancingPrice(carPrice, currency)

  const formattedInitialPaymentValue = formatFinancingPrice(
    calculatedInitialPaymentValue,
    currency
  )

  const formattedMonthlyFee = simulationResults.simulation?.duesValue
    ? formatFinancingPrice(simulationResults.simulation.duesValue, currency)
    : ''
  const formattedCreditTotalCost = simulationResults.simulation?.totalCredit
    ? formatFinancingPrice(simulationResults.simulation.totalCredit, currency)
    : ''
  const formattedCaePercentage = simulationResults.simulation?.annualEquivalency
    ? `${simulationResults.simulation.annualEquivalency.toString()}%`
    : ''
  const formattedRenovationPlanCost =
    simulationResults.simulation?.guaranteedFutureValue &&
    simulationResults.selectedCreditType === 0
      ? formatFinancingPrice(
          simulationResults.simulation.guaranteedFutureValue,
          currency
        )
      : ''
  return (
    <>
      {' '}
      <p className=' ml-3 text-xl leading-7'>Confirma tu simulación</p>
      <p className=' ml-3 text-base  text-gray-600 leading-6  mb-6 '>
        Con estos datos evaluaremos la pre-aprobación de tu crédito
      </p>
      <a
        href='#additionalData-section'
        className='hidden'
        ref={insuranceSectionAnchor}
      ></a>
      <OrSimulation
        site={site}
        className='!m-0  !p-0 !px-4 !w-full'
        loading={simulationResults.isLoading}
        financing={true}
        creditTypes={creditTypes}
        handleCreditTypeChange={(newCreditType) =>
          setSimulation({ selectedCreditType: newCreditType })
        }
        termsAndConditionsButton={{
          label: 'Ver los requisitos y condiciones legales',
          target: Target.BLANK,
          actionType: AtButtonActionType.OPEN_URL,
          actionValue: termsAndConditionsUrl,
          site,
          labelClassname: 'w-4/5'
        }}
        carDetails={{
          carDetailsButton: {
            label: 'Ver detalles',
            site,
            onClick: () => setShowDetails(true),
            disabled: !!simulationResults.installmentError
          },
          carPrice: formattedCarPrice,
          carName
        }}
        paymentData={{
          installment: simulationResults.selectedInstallment,
          installmentError: simulationResults.installmentError,
          installments: simulationResults.installments,
          handleInstallmentClick: (newInstallment) =>
            setSimulation({ selectedInstallment: newInstallment }),
          initialPaymentSlide: {
            onChange: (newPercentage) =>
              setSimulation({ initialPaymentDisplayPercentage: newPercentage }),
            onMouseUp: (newPercentage) =>
              setSimulation({
                initialPaymentSelectedPercentage: newPercentage
              }),
            site
          },
          initialPaymentValue: formattedInitialPaymentValue,
          monthlyFee: formattedMonthlyFee,
          creditTotalCost: formattedCreditTotalCost,
          caePercentage: formattedCaePercentage,
          renovationPlanCost: formattedRenovationPlanCost,
          carAsPayment
        }}
        quoteButton={{
          className: 'sm:!w-32',
          onClick: async () => {
            dispatch(updateFinancingSimulation(simulationResults))
            onCloseClick()
            // @ts-ignore
            insuranceSectionAnchor.current.click()
          },
          label: 'Continuar',
          variant: 'primary',
          disabled: !!simulationResults.installmentError,
          site
        }}
      />
      <MlModal
        site={site}
        onCloseClick={() => setShowDetails(false)}
        isOpen={showDetails}
        title='Evaluación comercial'
        className='justify-center'
        containerClassName='w-full sm:max-w-[624px] lg:max-w-[608px] h-auto'
        contentClassName='!px-6 w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-track-gray-200 scrollbar-thumb-gray-400 scrollbar-thumb-rounded-full scrollbar-track-rounded-full'
      >
        <Details
          site={site}
          car={{
            brand: state.car?.brand ?? '',
            model: state.car?.model ?? '',
            version: state.version.selected ?? '',
            price: formattedCarPrice
          }}
          financing={{
            creditType:
              simulationResults.selectedCreditType === 1
                ? 'Convencional'
                : 'Inteligente',
            initialPaymentValue: formattedInitialPaymentValue,
            installments:
              simulationResults.installments
                ?.find(({ id }) => id === simulationResults.selectedInstallment)
                ?.installments.toString() ?? ''
          }}
          installments={{
            monthlyFee: formattedMonthlyFee,
            creditTotalCost: formattedCreditTotalCost,
            caePercentage: formattedCaePercentage,
            renovationPlanCost: formattedRenovationPlanCost
          }}
        />
      </MlModal>
    </>
  )
}
