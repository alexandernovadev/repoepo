import {
  BuyProcessV2State,
  resetFinancig,
  setVersion
} from '../../../../redux/features/buyProcessV2Slice'
import { Price } from '../../../../types/contentful/car'
import { getLowestPrice } from '../../../../utils/pdp/getLowestPrice'
import { ItemCard } from '../../common/item-card'
import { BuyProcessV2Props, VersionStockProps } from '../../common/types'

export const VersionSelect = ({
  state,
  dispatch,
  site,
  stockCar,
  isLoading = true
}: BuyProcessV2Props & {
  stockCar: VersionStockProps[]
  isLoading: boolean
}) => {
  const model = new RegExp(state.car!.model, 'i')

  const setDataVersionAndVerifyColor = (
    selected: string | undefined,
    selectedId: string | undefined,
    stock: boolean,
    prices: Price[],
    id: string
  ) => {
    let dataVersion = {
      selected,
      selectedId,
      priceSmart: prices[0].priceSC,
      priceConvensional: prices[0].priceCC,
      price: prices[0],
      carVersionID:id
    } as unknown as BuyProcessV2State['version']

    // If changue version should delete color selected of another version
    if (state.version.selectedId !== selectedId) {
      dataVersion.color = ''
      dataVersion.colorId = ''
      if (!stock) {
        dataVersion.color = '-'
        dataVersion.colorId = '-'
      }
    }
    dispatch(setVersion(dataVersion))

    // Debería quitar el financiamiento si el user cambia de version
    dispatch(resetFinancig())
  }

  return (
    <div className='flex gap-6 flex-wrap justify-center'>
      {state.car!.versions?.map(
        ({ prices, detailModel, carId: selectedId,id }) => {
          const selected = detailModel.replace(model, '')
          const { price, secondPrice } = getLowestPrice(prices) ?? {}

          const stock = stockCar.some(
            (carStock: any) => carStock.carId === selectedId
          )

          return (
            <ItemCard
              disabled={isLoading}
              selected={state.version.selectedId === selectedId}
              onClick={() =>
                setDataVersionAndVerifyColor(
                  selected,
                  selectedId,
                  stock,
                  prices,
                  id
                )
              }
              key={selectedId}
              site={site}
              className='w-[7.5rem] flex flex-col items-center justify-between'
            >
              <p className='mb-2 font-bold text-lg leading-7'>{selected}</p>
              {price && (
                <div>
                  <p className='text-xs leading-4'>Desde</p>
                  <p className='text-sm leading-5 text-gray-900'>{price}</p>
                  {!!secondPrice && (
                    <p className='text-sm leading-5 text-gray-900'>
                      {secondPrice}
                    </p>
                  )}
                  {!stock && (
                    <p className='text-xs leading-4 text-red-600'>
                      Auto no disponible
                    </p>
                  )}
                </div>
              )}
            </ItemCard>
          )
        }
      )}
    </div>
  )
}
