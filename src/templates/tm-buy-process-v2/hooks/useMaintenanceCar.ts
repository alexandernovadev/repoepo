import { useMemo } from 'react'
import { BuyProcessV2Car } from '../../../redux/features/buyProcessV2Slice'

export const useMaintenanceByCarProps = ({
  car
}: {car: BuyProcessV2Car}) => {
  const renderMaintenanceByCarProps = useMemo(() => {
    if (car?.isNew) {
      return true
    }
  
    const yearFeature = car?.features.find((feature) => feature.id === 'year')

    if (yearFeature?.label && car?.mileage) {
      return (
        new Date().getFullYear() - parseInt(yearFeature!.label) < 10 &&
        car.mileage < 150000
      )
    }

    return false
  }, [car?.features])

  return {
    renderMaintenanceByCarProps
  }
}
