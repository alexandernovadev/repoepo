import Head from 'next/head'
import useCommonState from '../../hooks/useCommonState'
import useShowChat from '../../hooks/useShowChat'
import { gacSites } from '../../sites/gacSites'
import { TmPdpNew } from '../../templates/tm-pdp/tm-pdp-new'
import { TmPdpUsed } from '../../templates/tm-pdp/tm-pdp-used'
import { ContentfulTemplateType, SitesNames } from '../../types'
import { Car } from '../../types/contentful/car'
import { formatWarranty } from '../../utils/pdp'
import { Layout } from '../Layouts'
import { PdpProps } from './types'

export const Pdp = (props: PdpProps & { car: Car }) => {
  const { car, usedFeatures, ...page } = props
  const { enablePurchasing, purchaseRoute, purchaseText, quoteText } = page

  const model = car.detailModel ? `- ${car.detailModel}` : ''

  const pageTitle = `${car.carBrandType.value} ${model}`
  const warranty = formatWarranty(props)
  const cardsSection = {
    title: page.cardsTitle,
    blocks: page.cards
  }

  const site = gacSites(props?.currentSite as string)

  useShowChat(
    car?.gubagooChat ||
      (!car.isNew && props.showChatToUsedCars) ||
      (site === SitesNames.PORTILLO && car.isNew),
    site
  )
  useCommonState(page, site)

  return (
    <>
      <Head>
        <meta property='og:title' content={car.detailModel} />
        <meta property='og:type' content='article' />
        <meta property='og:description' content={car.description ?? ''} />
        <meta property='og:image' content={car.socialMediaImage?.url ?? ''} />
      </Head>

      <Layout
        site={site as SitesNames}
        pageTitle={pageTitle}
        templateType={ContentfulTemplateType.TmPdp}
        contentfulPage={page}
      >
        {car.isNew ? (
          <TmPdpNew
            site={site as SitesNames}
            car={car}
            cardsSection={cardsSection}
            financingFeatures={page.financingFeatures}
            enablePurchasing={enablePurchasing}
            purchaseText={purchaseText}
            purchaseRoute={purchaseRoute}
            quoteText={quoteText}
            templateVehicleColors={props.templateVehicleColors}
          />
        ) : (
          <TmPdpUsed
            site={site as SitesNames}
            car={car}
            cardsSection={cardsSection}
            article={warranty}
            financingFeatures={page.financingFeatures}
            usedFeatures={usedFeatures}
            enablePurchasing={enablePurchasing}
            purchaseText={purchaseText}
            purchaseRoute={purchaseRoute}
            quoteText={quoteText}
          />
        )}
      </Layout>
    </>
  )
}
