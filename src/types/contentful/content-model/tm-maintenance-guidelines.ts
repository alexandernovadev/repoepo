import { ContentfulTemplateType } from '../common'
import { ContentfulAtModelGuidelines } from './at-model-guidelines'
import { ContentfulMlHorizontal } from './ml-horizontal'

export interface ContentfulTemplateMaintenanceGuidelines {
  CONTENTFUL_ID: string
  CONTENT_TYPE: ContentfulTemplateType.TmMaintenanceGuidelines
  name: string
  title: string
  description: string
  brands?: MaintenanceBrand[]
}

export type MaintenanceBrand = {
  brandName: string
  authorizedWorkshops?: ContentfulMlHorizontal
  maintenancePrice?: ContentfulMlHorizontal
  guidelinesByModel?: ContentfulAtModelGuidelines[]
}
