import { BlockContentType } from './block-content-type'
import { ComponentContentType } from './component-content-type'

export interface ContentfulElement<
  T extends BlockContentType | ComponentContentType
> {
  name: string
  CONTENT_TYPE: T
  CONTENTFUL_ID: string
}
