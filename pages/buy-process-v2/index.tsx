import React from 'react'
import { GetServerSidePropsContext } from 'next'
import { gacSites } from '../../src/sites/gacSites'
import { SitesNames } from '../../src/types'
import { Car } from '../../src/types/contentful/car'
import { getBuyProcessData } from '../../src/utils/buy-process/server'
import { TmBuyProcessView } from '../../src/components/BuyProcess'
import { TmBuyProcessPropsPage } from '../../src/components/BuyProcess/types'

export const BuyProcessV2PageByQuiterId = (
  props: TmBuyProcessPropsPage & {
    car: Car
    notFound: boolean
    carId: string
    hostName: string
  }
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
        financingFeatures: props?.financingFeatures,
        v2: props?.v2
      }}
      slug={props.carId!}
    />
  )
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

  const response = await getBuyProcessData(
    query.quiterId as string,
    site as SitesNames,
    currentSite as string,
    true,
    'Buy Process v2'
  )

  return { props: { ...response.props, hostName: req?.headers?.host } }
}

export default BuyProcessV2PageByQuiterId
