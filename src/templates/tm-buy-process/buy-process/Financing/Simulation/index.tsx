import {
  AtButton,
  MlHeading,
  MlModal,
  OrSimulation
} from '@gac/core-components'
import { OrSimulationCreditType } from '@gac/core-components/lib/atomic-components-react/components/UI/organism/or-simulation/types'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSimulation } from '../../../../../hooks/useSimulation'
import {
  buyProcessSelector,
  previous,
  updateFinancingSimulation
} from '../../../../../redux/features/buyProcessSlice'
import { AtButtonActionType, Target } from '../../../../../types'
import { formatFinancingPrice } from '../../../../../utils/formatFinancingPrice'
import { Currencies } from '../../../../../utils/formatPrice'
import { Details } from '../../../../tm-pdp/common/simulation/details'
import { appraisalTitleHeading } from '../../../data'
import { session } from '../../../session'
import { GetReCaptchaTokenFn } from '../../../types'
import {
  HigherAppraisalAlert,
  LowerAppraisalAlert,
  MediumAppraisalAlert
} from './alerts'
import { SimulationProps } from './types'

export const Simulation = ({
  site,
  data,
  dispatch,
  smartFinancingFeatures = [],
  smartFinancingMinimumYear = 0,
  conventionalFinancingFeatures = [],
  conventionalFinancingMinimumYear = 0,
  termsAndConditionsUrl,
  getReCaptchaToken
}: SimulationProps & GetReCaptchaTokenFn) => {
  const router = useRouter()
  const {
    hasAcceptedAppraisal,
    financingSimulation,
    initialPaymentPercentage
  } = useSelector(buyProcessSelector)
  const [loading, setLoading] = useState(false)
  const creditTypes = useMemo(() => {
    const newCreditTypes = [] as OrSimulationCreditType[]
    const carYear = parseInt(
      data.car!.features.find((f) => f.id === 'year')?.label ?? '0',
      10
    )

    if (
      data.car!.isNew ||
      (!data.car!.isNew && carYear >= smartFinancingMinimumYear)
    ) {
      newCreditTypes.push({
        label: 'Crédito inteligente',
        id: 0,
        features: smartFinancingFeatures
      })
    }

    if (
      data.car!.isNew ||
      (!data.car!.isNew && carYear >= conventionalFinancingMinimumYear)
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

  const [state, setState] = useSimulation({
    financing: true,
    car: data.car?.id ?? '',
    initialCreditType: creditTypes[0]?.id,
    site,
    financingState: { ...financingSimulation!, initialPaymentPercentage }
  })

  const smartFinancingPrice =
    data.car?.price.priceSC ?? data.car?.price.listPrice ?? 0
  const conventionalFinancingPrice =
    data.car?.price.priceCC ?? data.car?.price.listPrice ?? 0
  const carPrice =
    state.selectedCreditType === 0
      ? smartFinancingPrice
      : conventionalFinancingPrice
  const currency = data.car?.price.currency ?? Currencies.CLP
  const carName = `${data.car?.brand ?? ''} ${data.car?.model ?? ''}`

  const [showDetails, setShowDetails] = useState(false)

  const calculatedInitialPaymentValue =
    carPrice * (state.initialPaymentDisplayPercentage / 100)

  const carAsPayment = useMemo(() => {
    if (
      !data.appraisalSimulation?.suggestedPrice ||
      !data.isAppraisingCar ||
      !data.hasAcceptedAppraisal
    ) {
      return null
    } else if (data.appraisalSimulation.suggestedPrice < carPrice * 0.2) {
      return {
        alert: (
          <LowerAppraisalAlert
            appraisal={data.appraisalSimulation.suggestedPrice}
            minInitial={carPrice * 0.2}
            maxInitial={carPrice * 0.5}
            currency={currency}
            hasAcceptedAppraisal={hasAcceptedAppraisal ?? false}
          />
        ),
        carValue: formatFinancingPrice(
          data.appraisalSimulation.suggestedPrice,
          currency
        ),
        additionalContribution: formatFinancingPrice(
          calculatedInitialPaymentValue -
            data.appraisalSimulation.suggestedPrice,
          currency
        )
      }
    } else if (
      data.appraisalSimulation.suggestedPrice >= carPrice * 0.2 &&
      data.appraisalSimulation.suggestedPrice <= carPrice * 0.5
    ) {
      const diff =
        calculatedInitialPaymentValue - data.appraisalSimulation.suggestedPrice
      return {
        alert: (
          <MediumAppraisalAlert
            appraisal={data.appraisalSimulation.suggestedPrice}
            minInitial={carPrice * 0.2}
            maxInitial={carPrice * 0.5}
            currency={currency}
            hasAcceptedAppraisal={hasAcceptedAppraisal ?? false}
          />
        ),
        carValue: formatFinancingPrice(
          data.appraisalSimulation.suggestedPrice,
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
            appraisal={data.appraisalSimulation.suggestedPrice}
            minInitial={carPrice * 0.2}
            maxInitial={carPrice * 0.5}
            currency={currency}
            hasAcceptedAppraisal={hasAcceptedAppraisal ?? false}
          />
        ),
        carValue: formatFinancingPrice(
          data.appraisalSimulation.suggestedPrice,
          currency
        ),
        refundAmount: formatFinancingPrice(
          data.appraisalSimulation.suggestedPrice -
            calculatedInitialPaymentValue,
          currency
        )
      }
    }
  }, [
    data.appraisalSimulation?.suggestedPrice,
    carPrice,
    calculatedInitialPaymentValue
  ])

  const formattedCarPrice = formatFinancingPrice(carPrice, currency)
  const formattedInitialPaymentValue = formatFinancingPrice(
    calculatedInitialPaymentValue,
    currency
  )
  const formattedMonthlyFee = state.simulation?.duesValue
    ? formatFinancingPrice(state.simulation.duesValue, currency)
    : ''
  const formattedCreditTotalCost = state.simulation?.totalCredit
    ? formatFinancingPrice(state.simulation.totalCredit, currency)
    : ''
  const formattedCaePercentage = state.simulation?.annualEquivalency
    ? `${state.simulation.annualEquivalency.toString()}%`
    : ''
  const formattedRenovationPlanCost =
    state.simulation?.guaranteedFutureValue && state.selectedCreditType === 0
      ? formatFinancingPrice(state.simulation.guaranteedFutureValue, currency)
      : ''

  const descriptionHeadingMessage = hasAcceptedAppraisal
    ? 'Con estos datos evaluaremos la pre-aprobación de tu crédito, considerando el monto de tasación de tu vehículo en parte de pago'
    : 'Con estos datos evaluaremos la pre-aprobación de tu crédito'

  useEffect(() => {
    if (showDetails) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [showDetails])

  return (
    <>
      <MlHeading
        {...appraisalTitleHeading(site)}
        title='Confirma tu simulación'
        description={descriptionHeadingMessage}
      />
      <OrSimulation
        site={site}
        className='sm:mx-2 pb-0 sm:pb-8 pt-2 rounded-2xl sm:border border-gray-100'
        loading={state.isLoading}
        financing={true}
        creditTypes={creditTypes}
        handleCreditTypeChange={(newCreditType) =>
          setState({ selectedCreditType: newCreditType })
        }
        termsAndConditionsButton={{
          label: 'Ver los requisitos y condiciones legales',
          target: Target.BLANK,
          actionType: AtButtonActionType.OPEN_URL,
          actionValue: termsAndConditionsUrl,
          site,
          labelClassname: 'w-[180px] sm:w-auto'
        }}
        carDetails={{
          carDetailsButton: {
            label: 'Ver detalles',
            site,
            onClick: () => setShowDetails(true),
            disabled: !!state.installmentError
          },
          carPrice: formattedCarPrice,
          carName
        }}
        paymentData={{
          installment: state.selectedInstallment,
          installmentError: state.installmentError,
          installments: state.installments,
          handleInstallmentClick: (newInstallment) =>
            setState({ selectedInstallment: newInstallment }),
          initialPaymentSlide: {
            onChange: (newPercentage) =>
              setState({ initialPaymentDisplayPercentage: newPercentage }),
            onMouseUp: (newPercentage) =>
              setState({ initialPaymentSelectedPercentage: newPercentage }),
            site,
            initialPercentage: state.initialPaymentDisplayPercentage
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
            setLoading(true)
            try {
              await session(
                {
                  ...data,
                  financingSimulation: state.simulation!,
                  initialPaymentPercentage:
                    state.initialPaymentSelectedPercentage
                },
                site,
                await getReCaptchaToken()
              )
            } catch (error) {
              console.log(error)
              router.push('/404')
            }
            dispatch(updateFinancingSimulation(state))
          },
          label: 'Continuar',
          variant: loading ? 'loading' : 'primary',
          disabled: !!state.installmentError || loading,
          site
        }}
      />
      <AtButton
        label='Volver'
        variant='primary-text'
        className='py-2 px-6'
        onClick={() => dispatch(previous())}
        site={site}
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
            brand: data.car?.brand ?? '',
            model: data.car?.model ?? '',
            version: data.car?.version ?? '',
            price: formattedCarPrice
          }}
          financing={{
            creditType:
              state.selectedCreditType === 1 ? 'Convencional' : 'Inteligente',
            initialPaymentValue: formattedInitialPaymentValue,
            installments:
              state.installments
                ?.find(({ id }) => id === state.selectedInstallment)
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
