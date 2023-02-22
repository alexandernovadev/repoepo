import React, { useState } from 'react'
import useMostViews from '../../hooks/useMostViews'
import {
  OrSlider,
  MlCardProduct,
  MlSkeleton,
  MlSpinCar
} from '@gac/core-components'
import { commonSelector } from '../../redux/features/commonSlice'
import { Sites } from '../../types'
import { MlSkeletonVariants } from '../../templates/tm-catalog/types'
import { useSelector } from 'react-redux'
import useSpincar from '../../hooks/useSpincar'
import { getBrandButtonColors } from '../../utils/brandButtonColors'

export interface MostViewsProps extends Sites {
  type: any
  loop: boolean
  variant?: string
}

const cardClasses: Record<string, string> = {
  moreViews: '!w-[295px]',
  moreViewsSmall: '!w-[270px]'
}

const skeletonArray = new Array(3).fill('')

export const MostViews = ({
  type,
  variant = '',
  loop,
  site
}: MostViewsProps) => {
  const [carSpinCar, setCarSpinCar] = useState({
    show: false,
    url: ''
  })
  const { carPlaceholderImg, oldCarPlaceholderImage, brands } =
    useSelector(commonSelector)
  const { mostViews, loading } = useMostViews(site, variant)
  const { allSpincarUrlData, spincarLoading } = useSpincar({
    carsData: mostViews,
    site
  })

  return loading ? (
    <OrSlider site={site} type={type} loop={loop} className='mt-4'>
      {skeletonArray.map((_, idx) => (
        <MlSkeleton
          className={`${cardClasses[type] ?? ''} my-4`}
          site={site}
          key={idx}
          variant={MlSkeletonVariants.ML_CARD_PRODUCT}
        />
      ))}
    </OrSlider>
  ) : (
    <>
      <OrSlider site={site} type={type} loop={loop} className='mt-4'>
        {mostViews?.map((item: any, index: number) => {
          const buttonStyles = getBrandButtonColors(
            brands,
            item.carData.brand,
            item?.carData?.newCar
          )

          let url = item?.carData?.brandUrl
            ? item?.carData?.brandUrl
            : `vehicle/${item.id}`

          return (
            <div key={index}>
              <MlCardProduct
                spinCar={allSpincarUrlData[item.id]}
                spinCarLoading={spincarLoading}
                spinCarEvent={() => {
                  setCarSpinCar({
                    url: `${
                      allSpincarUrlData[item.id].url360
                    }!lang=es!hidecarousel!disabledrawer`,
                    show: true
                  })
                }}
                imageClassname={`${
                  (item?.carData?.carImage === oldCarPlaceholderImage?.url ||
                    item?.carData?.carImage === carPlaceholderImg?.url) &&
                  '!object-contain'
                }`}
                site={site}
                href={url}
                tagClasses={item.tagClasses}
                tagLabel={item.tagLabel}
                tagIcon={item.tagIcon}
                cardHref={url}
                className={`${cardClasses[type] ?? ''} my-4`}
                variant={item.variant}
                carData={item.carData}
                buttonStyles={buttonStyles}
              />
              {!item?.carData?.newCar && item?.carData?.patent && (
                <input
                  type='hidden'
                  name='placa_patente'
                  id='placa_patente'
                  value={item?.carData?.patent}
                />
              )}
            </div>
          )
        })}
      </OrSlider>
      <MlSpinCar
        site={site}
        className='z-[10000000]'
        isVisible={carSpinCar.show}
        url={carSpinCar.url}
        handleClose={() => {
          setCarSpinCar({
            url: '',
            show: false
          })
        }}
      />
    </>
  )
}
