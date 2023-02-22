import { useEffect, useState } from 'react'
import { setVersion } from '../../../redux/features/buyProcessV2Slice'
import { SitesNames } from '../../../types/contentful'
import { Car } from '../../../types/contentful/car'
import { fetchWithoutToken } from '../../../utils/fetch'
import { VersionStockProps } from '../common/types'

const ENDPOINT = 'catalog/api/car/version-info-stock'

export const useStockAvailable = (
  isCarNew: boolean = false,
  car: Car,
  site: SitesNames,
  dispatch: Function
) => {
  const [stockCar, setStockCar] = useState<VersionStockProps[]>([])
  const [isLoadingStock, setIsLoadingStock] = useState(false)

  useEffect(() => {
    const getStock = async () => {
      setIsLoadingStock(true)

      const dataStockApi: any = car?.versions.map(async (carro: any) => {
        const params = `?quiterId=${carro.carId}&modelId=${car?.carModelType.id}&brandId=${car?.carBrandType.id}`
        return await fetchWithoutToken(ENDPOINT + params, site)
      })

      let allCarStocks:any = await Promise.all(dataStockApi)

      // This behavior is to prevent that the array come
      // with data and without carColor
      if (allCarStocks.flat().filter((x:any) => x.carColor).length === 0) {
        allCarStocks = []
      }

      if (allCarStocks.length === 0) {
        dispatch(
          setVersion({
            color: '-',
            colorId: '-',
            selected: '-',
            selectedId: '-'
          })
        )
      }
      setStockCar(allCarStocks.flat())

      setIsLoadingStock(false)
    }

    if (isCarNew) getStock()
  }, [])

  return {
    stockCar,
    isLoadingStock
  }
}
