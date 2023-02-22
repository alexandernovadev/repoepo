import { GetServerSidePropsContext } from 'next'
import { getPageBySlug, getContentTypeByName } from '../src/services/contentful'
import { ContentfulPgPage, SitesNames } from '../src/types'
import { Layout } from '../src/components/Layouts'
import useCommonState from '../src/hooks/useCommonState'
import { gacSites } from '../src/sites/gacSites'

const PgPage = (
  props: ContentfulPgPage | { notFound: boolean; currentSite: string }
) => {
  if ((props as { notFound: boolean }).notFound) return <div>404</div>

  const page = props as ContentfulPgPage
  const site = gacSites(props?.currentSite as string)
  const { title } = page

  useCommonState(page, site)

  return (
    <Layout
      site={site as SitesNames}
      templateType={page.template?.CONTENT_TYPE}
      pageTitle={title}
      contentfulPage={page}
    />
  )
}

export const getServerSideProps = async ({
  params,
  req
}: GetServerSidePropsContext<{ slug: [] }>) => {
  const currentSite =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? process.env.NEXT_PUBLIC_CURRENT_SITE
      : req?.headers?.host

  const slug = params?.slug?.join('/') ?? ''
  const [page, global] = await Promise.all([
    getPageBySlug(slug, currentSite as string),
    getContentTypeByName(
      'globalInformation',
      `${gacSites(currentSite as string)} | Global Information`,
      currentSite as string
    )
  ])

  if (page && global) {
    return {
      props: {
        ...page,
        global,
        currentSite: currentSite,
        notFound: !page
      }
    }
  }
  return { notFound: true }
}

export default PgPage
