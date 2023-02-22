import {
  ContentfulMlHorizontal,
  ContentfulOrFinancingFeatures,
  Sites
} from '../../../types'
import { Dispatch } from 'react'
import { Car } from '../../../types/contentful/car'
import { PurchasingParameters } from '../../../types/contentful/content-model/tm-pdp'
import { Document } from '@contentful/rich-text-types'

export interface TmPdpNewProps extends Sites, PurchasingParameters {
  car: Car
  cardsSection?: {
    title?: string
    blocks?: ContentfulMlHorizontal[]
  }
  financingFeatures?: ContentfulOrFinancingFeatures
  templateVehicleColors?: {
    title: string,
    description: Document
  }
  disableColors?: boolean
}

export interface VersionsProps extends Sites {
  title?: string
  description?: string
  versions: any[]
  selectedVersion: string
  handleVersionClick: Dispatch<string>
}

export enum renderPdpBlockTypes {
  VERSIONS = 'versions',
  SIMULATION = 'simulation',
  CARDS = 'cards',
  OR_CAR_DETAIL = 'or-car-detail',
  CAR_SLIDER = 'car-slider',
  EQUIPMENT = 'equipment'
}