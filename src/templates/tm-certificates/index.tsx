import {
  MlBreadcrumb,
  MlRichText,
  MlRichTextVariant,
  MlSkeleton
} from '@gac/core-components'
import { useEffect, useState } from 'react'
import { Brand } from '../tm-catalog/informationBanner/brand'
import { CarsCertificateGrid } from './cars'
import { ContainerCardsClasses, TmCertificatesClasses } from './classes'
import { tmCertificatesPath } from './data'
import { Tools } from './tools'
import { TmCertificatesProps, CerticatesState } from './types'
import {
  setBrand,
  setCars,
  setLoading,
  setParams
} from '../../redux/features/certificatesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { MlSkeletonVariants } from '../tm-catalog/types'
import { ClientSideOnly } from '../../utils/ClientSideOnly'
import { fetchCertificateCars } from './api'

export const TmCertificates = ({
  site,
  template,
  pageTitle
}: TmCertificatesProps) => {
  const {
    brand,
    brandCertificateDescription,
    brandCertificateBanner,
    tagId,
    certificatesTag
  } = template
  const [sort, setSort] = useState<number>(0)
  const [columns, setColumns] = useState(3)
  const dispatch = useDispatch()
  const state = useSelector((state: CerticatesState) => state.certificates)

  const { loading, page } = state
  const skeletonArray = new Array(13).fill('')

  const getCertifiedCars = async () => {
    dispatch(setLoading(true))

    dispatch(setBrand(brand.title))

    const response = await fetchCertificateCars(page, sort, tagId, site)

    if (response) {
      dispatch(setCars(response?.result))

      dispatch(setParams(response?.params))
    }

    dispatch(setLoading(false))
  }

  useEffect(() => {
    getCertifiedCars()
  }, [sort, page])

  return (
    <section className={`${TmCertificatesClasses} min-h-[50vh]`}>
      <div className='mb-8'>
        <MlBreadcrumb site={site} path={tmCertificatesPath(pageTitle)} />
      </div>
      <ClientSideOnly>
        <div className='max-w-[917px] ml-auto mr-auto'>
          <div className='w-full min-w-0'>
            <Brand
              site={site}
              dataBrand={{
                CONTENTFUL_ID: brand?.CONTENTFUL_ID,
                CONTENT_TYPE: brand?.CONTENT_TYPE,
                bannerBrand: brandCertificateBanner,
                brand: brand?.brand,
                description: brand?.description,
                name: brand?.name,
                title: ''
              }}
            />
          </div>

          <MlRichText
            text={brandCertificateDescription}
            variant={MlRichTextVariant.CERTIFICATE_CAR}
            site={site}
            className='mb-8'
          />

          <Tools
            site={site}
            setColumns={setColumns}
            columns={columns}
            setSort={setSort}
            sort={sort}
          />

          {loading ? (
            <div
              className={`
                    ${ContainerCardsClasses}
                    ${columns === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}
                    mt-20
                  `}
            >
              {skeletonArray?.map((_, index: number) => (
                <MlSkeleton
                  site={site}
                  key={index}
                  variant={MlSkeletonVariants.ML_CARD_PRODUCT}
                />
              ))}
            </div>
          ) : (
            <CarsCertificateGrid
              site={site}
              columns={columns}
              certificatesTag={certificatesTag}
            />
          )}
        </div>
      </ClientSideOnly>
    </section>
  )
}
