import { MlBreadcrumb, OrCarDetail } from '@gac/core-components'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import useSetPdpUrl from '../../../hooks/useSetPdpUrl'
import { commonSelector } from '../../../redux/features/commonSlice'
import { ClientSideOnly } from '../../../utils/ClientSideOnly'
import { renderPdpBlockTypes, TmPdpNewProps } from './types'
import { Equipment } from '../common/equipment'
import {
  findPdpBrand,
  formatBreadcrumb,
  formatCarDetails,
  formatCarInfo,
  formatEquipment,
  formatVersions
} from '../../../utils/pdp'
import { CommonClasses } from '../classes'
import { Details } from '../common/details'
import { PdpSectionClasses } from './classes'
import { VehicleColors } from '../common/vehicle-colors'

import { Versions } from './versions'
import { Simulation } from '../common/simulation'
import { FormQuoteModal } from '../common/form-quote'
import { pdpBlocksBySite } from './pdpBlocksBySite'
import { CardsSection } from '../common/cards-section'
import useBuyButtonAction from '../../../hooks/useBuyButtonAction/useBuyButtonAction'
import { SitesNames } from '../../../types'
import { formatVehicleColors } from '../common/vehicle-colors/formatVehicleColors'

export const TmPdpNew: React.FC<TmPdpNewProps> = ({
  car,
  cardsSection,
  site,
  financingFeatures,
  enablePurchasing,
  purchaseText,
  purchaseRoute,
  quoteText,
  templateVehicleColors
}: TmPdpNewProps) => {
  const { brands } = useSelector(commonSelector)
  const [formPriceType, setFormPriceType] = useState<boolean>(false)

  const equipments = formatEquipment(car.equipment, car.isNew)
  const versions = formatVersions(car)
  const breadcrumb = formatBreadcrumb(car)
  const carDetails = formatCarDetails(car, site)
  const [selectedVersion, setSelectedVersion] = useState(versions[0].id)
  const handleVersionClick = (id: string) => {
    setSelectedVersion(id)
  }
  const getVehicleColors = formatVehicleColors(car, site)

  const carInfo = useMemo(
    () => formatCarInfo(car, selectedVersion, formPriceType),
    [selectedVersion, formPriceType]
  )

  const carYear = useMemo(
    () =>
      parseInt(car.features.find((f) => f.name === 'year')?.label ?? '0', 10),
    [car]
  )

  const onChangeFormPrice = (isVersion: boolean = false) => {
    setFormPriceType(isVersion)
    toggleModal()
  }

  const mlBrandData = findPdpBrand(car, brands)

  const { isModalOpen, toggleModal } = useSetPdpUrl(
    car.queryParams as string,
    car
  )

  const [detailsAction] = useBuyButtonAction({
    selectedVersion,
    enablePurchasing,
    purchaseRoute,
    purchaseText,
    action: () => onChangeFormPrice(true)
  })

  const renderPdpBlocks = (block: renderPdpBlockTypes, key: number) => {
    switch (block) {
      case renderPdpBlockTypes.VERSIONS:
        return (
          <div key={key}>
            {car.versions && car.isQuotable && (
              <div className={PdpSectionClasses.financingPadding}>
                <div className={PdpSectionClasses.financingContainer}>
                  <Versions
                    description={
                      car.financing ? 'Simula tu financiamiento' : undefined
                    }
                    versions={versions}
                    selectedVersion={selectedVersion}
                    handleVersionClick={handleVersionClick}
                    site={site}
                  />
                  <Simulation
                    site={site}
                    car={{
                      id: car.id,
                      carBrand: car.carBrandType.value,
                      carModel: car.carModelType.value,
                      price: car.prices ? car.prices[0] : null,
                      financing: car.financing,
                      versions: car.versions,
                      used: false,
                      year: carYear,
                      isNew: car?.isNew
                    }}
                    version={selectedVersion}
                    onClick={detailsAction}
                    quoteText={purchaseText}
                    {...financingFeatures}
                  />

                  <FormQuoteModal
                    site={site}
                    idSelectedVersion={formPriceType ? selectedVersion : car.id}
                    car={car}
                    carInfo={carInfo}
                    toggleModal={toggleModal}
                    isModalOpen={isModalOpen}
                    title='Quiero cotizar este auto'
                  />
                </div>
              </div>
            )}
          </div>
        )

      case renderPdpBlockTypes.EQUIPMENT:
        return (
          <div key={key}>
            {car.isNew && equipments && (
              <div className={PdpSectionClasses.equipmentPadding}>
                <div className={PdpSectionClasses.equipmentContainer}>
                  <Equipment
                    isNew={car?.isNew}
                    site={site}
                    backgroundColor='gray'
                    equipments={equipments as string[][]}
                    description={car.description}
                  />
                </div>
              </div>
            )}
          </div>
        )

      case renderPdpBlockTypes.CARDS:
        return (
          <div key={key}>
            {cardsSection?.blocks && (
              <div className={PdpSectionClasses.equipmentPadding}>
                <div className={PdpSectionClasses.equipmentContainer}>
                  <ClientSideOnly>
                    <CardsSection
                      site={site}
                      title={cardsSection?.title}
                      blocks={cardsSection.blocks}
                    />
                  </ClientSideOnly>
                </div>
              </div>
            )}
          </div>
        )

      case renderPdpBlockTypes.OR_CAR_DETAIL:
        return (
          <div key={key}>
            {carDetails && (
              <div className={PdpSectionClasses.carDetailsPadding}>
                <div className={PdpSectionClasses.carDetailsContainer}>
                  {carDetails.mainArticle && (
                    <OrCarDetail
                      mainArticle={carDetails.mainArticle}
                      MainArticleCustomClassname={'mb-3 inline-block'}
                      articles={carDetails.articles}
                      site={site}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )

      case renderPdpBlockTypes.CAR_SLIDER:
        return (
          <div key={key}>
            {site === SitesNames.COSECHE && getVehicleColors.availableColors && (
              <div className={PdpSectionClasses.vehicleColorsContainer}>
                <VehicleColors
                  title={templateVehicleColors?.title}
                  description={templateVehicleColors?.description}
                  site={site}
                  car={car}
                  colors={getVehicleColors.colors}
                  images={getVehicleColors.carImages}
                />
              </div>
            )}
          </div>
        )

      default:
        return <></>
    }
  }

  return (
    <div className='bg-background container mx-auto'>
      <div className={CommonClasses.sectionPadding}>
        <div className={CommonClasses.breadcrumbContainer}>
          <MlBreadcrumb path={breadcrumb} site={site} />
        </div>
      </div>

      <Details
        site={site}
        brandData={mlBrandData as any}
        version={selectedVersion}
        car={car}
        openModal={() => onChangeFormPrice(false)}
        enablePurchasing={enablePurchasing}
        purchaseText={purchaseText}
        purchaseRoute={purchaseRoute}
        quoteText={quoteText}
        availableColors={getVehicleColors.availableColors}
      />

      {pdpBlocksBySite(site).map((item: renderPdpBlockTypes, key: number) =>
        renderPdpBlocks(item, key)
      )}
    </div>
  )
}
