import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'
import { ContentfulTemplateType } from '..'
import { ContentfulMlArticle } from './ml-article'

export interface ContentfulTemplateNewsDetail {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmNewsDetail
  description: string
  name: string
  title: string
  article: ContentfulMlArticle
  content: MlRichTextProps['text']
}
