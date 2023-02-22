import React from 'react'
import { useSelector } from 'react-redux'
import { commonSelector } from '../../../redux/features/commonSlice'
import { InfoClasses } from '../classes'
import { InformationProps, SelectStoreProps } from '../types'
import { Brand } from './brand'
import { searchContentfulBrand } from './searchContentfulBrand'

export const Information: React.FC<InformationProps> = ({
  template,
  site
}: InformationProps) => {
  const filters = useSelector(
    (state: SelectStoreProps) => state.catalog.filters
  )
  const { brands } = useSelector(commonSelector)

  const brand = searchContentfulBrand({ brands: brands, filters })

  return (
    <>
      {brand === null ? (
        <div className='mb-6 md:mb-8'>
          <h2 className={InfoClasses.title}>{template?.title}</h2>
          <p className={InfoClasses.description}>{template?.description}</p>
        </div>
      ) : (
        <Brand site={site} dataBrand={brand} />
      )}
    </>
  )
}
