import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'
import { ContentfulAsset, ContentfulTemplateType } from '..'
import { Warranty } from '../../../templates/tm-buy-process-v2/common/types'
import { Location } from '../../../utils/regions/types'
import { ContentfulOrBuyProcessTerms } from './or-buy-process-terms'
import { ContentfulOrFinancingFeatures } from './or-financing-features'

export type ContentfulTemplateBuyProcess = {
  CONTENTFUL_ID?: string
  CONTENT_TYPE?: ContentfulTemplateType.TmBuyProcess
  name: string
  terms: ContentfulOrBuyProcessTerms
  financingFeatures?: ContentfulOrFinancingFeatures
  locations: Location
  v2: boolean
  warranties?: Warranty[]
  warrantyModalContent: MlRichTextProps['text']
  transbankLogo?:ContentfulAsset
}
