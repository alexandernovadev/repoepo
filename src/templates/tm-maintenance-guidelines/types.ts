import { Sites } from '../../types'
import {
  ContentfulTemplateMaintenanceGuidelines,
  MaintenanceBrand
} from '../../types/contentful/content-model/tm-maintenance-guidelines'

export interface TmMaintenanceGuidelinesProps extends Sites {
  template: ContentfulTemplateMaintenanceGuidelines
}

export interface GuidelinesProps extends Sites {
  brand: MaintenanceBrand
}
