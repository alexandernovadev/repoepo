import { ContentfulTemplateType, ContentfulAsset } from '..'

export interface PurchasingParameters {
  enablePurchasing: boolean
  purchaseText: string
  purchaseRoute: string
  quoteText: string
}

export interface ContentfulTemplatePdp extends PurchasingParameters {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmPdp
  description: string
  name: string
  title: string
  usedFeatures?: ContentfulAsset[]
}
