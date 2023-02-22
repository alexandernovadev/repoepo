import { PurchasingParameters } from '../../types/contentful/content-model/tm-pdp'
import {
  ContentfulAsset,
  ContentfulMlHorizontal,
  ContentfulOrFinancingFeatures,
  ContentfulPgPage,
  Sites,
} from '../../types'
import { Document } from '@contentful/rich-text-types'


export interface PdpProps
  extends ContentfulPgPage,
    PurchasingParameters,
    Sites {
  cardsTitle?: string
  cards?: ContentfulMlHorizontal[]
  warranty?: any
  financingFeatures?: ContentfulOrFinancingFeatures
  usedFeatures?: ContentfulAsset[]
  showChatToUsedCars?: boolean
  notFound: boolean
  templateVehicleColors?: {
    title: string
    description: Document
  }
}