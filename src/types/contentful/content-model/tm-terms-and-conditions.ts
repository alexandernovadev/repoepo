import { ContentfulTemplateType } from '../common'
import { ContentfulOrCollapsible } from './or-collapsible'
export interface ContentfulTemplateTermsAndConditions {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmTermsAndConditions
  name: string
  title: string
  description: string
  sections: Section[]
}

export interface Section {
  title: string
  tabs: ContentfulOrCollapsible[]
}
