import { AtButton, MlVehicleInfoCard } from '@gac/core-components'
import { sitePrimaryTextClass } from '../../../../sites/siteClasses'
import { mobileSummaryClasses } from '../../common/classes'
import { prepareBaseCarData, prepareCardSummary } from '../../common/data'
import { MobileSummaryProps } from '../../common/types'

// TODO: Evitar reserva si en el paso de la seleccion de version 
// no hay versiones disponibles. 
export const MobileSummary = ({
  onClick,
  open,
  state,
  className = '',
  site
}: MobileSummaryProps) => (
  <div
    className={`${mobileSummaryClasses.container} ${
      open ? 'h-screen' : ''
    } ${className}`}
  >
    <div className={mobileSummaryClasses.infoBar}>
      <div>
        <p className={`text-xs font-bold ${sitePrimaryTextClass(site)}`}>
          {state.car!.brand}
        </p>
        <p className={`text-xl font-medium ${sitePrimaryTextClass(site)}`}>
          {state.car!.model}
        </p>
      </div>
      <AtButton
        variant='primary-text'
        onClick={onClick}
        site={site}
        label={open ? 'Pasos' : 'Resumen'}
      />
    </div>
    {open && (
      <div className={mobileSummaryClasses.details}>
        <MlVehicleInfoCard
          {...prepareBaseCarData(state.car!)}
          summary={prepareCardSummary(state)}
          site={site}
        />
      </div>
    )}
  </div>
)
