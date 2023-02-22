import { MlCardAppraisal } from '@gac/core-components'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { commonSelector } from '../../../../../redux/features/commonSlice'
import { findContentfulBrand } from '../../../../../utils/findContentfulBrand'
import { pesoFormatter } from '../../../../../utils/formatPrice'
import { prepareFeatures } from './prepareData'
import { AppraisalResultProps } from './types'

export const AppraisalResult = ({
  appraisalResults,
  site
}: AppraisalResultProps) => {
  const { brand, suggestedPrice, model } = appraisalResults!
  const [currentBrand, setCurrentBrand] = useState<any>()
  const { brands } = useSelector(commonSelector)

  useEffect(() => {
    const currentBrand =
      findContentfulBrand(brand, brands) ??
      findContentfulBrand('default', brands)

    setCurrentBrand(currentBrand)
  }, [brand, brands])

  return (
    <MlCardAppraisal
      site={site}
      price={pesoFormatter.format(suggestedPrice)}
      brand={`${brand} ${model}`}
      image={{
        title: currentBrand?.brandImage?.file?.fileName,
        description: currentBrand?.brandImage?.title,
        file: {
          url: currentBrand?.brandImage?.file?.url,
          details: currentBrand?.brandImage?.file?.details
        }
      }}
      features={prepareFeatures(appraisalResults, site)}
    />
  )
}
