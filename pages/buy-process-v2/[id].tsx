import React from 'react'
import { GetServerSidePropsContext } from 'next'
import { gacSites } from '../../src/sites/gacSites'
import { SitesNames } from '../../src/types'
import { Car } from '../../src/types/contentful/car'
import { TmBuyProcessView } from '../../src/components/BuyProcess'
import { TmBuyProcessPropsPage } from '../../src/components/BuyProcess/types'
import { getBuyProcessData } from '../../src/utils/buy-process/server'

export const BuyProcessV2PageById = (
  props: TmBuyProcessPropsPage & { car: Car; notFound: boolean; carId: string }
) => {
  return (
    <TmBuyProcessView
      {...props}
      template={{
        ...props?.template,
        name: props?.name,
        terms: props?.terms,
        locations: props?.locations,
        warranties: props?.warranties,
        warrantyModalContent: props?.warrantyModalContent,
        transbankLogo: props?.transbankLogo,
        financingFeatures: props?.financingFeatures,
        v2: props?.v2
      }}
      slug={props.carId!}
    />
  )
}

export const getServerSideProps = async ({
  params,
  req
}: GetServerSidePropsContext<{ id: string }>) => {
  const currentSite =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? process.env.NEXT_PUBLIC_CURRENT_SITE
      : req?.headers?.host

  const siteName = gacSites(currentSite as string)

  const response = await getBuyProcessData(
    params!.id,
    siteName as SitesNames,
    currentSite as string,
    false,
    'Buy Process v2'
  )

  return { props: { ...response.props, hostName: req?.headers?.host } }
}

export default BuyProcessV2PageById
