import { MlCardProduct, MlPaginator } from '@gac/core-components'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setPage } from '../../redux/features/certificatesSlice'
import { commonSelector } from '../../redux/features/commonSlice'
import { getBrandButtonColors } from '../../utils/brandButtonColors'
import { parseResponse } from '../../utils/formatMostViewsData'
import { fetchBrand } from './api'
import { ContainerCardsClasses } from './classes'
import { Brand, CarsGridProps, CerticatesState } from './types'

export const CarsCertificateGrid = ({
  columns,
  site,
  certificatesTag
}: CarsGridProps) => {
  const state = useSelector((state: CerticatesState) => state.certificates)
  const dispatch = useDispatch()
  const { cars, loading, params, page, brand } = state
  const [gridCars, setGridCars] = useState([])
  const [currentBrand, setCurrentBrand] = useState<Brand>()

  const { oldCarPlaceholderImage, carPlaceholderImg, brands } =
    useSelector(commonSelector)

  const findBrand = async () => {
    const brandFetched = await fetchBrand(site, brand)
    if (brandFetched) {
      setCurrentBrand(brandFetched)
    }
  }

  const lastCar = (page - 1) * 12 + 12

  const onClickPrevButton = () => {
    dispatch(setPage(page - 1))
    window.scrollTo(0, 0)
  }

  const onClickNextButton = () => {
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
        certificatesTag
      )
    )
  }, [cars, currentBrand])

  useEffect(() => {
    findBrand()
  }, [])

  return (
    <>
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
            item?.carData?.newCar
          )
          const url = item?.carData?.brandUrl
            ? item?.carData?.brandUrl
            : `vehicle/${item.id}`
          return (
            <div key={index}>
              <MlCardProduct
                spinCar={false}
                spinCarLoading={false}
                site={site}
                tagLabel={item.tagLabel}
                tagClasses={item.tagClasses}
                tagIcon={item.tagIcon}
                variant={item.variant}
                carData={item.carData}
                href={url}
                buttonStyles={buttonStyles}
                imageClassname={`${
                  (item?.carData?.carImage === oldCarPlaceholderImage?.url ||
                    item?.carData?.carImage === carPlaceholderImg?.url) &&
                  '!object-contain'
                }`}
                cardHref={url}
              />
            </div>
          )
        })}
      </div>

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
    </>
  )
}
