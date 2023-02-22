import { ContentfulAsset, ContentfulTemplateType } from '..'

export interface ContentfulTemplateBranchOfficesMain {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmBranchOfficesMain
  name: string
  supportPhoneNumber: string
  supportMobilePhone: string
  supportUrl: string
  enableBrandsBy: string
  notFoundImage: ContentfulAsset
}
