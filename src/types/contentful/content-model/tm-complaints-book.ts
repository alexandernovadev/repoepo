import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'
import { ContentfulTemplateType } from '../common'

export interface ContentfulTemplateComplaintsBook {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmComplaintsBook
  name: string
  title: string
  claimPolicies: MlRichTextProps['text']
}