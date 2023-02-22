import { useEffect, useState } from 'react'
import Head from 'next/head'
import TagManager from 'react-gtm-module'
import useCommonState from '../src/hooks/useCommonState'
import { getContentTypeByName, getPageBySlug } from '../src/services/contentful'
import { Layout } from '../src/components/Layouts'
import { gacSites, getGTMKeyBySite } from '../src/sites/gacSites'
import { SitesNames } from '../src/types'
import { getFaviconForSite } from '../src/helpers/_document/favicon'
import { ClientSideOnly } from '../src/utils/ClientSideOnly'

const PgPage404 = () => {
  const [page, setPage] = useState<any>()
  const [favicon, setFavicon] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)
  const site = gacSites(page?.currentSite) as string

  const get404Props = async (site: string) => {
    const [page, global] = await Promise.all([
      getPageBySlug('404', site),
      getContentTypeByName(
        'globalInformation',
        `${gacSites(site)} | Global Information`,
        site
      )
    ])

    if (page && global) {
      setLoading(false)
      setPage({
        ...page,
        global,
        currentSite: site
      })
    }
  }

  useEffect(() => {
    let currentSite
    currentSite =
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
        ? process.env.NEXT_PUBLIC_CURRENT_SITE
        : window.location.hostname
    get404Props(currentSite as string)
  }, [])

  useEffect(() => {
    let auxFavicon = getFaviconForSite(site as SitesNames)
    setFavicon(auxFavicon)
  }, [site])

  useEffect(() => {
    if (!loading) {
      const tagManagerArgs = {
        gtmId: getGTMKeyBySite(site) as string
      }
      TagManager.initialize(tagManagerArgs)
    }
  }, [site, page])

  useCommonState(page, site)

  return page ? (
    <>
      <ClientSideOnly>
        <Head>
          <link rel='icon' type='image/svg+xml' href={favicon.faviconSvg} />
          <link rel='icon' type='image/png' href={favicon.faviconPng} />
        </Head>
      </ClientSideOnly>
      <Layout
        site={site as SitesNames}
        templateType={page?.template?.CONTENT_TYPE}
        pageTitle={page?.title}
        contentfulPage={page!}
      />
    </>
  ) : (
    <></>
  )
}

export default PgPage404
