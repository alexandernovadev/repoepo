import {
  ContentfulAsset,
  ContentfulMlArticle,
  ContentfulMlHorizontal,
  ContentfulOrFinancingFeatures,
  Sites
} from '../../../types'
import { Car } from '../../../types/contentful/car'
import { PurchasingParameters } from '../../../types/contentful/content-model/tm-pdp'

export interface TmPdpUsedProps extends Sites, PurchasingParameters {
  car: Car
  article?: ContentfulMlArticle
  cardsSection?: {
    title?: string
    blocks?: ContentfulMlHorizontal[]
  }
  financingFeatures?: ContentfulOrFinancingFeatures
  usedFeatures?: ContentfulAsset[]
}

export interface Feature {
  value: string
  title: string
  key?: string
  icon: {
    url: string
    name: string
  }
}
