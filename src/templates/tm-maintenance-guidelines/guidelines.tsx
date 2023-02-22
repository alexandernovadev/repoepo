import { AtCarDocumentButton, MlHorizontal } from '@gac/core-components'
import { classes } from './classes'
import { GuidelinesProps } from './types'
import { fomartModelGuidelines, formatMlHorizontal } from './utils'

export const Guidelines = ({ site, brand }: GuidelinesProps) => {
  const workshop = formatMlHorizontal(brand.authorizedWorkshops, site)
  const maintenance = formatMlHorizontal(brand.maintenancePrice, site)
  const guidelines = fomartModelGuidelines(brand)

  return (
    <div>
      <div className={classes.cardsContainer}>
        {maintenance && <MlHorizontal {...maintenance} />}
        {workshop && <MlHorizontal {...workshop} />}
      </div>
      {guidelines && (
        <div className={classes.modelWrapper}>
          <h2 className={classes.modelTitle}>
            Pautas de mantenciones por modelo
          </h2>
          {guidelines.map((item) => {
            return (
              <AtCarDocumentButton
                key={item.title}
                carBrand={brand.brandName}
                carModel={item.title}
                rightLabel='Ver'
                onClick={() => window.open(item.url)}
                site={site}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
