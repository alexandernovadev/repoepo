import { AtInputDropdown, MlBreadcrumb, MlHeading } from '@gac/core-components'
import { useEffect, useMemo, useState } from 'react'
import { BackgroundContainerColor } from '../../types'
import { MaintenanceBrand } from '../../types/contentful/content-model/tm-maintenance-guidelines'
import { classes, getSiteClasses } from './classes'
import { Guidelines } from './guidelines'
import { TmMaintenanceGuidelinesProps } from './types'
import { getBrandsNames } from './utils'

const path = [
  {
    label: 'Home',
    url: '/'
  },
  {
    label: 'Mantenciones',
    url: '#'
  }
]

export const TmMaintenanceGuidelines = ({
  site,
  template
}: TmMaintenanceGuidelinesProps) => {
  const [selectedValue, setSelectedValue] = useState('')
  const [brandData, setBrandData] = useState<MaintenanceBrand | undefined>(
    undefined
  )
  const brandsOptions = useMemo(
    () => getBrandsNames(template.brands),
    [template]
  )
  const siteClasses = useMemo(() => getSiteClasses(site), [site])

  useEffect(() => {
    if (selectedValue) {
      const data = template.brands?.find(
        (brand) => brand.brandName === selectedValue
      )
      setBrandData(data)
    }
  }, [selectedValue])

  return (
    <div className={classes.container}>
      <div className={classes.breadCrumbWrapper}>
        <MlBreadcrumb site={site} path={path} />
      </div>
      <MlHeading
        descriptionClassName={classes.description}
        title={template.title}
        description={template.description}
        site={site}
        titleClassName={siteClasses.title}
        backgroundColor={BackgroundContainerColor.LIGHT}
      />
      <div className={classes.selectWrapper}>
        <AtInputDropdown
          handleChange={(val) => setSelectedValue(val)}
          optionsClassName={classes.selectOptions}
          selectedValue={selectedValue}
          options={brandsOptions}
          placeholder='Selecciona una marca'
          site={site}
        />
      </div>

      {brandData && <Guidelines site={site} brand={brandData} />}
    </div>
  )
}
