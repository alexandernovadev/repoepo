import {
  PdpNotFound,
  VehicleNotFoundProps
} from '../../components/Pdp/notFound'
import useCommonState from '../../hooks/useCommonState'
import { gacSites } from '../../sites/gacSites'
import { TmBuyProcess } from '../../templates/tm-buy-process'
import { Car } from '../../types/contentful/car'
import { TmBuyProcessPropsPage } from './types'
// import useShowChat from '../../hooks/useShowChat'
import { Layout } from '../Layouts'
import {
  ContentfulTemplateBuyProcess,
  ContentfulTemplateType,
  SitesNames
} from '../../types'
import { TmBuyProcessV2 } from '../../templates/tm-buy-process-v2'

export const TmBuyProcessView = (
  props: TmBuyProcessPropsPage & {
    car: Car
    notFound: boolean
    hostName?: string
  }
) => {
  const { car, ...page } = props
  const model = car?.detailModel ? `- ${car?.detailModel}` : ''
  const pageTitle = `${car?.carBrandType.value} ${model}`
  const site = gacSites(props?.currentSite as string)

  // useShowChat(car?.gubagooChat, site)
  useCommonState(page, site)

  if (props.notFound) {
    return <PdpNotFound {...(props as VehicleNotFoundProps)} />
  }

  const getBuyProcessTemplate = (isV2: boolean = false) => {
    switch (isV2) {
      case false:
        return (
          <TmBuyProcess
            {...(props as TmBuyProcessPropsPage)}
            site={site as SitesNames}
            car={props.car! as Car}
            query={props.query}
            template={
              {
                ...props?.template
              } as ContentfulTemplateBuyProcess
            }
          />
        )

      default:
        return (
          <TmBuyProcessV2
            {...(props as TmBuyProcessPropsPage)}
            site={site as SitesNames}
            car={props.car! as Car}
            template={
              {
                ...props?.template
              } as ContentfulTemplateBuyProcess
            }
            hostName={props.hostName}
          />
        )
    }
  }

  return (
    <Layout
      site={site as SitesNames}
      pageTitle={pageTitle}
      templateType={ContentfulTemplateType.TmBuyProcess}
      contentfulPage={page}
    >
      {getBuyProcessTemplate(props.template?.v2)}
    </Layout>
  )
}
