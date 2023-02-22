import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'
import { ContentfulTags, ContentfulTemplateType } from '../common'
import { ContentfulBrandProps } from './tm-catalog'

export interface ContentfulTemplateCertificates {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmCertificates
  name: string
  brand: ContentfulBrandProps
  brandCertificateBanner: {
    CONTENTFUL_ID: string
    CONTENT_TYPE: string
    file: {
      url: string
    }
    description: string
    name: string
    title: string
  }
  brandCertificateDescription: MlRichTextProps['text']
  tagId: number
  certificatesTag: Array<ContentfulTags>
}
