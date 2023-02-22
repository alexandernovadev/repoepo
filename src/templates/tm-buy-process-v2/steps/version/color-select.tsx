import { AtPdpColor } from '@gac/core-components'
import { setVersion } from '../../../../redux/features/buyProcessV2Slice'
import { stepSubtitleClasses } from '../../common/classes'
import { GetColorList } from '../../common/getListColorByModel'
import { BuyProcessV2Props, VersionStockProps } from '../../common/types'
import { NoStockWarning } from './NoStockWarning'

export const ColorSelect = ({
  state,
  dispatch,
  site,
  car,
  stockCar
}: BuyProcessV2Props & { stockCar: VersionStockProps[] }) => {
  const carColorFromContenful = GetColorList(
    stockCar,
    state.version.selectedId,
    car?.contentfulColors
  )

  return (
    <div>
      {state.version.selected === '' ? (
        <p className={`${stepSubtitleClasses} mb-4`}>
          ¡Selecciona una Versión!
        </p>
      ) : (
        <>
          {carColorFromContenful?.length !== 0 && carColorFromContenful && (
            <p className={`${stepSubtitleClasses} mb-4`}>Colores disponibles</p>
          )}

          {(carColorFromContenful?.length === 0 || !carColorFromContenful) && (
            <NoStockWarning />
          )}

          <div className='flex gap-6 pl-2 mb-6'>
            {/* @ts-ignore */}
            {carColorFromContenful?.map(({ code: colorId, label: color }) => (
              <AtPdpColor
                key={colorId}
                code={colorId}
                label={color}
                selected={state.version.colorId === colorId}
                onClick={() => dispatch(setVersion({ color, colorId }))}
                site={site}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
