import { Car } from '../../types/contentful/car'

export interface useBuyButtonActionProps {
  selectedVersion?: number
  enablePurchasing: boolean
  purchaseRoute: string
  purchaseText: string
  car?: Car
  action: () => void
}
