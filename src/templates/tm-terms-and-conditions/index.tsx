import { MlBreadcrumb, MlHeading } from '@gac/core-components'
import { useMemo } from 'react'
import { BackgroundContainerColor } from '../../types'
import { classes, getSiteClasses } from './classes'
import { DesktopView } from './content/desktop'
import { MobileView } from './content/mobile'
import { formatSidebar } from './format'
import { Sidebar } from './sidebar'
import { TmTermsAndConditionsProps } from './types'

const path = [
  {
    label: 'Home',
    url: '/'
  },
  {
    label: 'Legales',
    url: '#'
  }
]

export const TmTermsAndConditions = ({
  site,
  template
}: TmTermsAndConditionsProps) => {
  const { sections } = template
  const siteClasses = useMemo(() => getSiteClasses(site), [site])
  const sidebarData = formatSidebar(sections)

  return (
    <div className={classes.container}>
      <div className={classes.breadcrumb}>
        <MlBreadcrumb path={path} site={site} />
      </div>
      <MlHeading
        isH1={true}
        descriptionClassName={classes.description}
        title={template.title}
        description={template.description}
        site={site}
        titleClassName={siteClasses.title}
        backgroundColor={BackgroundContainerColor.LIGHT}
      />
      <div className={classes.contentWrapper}>
        <div className={classes.sidebarWrapper}>
          <Sidebar site={site} data={sidebarData} />
        </div>
        <div className={classes.textWrapper}>
          <MobileView sections={sections} site={site} />
          <DesktopView sections={sections} site={site} />
        </div>
      </div>
    </div>
  )
}
