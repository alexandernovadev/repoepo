import { ContentfulOrContainer } from './content-model'
import { ContentfulCommonBlock } from './common-block'
import { BlockContentType } from './block-content-type'
import { ContentfulOrNewsContainer } from './content-model/or-news-container'

export type ContentfulBlock = (
  | ContentfulOrContainer
  | ContentfulOrNewsContainer
  | ContentfulCommonBlock
) & {
  CONTENTFUL_ID: string
  CONTENT_TYPE: BlockContentType
}
