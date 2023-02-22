import { ContentfulOrFooter } from './or-footer'
import { ContentfulOrHeader } from './or-header'
import { ContentfulBlock } from '../block'
import { ContentfulTemplateCatalog, ContentfulTemplateBuyProcess } from './'
import { Car, CarColor } from '../car'
import { ContentfulBrandProps } from './tm-catalog'
import { ContentfulAsset, ContentfulTags } from '../common'

export type ContentfulPgPageTemplate = ContentfulTemplateCatalog | ContentfulTemplateBuyProcess

export type ContentfulPgPage = {
  name: string
  slug: string
  title: string
  description?: string
  keywords?: string[]
  noindex?: boolean
  nofollow?: boolean
  template: ContentfulPgPageTemplate
  car?: Car
  navbar?: ContentfulOrHeader
  footer?: ContentfulOrFooter
  blocks: ContentfulBlock[]
  gubagooChat: boolean
  global: GlobalInformation
  currentSite?: string
}

export interface GlobalInformation {
  brands?: ContentfulBrandProps[]
  carPlaceholderImage?: ContentfulAsset
  oldCarPlaceholderImage?: ContentfulAsset
  siteLogo?: ContentfulAsset
  tags?: Array<ContentfulTags>
  colors?: CarColor[]
}
