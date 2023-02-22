import { ContentfulOrSlider, ContentfulTemplateType } from '..'
import { ContentfulAsset } from '../common'
import { ContentfulMlHeading } from './ml-heading'
import { RichText } from './ml-rich-text'
import { GlobalInformation } from './pg-page'

export interface ContentfulBrandProps {
  CONTENTFUL_ID: string
  CONTENT_TYPE: string
  bannerBrand: {
    file: {
      url: string
    }
  }
  brand: {
    brandImage: {
      file: {
        url: string
      }
    }
  }
  bigBannerBrand?: ContentfulOrSlider
  usedCertifiedTag?: string
  usedCertifiedHeading?: ContentfulMlHeading
  usedCertifiedContent?: RichText
  usedCertifiedIdentifier?: string
  buttonBackgroundColor?: string
  buttonTextColor?: string
  description: string
  name: string
  title: string
  showBuyProcessBybrand?: Array<string>
}

export interface ContentfulTemplateCatalog extends GlobalInformation {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmCatalog
  description: string
  name: string
  title: string
  brands: Array<ContentfulBrandProps>
  placeholderImage: ContentfulAsset
  showChatToUsedCars: boolean
  priceRange: number
}
