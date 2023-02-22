import {
  MlBrand,
  MlBrandVariant,
  MlPdpCarImg,
  MlSpinCar,
  New as MlPdpCarDescriptionNew,
  OrGallery,
  Used as MlPdpCarDescriptionUsed
} from '@gac/core-components'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { commonSelector } from '../../../../redux/features/commonSlice'
import { getBrandButtonColors } from '../../../../utils/brandButtonColors'
import { getActualBuyProcess } from '../../../../utils/buy-process/getActualBuyProcess'
import { ClientSideOnly } from '../../../../utils/ClientSideOnly'
import {
  // formatBuyProcessCar,
  formatDescriptionData,
  formatEquipment,
  formatFeatures,
  formatGallery
} from '../../../../utils/pdp'
import { Features } from '../../tm-pdp-used/features'
import { AdditionalContent } from '../additional-content'
import { Equipment } from '../equipment'
import { DetailsProps } from '../types'
import { Classes } from './classes'
import { SitesNames } from '../../../../types'

export const Details: React.FC<DetailsProps> = ({
  car,
  brandData,
  site,
  openModal,
  usedFeatures,
  enablePurchasing = false,
  purchaseText = 'Comprar',
  purchaseRoute,
  version,
  availableColors = false
}: DetailsProps) => {
  const { carPlaceholderImg, oldCarPlaceholderImage, brands } =
    useSelector(commonSelector)

  const router = useRouter()
  const [showGallery, setShowGallery] = useState(false)
  const [show360, setShow360] = useState(false)
  const data = formatDescriptionData(car, site)
  const equipments = formatEquipment(car.equipment, car.isNew)
  const features = formatFeatures(car, usedFeatures)
  const images = formatGallery(car)
  const [selectedColor, setSelectedColor] = useState(data.colors[0]?.label)
  const carImg = {
    name: car.carBrandType.value,
    url:
      car.mainImage ??
      (car.isNew ? carPlaceholderImg?.url : oldCarPlaceholderImage?.url)
  }

  const handleGalleryClose = () => {
    setShowGallery(false)
  }

  const handleSpinCarClose = () => {
    setShow360(false)
  }

  const handleFormOpen = () => {
    if (openModal) {
      openModal()
    }
  }

  /* Estos parametros se utilizan para controlar los widgets y opciones
     De la experiencia 360 de spin car
     Mas informacion de estos parametros se puede encontrar en:
     https://reigncl.atlassian.net/wiki/spaces/GAC/pages/2274951178/SPIKE+Spincar
  */

  const spincarUrl = useMemo(() => {
    if (car.spincar?.url360) {
      return `${car.spincar.url360}!lang=es!hidecarousel!disabledrawer`
    }

    return ''
  }, [car.id])

  const { detailsAction, buttonText } = useMemo(() => {
    if (enablePurchasing && purchaseRoute) {
      return {
        detailsAction: () => {
          router.push(
            `/${getActualBuyProcess(purchaseRoute)}/${version ?? car?.id}`
          )
        },
        buttonText: purchaseText
      }
    }

    return {
      detailsAction: () => handleFormOpen(),
      buttonText: purchaseText
    }
  }, [version])

  const buttons = useMemo(() => {
    const arr = []

    if (car.isNew && car.spincar?.url360) {
      const spinCarButton = {
        label: 'Vista 360',
        onClick: () => setShow360(true)
      }
      arr.push(spinCarButton)
    }

    if (images.length > 0) {
      const galleryButton = {
        label: 'Galería',
        onClick: () => setShowGallery(true)
      }
      arr.push(galleryButton)
    }

    if (car.pdfFile) {
      const pdfButton = {
        label: 'Ver Ficha',
        onClick: () => window.open(car.pdfFile as string)
      }

      arr.push(pdfButton)
    }

    return arr
  }, [car.id])

  const buttonStyles = getBrandButtonColors(
    brands,
    car.carBrandType.value,
    car.isNew
  )

  return (
    <div className={Classes.padding}>
      <div className={Classes.container}>
        <ClientSideOnly>
          {brandData && (
            <div className='pt-4 md:pt-2 lg:pt-0'>
              <MlBrand
                {...brandData}
                variant={MlBrandVariant.CATALOG}
                site={site}
              />
            </div>
          )}
        </ClientSideOnly>
        <div className={Classes.flexWrapper}>
          <div className={Classes.imgWrapper}>
            <ClientSideOnly>
              <MlPdpCarImg
                spincarUrl={car.isNew ? '' : spincarUrl}
                imageClassname='h-[290px] max-h-[290px] md:max-h-full md:h-[467px] lg:h-[390px]'
                image={carImg}
                isNew={car.isNew}
                buttons={buttons}
                site={site}
                iframeClassname='pt-2 lg:pt-0 max-h-[240px] xs:max-h-[290px] md:max-h-[400px]'
                tag={
                  car.certifiedUsedData && car.isCertifiedUsed
                    ? car.certifiedUsedData.tag
                    : undefined
                }
              />
              {!car.isNew && car.patent && (
                <input
                  type='hidden'
                  id='placa_patente'
                  name='placa_patente'
                  value={car.patent}
                />
              )}
            </ClientSideOnly>
            <OrGallery
              site={site}
              className='z-[10000000] gallery-swiper-wrapper'
              isVisible={showGallery}
              images={images}
              onClickClose={handleGalleryClose}
            />
            {car.isNew && car.spincar?.url360 && (
              <MlSpinCar
                site={site}
                className='z-[10000000]'
                isVisible={show360}
                url={spincarUrl}
                handleClose={handleSpinCarClose}
              />
            )}
          </div>
          <div className={Classes.descriptionWrapper}>
            {car.isNew ? (
              <ClientSideOnly>
                <MlPdpCarDescriptionNew
                  selectedColor={selectedColor}
                  onColorClick={setSelectedColor}
                  data={data}
                  onClick={detailsAction}
                  isQuotable={car?.isQuotable}
                  buttonText={buttonText}
                  site={site}
                  buttonStyles={buttonStyles}
                  disableColors={
                    availableColors === false
                      ? false
                      : site === SitesNames.COSECHE && car.isNew
                  }
                />
              </ClientSideOnly>
            ) : (
              <ClientSideOnly>
                <MlPdpCarDescriptionUsed
                  data={data}
                  site={site}
                  isQuotable={car?.isQuotable}
                  onClick={detailsAction}
                  buttonText={buttonText}
                  buttonStyles={buttonStyles}
                />
              </ClientSideOnly>
            )}
          </div>
        </div>
        {car.isCertifiedUsed && car.certifiedUsedData && (
          <AdditionalContent
            {...car.certifiedUsedData.section}
            site={site}
            className='pt-0'
          />
        )}
        {car.isNew && equipments && site !== SitesNames.COSECHE && (
          <Equipment
            isNew={car?.isNew}
            site={site}
            backgroundColor='gray'
            equipments={equipments as string[][]}
            description={car.description}
          />
        )}
        {!car.isNew && <Features site={site} features={features} />}
      </div>
    </div>
  )
}
