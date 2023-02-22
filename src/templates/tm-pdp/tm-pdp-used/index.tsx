import { MlArticle, MlBreadcrumb, MlHeading } from '@gac/core-components'
import React, { useMemo } from 'react'
import useBuyButtonAction from '../../../hooks/useBuyButtonAction/useBuyButtonAction'
import useSetPdpUrl from '../../../hooks/useSetPdpUrl'
import { BackgroundContainerColor } from '../../../types'
import { ClientSideOnly } from '../../../utils/ClientSideOnly'
import {
  formatBreadcrumb,
  formatCarInfo,
  formatEquipment
} from '../../../utils/pdp'
import { CommonClasses } from '../classes'
import { CardsSection } from '../common/cards-section'
import { Details } from '../common/details'
import { Equipment } from '../common/equipment'
import { FormQuoteModal } from '../common/form-quote'
import { Simulation } from '../common/simulation'
import { UsedClasses } from './classes'
import { TmPdpUsedProps } from './types'

export const TmPdpUsed: React.FC<TmPdpUsedProps> = ({
  site,
  car,
  article,
  cardsSection,
  financingFeatures,
  usedFeatures,
  enablePurchasing,
  purchaseText,
  purchaseRoute,
  quoteText
}: TmPdpUsedProps) => {
  const carInfo = formatCarInfo(car)
  const equipments = formatEquipment(car.equipment, car.isNew)
  const breadcrumb = formatBreadcrumb(car)
  const carYear = useMemo(
    () =>
      parseInt(car.features.find((f) => f.name === 'year')?.label ?? '0', 10),
    [car]
  )
  const showFinancing =
    car.financing &&
    (carYear >= (financingFeatures?.conventionalFinancingMinimumYear ?? 0) ||
      carYear >= (financingFeatures?.smartFinancingMinimumYear ?? 0))

  const { isModalOpen, toggleModal } = useSetPdpUrl(
    car.queryParams as string,
    car
  )

  const [detailsAction] = useBuyButtonAction({
    selectedVersion: undefined,
    enablePurchasing,
    purchaseRoute,
    purchaseText,
    car,
    action: () => toggleModal()
  })

  return (
    <div className='container mx-auto'>
      <div className='bg-background'>
        <div className={CommonClasses.sectionPadding}>
          <div className={CommonClasses.breadcrumbContainer}>
            <MlBreadcrumb path={breadcrumb} site={site} />
          </div>
        </div>

        <Details
          site={site}
          car={car}
          openModal={toggleModal}
          usedFeatures={usedFeatures}
          enablePurchasing={enablePurchasing}
          purchaseText={purchaseText}
          purchaseRoute={purchaseRoute}
          quoteText={quoteText}
        />
        {(equipments || car.description) && (
          <div className={CommonClasses.sectionPadding}>
            <Equipment
              site={site}
              equipments={equipments as string[][]}
              description={car.description}
            />
          </div>
        )}

        {car?.isQuotable && (
          <>
            {showFinancing && (
              <div className={UsedClasses.financing.padding}>
                <div className={UsedClasses.financing.container}>
                  <MlHeading
                    site={site}
                    title='Simula tu Financiamiento'
                    description='Descubre la mejor opción para financiar tu auto'
                    backgroundColor={BackgroundContainerColor.WHITE}
                  />
                  <Simulation
                    site={site}
                    car={{
                      id: car.id,
                      carBrand: car.carBrandType?.value ?? '',
                      carModel: car.carModelType?.value ?? '',
                      price: car.prices ? car.prices[0] : null,
                      financing: car.financing,
                      versions: car.versions,
                      used: true,
                      year: carYear
                    }}
                    onClick={detailsAction}
                    quoteText={purchaseText}
                    {...financingFeatures}
                  />
                </div>
              </div>
            )}
            <FormQuoteModal
              idSelectedVersion={car.id}
              site={site}
              car={car}
              carInfo={carInfo}
              toggleModal={toggleModal}
              isModalOpen={isModalOpen}
              title='Quiero cotizar este auto'
            />
          </>
        )}
        {article && (
          <div className={UsedClasses.article.container}>
            <MlArticle {...article} site={site} />
          </div>
        )}
        <div className={UsedClasses.equipment.padding}>
          <div className={UsedClasses.equipment.container}>
            {cardsSection?.blocks && (
              <ClientSideOnly>
                <CardsSection
                  site={site}
                  title={cardsSection?.title}
                  blocks={cardsSection.blocks}
                />
              </ClientSideOnly>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
