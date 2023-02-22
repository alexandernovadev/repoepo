import { ContentfulOrFinancingFeatures, Sites } from '../../../../types'
import { Price, Version } from '../../../../types/contentful/car'

export interface Car {
  id: string
  carBrand: string
  carModel: string
  price: Price | null
  financing: boolean
  used: boolean
  year: number
  isNew?: boolean | null
  versions?: Version[]
}

export interface SimulationProps extends Sites, ContentfulOrFinancingFeatures {
  car: Car
  version?: string
  onClick: () => void
  quoteText?: string
}
