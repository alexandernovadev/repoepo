import { GetServerSidePropsContext } from 'next'
import { gacSites } from '../../src/sites/gacSites'
import { SitesNames } from '../../src/types'
import { Car } from '../../src/types/contentful/car'
import { VehicleNotFoundProps } from '../../src/components/Pdp/notFound'
import { getPdpData } from '../../src/utils/pdp/server'
import { TmPdp } from '../../src/templates/tm-pdp'
import { PdpProps } from '../../src/components/Pdp/types'

export const ProductView = (
  props: (PdpProps & { car: Car }) | VehicleNotFoundProps
) => {
  return <TmPdp {...props} />
}

export const getServerSideProps = async ({
  query,
  req
}: GetServerSidePropsContext) => {
  const currentSite =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? process.env.NEXT_PUBLIC_CURRENT_SITE
      : req?.headers?.host

  const site = gacSites(currentSite as string)

  const response = await getPdpData(
    query.quiterId as string,
    site as SitesNames,
    currentSite as string,
    req.headers.referer,
    true
  )

  return response
}

export default ProductView
