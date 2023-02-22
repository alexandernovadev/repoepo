import { PropsWithChildren } from 'react'
import { Sites } from '../../../../../types'

export interface DetailsProps extends Sites {
  car: {
    brand: string
    model: string
    version?: string
    price: string
  }
  financing: {
    creditType: string
    initialPaymentValue: string
    installments: string
  }
  installments: {
    monthlyFee: string
    creditTotalCost: string
    caePercentage: string
    renovationPlanCost?: string
  }
}

export interface SectionProps extends PropsWithChildren<Sites> {
  title: string
}

export interface ItemProps extends Sites {
  name: string
  value: string
}
