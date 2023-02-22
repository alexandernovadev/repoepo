import { queryBuyProcessProps } from '../../hooks/useOverrideStepQuery'
import { ContentfulPgPage, ContentfulTemplateBuyProcess, Sites, SitesNames } from '../../types'
import { Car } from '../../types/contentful/car'
import { VehicleNotFoundProps } from '../Pdp/notFound'

export interface TmBuyProcessPropsPage extends Omit<ContentfulPgPage, "template">, ContentfulTemplateBuyProcess, VehicleNotFoundProps, Sites {
  site: SitesNames
  template: ContentfulTemplateBuyProcess
  car: Car
  query: queryBuyProcessProps
}