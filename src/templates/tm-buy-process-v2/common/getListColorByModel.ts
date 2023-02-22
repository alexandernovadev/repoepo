import { VersionStockProps } from './types'
import { ContentfulColor } from '../../../types/contentful/car'
import { toCapitalize } from '../../../utils/toCapitalize'

/**
 * This Funcion search colors from api stock, after
 * according to version selected, search the hexandecimal code
 * from Contentful, and return an hexadecimal colors array
 */
export const GetColorList = (
  stockCar: VersionStockProps[],
  versionSelected: string,
  contentfulColors: ContentfulColor[] | undefined
) => {
  // This function search color by Model Selected, MVP v2
  const getColorByModel = stockCar
    .filter((carstock) => carstock.carId === versionSelected)
    .map((carstock) =>
      carstock.carColor
    )

  /* This function find colors to version
   *  from Contentful and get code hexadecimal
   */
  const carColorFromContenful = contentfulColors
    // eslint-disable-next-line array-callback-return
    ?.map((color) => {
      const colorStock = color.label.toLocaleLowerCase()
      const existColor = getColorByModel.find(
        (colorModel) => colorModel?.carMainColor?.value.toLocaleLowerCase() === colorStock
      )

      if (existColor) {
        return {
          code: color.code,
          label: toCapitalize(existColor.value)
        }
      }
    })
    .filter((c) => c)

  return carColorFromContenful
}
