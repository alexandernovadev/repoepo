import React, { useEffect, useState } from 'react'
import useSpincar from '../../hooks/useSpincar'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/router'
import { setPage } from '../../redux/features/catalogSlice'
import { ContainerCardsClasses, labelCarsClasses } from './classes'
import { MlPaginator, MlCardProduct, MlSpinCar } from '@gac/core-components'
import { CarsGridProps, SelectStoreProps } from './types'
import { parseResponse } from '../../utils/formatMostViewsData'
import { formatCatalogQuery } from '../../utils/formatQuery'
import { commonSelector } from '../../redux/features/commonSlice'
import { ClientSideOnly } from '../../utils/ClientSideOnly'
import { getBrandButtonColors } from '../../utils/brandButtonColors'

export const CarsGrid: React.FC<CarsGridProps> = ({
  columns,
  site
}: CarsGridProps) => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [gridCars, setGridCars] = useState([])
  const [carSpinCar, setCarSpinCar] = useState({
    show: false,
    url: ''
  })
  const { allSpincarUrlData, spincarLoading } = useSpincar({
    carsData: gridCars,
    site
  })
  const state = useSelector((state: SelectStoreProps) => state.catalog)
  const { page, cars, params, loading } = state
  const { oldCarPlaceholderImage, carPlaceholderImg, tags, brands } =
    useSelector(commonSelector)
  const lastCar = (page - 1) * 12 + 12

  const onClickPrevButton = () => {
    const auxQuery = formatCatalogQuery(router.query)
    router.replace(`/catalog?page=${page - 1}${auxQuery}`, undefined, {
      shallow: true
    })
    dispatch(setPage(page - 1))
    window.scrollTo(0, 0)
  }

  const onClickNextButton = () => {
    const auxQuery = formatCatalogQuery(router.query)
    router.replace(`/catalog?page=${page + 1}${auxQuery}`, undefined, {
      shallow: true
    })
    dispatch(setPage(page + 1))
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    setGridCars(
      parseResponse(
        cars,
        { alt: 'new placeholder', url: carPlaceholderImg.url },
        { alt: 'old placeholder', url: oldCarPlaceholderImage.url },
        site,
        tags
      )
    )
  }, [cars])

  return (
    <>
      <div className='block lg:hidden my-8'>
        <label className={labelCarsClasses}>{params?.total} vehículos</label>
      </div>

      {/* GRID CARDS */}

      <ClientSideOnly>
        <div
          className={`
        ${ContainerCardsClasses}
        ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}
      `}
        >
          {gridCars?.map((item: any, index: number) => {
            const buttonStyles = getBrandButtonColors(
              brands,
              item.carData.brand,
              item.carData.newCar
            )
            const url = item?.carData?.brandUrl
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
                  tagClasses={item.tagClasses}
                  tagLabel={item.tagLabel}
                  tagIcon={item.tagIcon}
                  site={site}
                  variant={item.variant}
                  carData={item.carData}
                  buttonStyles={buttonStyles}
                  href={url}
                  cardHref={url}
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
        </div>
      </ClientSideOnly>

      <div className='mt-8'>
        <MlPaginator
          site={site}
          firstCar={(page - 1) * 12 + 1}
          lastCar={lastCar > params?.total ? params?.total : lastCar}
          showPrevButton={page > 1}
          showNextButton={page < params?.pages}
          disabledNextButton={loading}
          disabledPrevButton={loading}
          totalCars={params?.total}
          onClickPrevButton={onClickPrevButton}
          onClickNextButton={onClickNextButton}
        />
      </div>

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
