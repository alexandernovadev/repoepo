import React from 'react'
import { InfoClasses } from '../classes'
import { ContentfulAsset, ContentfulBrandProps, Sites } from '../../../types'
import { AtImageBanner, MlBrand, OrSwiperSlider } from '@gac/core-components'

interface BrandProps extends Sites {
  dataBrand: ContentfulBrandProps
}

export const Brand: React.FC<BrandProps> = ({
  dataBrand,
  site
}: BrandProps) => {
  const { brand, name, bannerBrand, title, description, bigBannerBrand } =
    dataBrand

  return (
    <div className='mb-6 sm:mb-12 '>
      {bigBannerBrand && bigBannerBrand?.imageItems ? (
        <OrSwiperSlider
          loop={!bigBannerBrand.disableLoop}
          customContainerClasses='md:h-[350px] h-[200px] relative md:mb-8'
          site={site}
          type={bigBannerBrand.type}
        >
          {bigBannerBrand?.imageItems?.map((image: ContentfulAsset, index) => (
            <AtImageBanner
              image={{ url: image.file.url, name: image.file.fileName }}
              key={index}
              site={site}
            />
          ))}
        </OrSwiperSlider>
      ) : (
        <MlBrand
          site={site}
          iconUrl={brand?.brandImage?.file?.url}
          iconAlt={name}
          bannerUrl={bannerBrand?.file?.url}
        />
      )}

      <h2 className={InfoClasses.title}> {title} </h2>
      <p className='text-base font-normal text-gray-500'> {description}</p>
    </div>
  )
}
