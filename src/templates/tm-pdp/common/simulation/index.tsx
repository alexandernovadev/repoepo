import { MlModal, OrSimulation } from '@gac/core-components'
import { OrSimulationCreditType } from '@gac/core-components/lib/atomic-components-react/components/UI/organism/or-simulation/types'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSimulation } from '../../../../hooks/useSimulation'
import { commonSelector } from '../../../../redux/features/commonSlice'
import { AtButtonActionType, SitesNames, Target } from '../../../../types'
import { getBrandButtonColors } from '../../../../utils/brandButtonColors'
import { ClientSideOnly } from '../../../../utils/ClientSideOnly'
import { formatFinancingPrice } from '../../../../utils/formatFinancingPrice'
import { Currencies } from '../../../../utils/formatPrice'
import { Details } from './details'
import { SimulationProps } from './types'

export const Simulation: React.FC<SimulationProps> = ({
  car,
  version,
  smartFinancingFeatures = [],
  smartFinancingMinimumYear = 0,
  conventionalFinancingFeatures = [],
  conventionalFinancingMinimumYear = 0,
  termsAndConditionsUrl,
  site,
  onClick,
  quoteText = 'Cotizar'
}: SimulationProps) => {
  const { brands } = useSelector(commonSelector)

  const creditTypes = useMemo(() => {
    const newCreditTypes = [] as OrSimulationCreditType[]

    if (!car.used || (car.used && car.year >= smartFinancingMinimumYear)) {
      newCreditTypes.push({
        label:
          site && site === SitesNames.COSECHE && car?.isNew
            ? 'Crédito Chevy Plan'
            : 'Crédito inteligente',
        id: 0,
        features: smartFinancingFeatures
      })
    }

    if (
      !car.used ||
      (car.used && car.year >= conventionalFinancingMinimumYear)
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

  const currency = car.price?.currency ?? Currencies.CLP // TODO obtener la currency default del sitio

  const [state, setState] = useSimulation({
    financing: car.financing,
    car: version ?? car.id,
    initialCreditType: creditTypes[0]?.id,
    site
  })

  const [carName, carPrice] = useMemo(() => {
    if (version && car.price) {
      const versionData = car.versions?.find(({ id }) => id === version)
      let smartFinancingPrice = 0
      let conventionalFinancingPrice = 0

      if (versionData?.prices && versionData?.prices[0]) {
        smartFinancingPrice =
          versionData?.prices[0].priceSC ?? car.price.listPrice ?? 0
        conventionalFinancingPrice =
          versionData?.prices[0].priceCC ?? car.price.listPrice ?? 0
        smartFinancingPrice =
          versionData?.prices[0].priceSC ?? car.price.listPrice ?? 0
        conventionalFinancingPrice =
          versionData?.prices[0].priceCC ?? car.price.listPrice ?? 0
      }

      return [
        `${car.carBrand} ${versionData?.detailModel ?? ''}`,
        state.selectedCreditType === 0
          ? smartFinancingPrice
          : conventionalFinancingPrice
      ]
    }

    const smartFinancingPrice =
      car.price?.priceSC ?? car.price?.priceOP ?? car.price?.listPrice ?? 0
    const conventionalFinancingPrice =
      car.price?.priceCC ?? car.price?.priceOP ?? car.price?.listPrice ?? 0

    return [
      `${car.carBrand} ${car.carModel}`,
      state.selectedCreditType === 0
        ? smartFinancingPrice
        : conventionalFinancingPrice
    ]
  }, [car.id, version, state.selectedCreditType])

  const calculatedInitialPaymentValue =
    carPrice * (state.initialPaymentDisplayPercentage / 100)

  const [showDetails, setShowDetails] = useState(false)

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

  const wigoMockUsdPrice = site === SitesNames.WIGO_MOTORS ? 'USD $99,999' : ''
  const wigoMockPenPrice = site === SitesNames.WIGO_MOTORS ? 'S/99,999,999' : ''

  const buttonStyles = getBrandButtonColors(brands, car.carBrand, !car.used)

  return (
    <ClientSideOnly>
      <OrSimulation
        site={site}
        loading={state.isLoading}
        financing={car.financing}
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
          carPrice: wigoMockUsdPrice || formattedCarPrice,
          secondCarPrice: wigoMockPenPrice,
          carName
        }}
        paymentData={{
          installment: state.selectedInstallment,
          installmentError: state.installmentError,
          installments: state.installments,
          handleInstallmentClick: (newInstallment) =>
            setState({ selectedInstallment: newInstallment }),
          initialPaymentSlide: {
            onChange: (newPercentage: any) =>
              setState({ initialPaymentDisplayPercentage: newPercentage }),
            onMouseUp: (newPercentage: any) =>
              setState({ initialPaymentSelectedPercentage: newPercentage })
          } as any,
          initialPaymentValue: wigoMockUsdPrice || formattedInitialPaymentValue,
          secondInitialPaymentValue: wigoMockPenPrice,
          monthlyFee: wigoMockUsdPrice || formattedMonthlyFee,
          secondMonthlyFee: wigoMockPenPrice,
          creditTotalCost: wigoMockUsdPrice || formattedCreditTotalCost,
          secondCreditTotalCost: wigoMockPenPrice,
          caePercentage: formattedCaePercentage,
          renovationPlanCost: wigoMockUsdPrice || formattedRenovationPlanCost,
          secondRenovationPlanCost: wigoMockPenPrice
        }}
        quoteButton={{
          site: site,
          onClick: () => onClick(),
          label: quoteText,
          disabled: !!state.installmentError,
          styles: buttonStyles
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
            brand: car.carBrand,
            model: car.carModel,
            version: version
              ? car.versions?.find(({ id }) => id === version)?.detailModel
              : undefined,
            price: formattedCarPrice
          }}
          financing={{
            creditType:
              state.selectedCreditType === 1
                ? 'Convencional'
                : site && site === SitesNames.COSECHE && car?.isNew
                ? 'Chevy Plan'
                : 'Inteligente',
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
    </ClientSideOnly>
  )
}
