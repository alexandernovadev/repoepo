import { GetServerSidePropsContext } from 'next'
import { getContentTypeByName, getPageBySlug } from '../src/services'
import { gacSites } from '../src/sites/gacSites'
import PgPage from './[...slug]'

export const getServerSideProps = async ({
  req
}: GetServerSidePropsContext) => {
  const currentSite =
    process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
      ? process.env.NEXT_PUBLIC_CURRENT_SITE
      : req?.headers?.host
  const [page, global] = await Promise.all([
    getPageBySlug('/', currentSite as string),
    getContentTypeByName(
      'globalInformation',
      `${gacSites(currentSite as string)} | Global Information`,
      currentSite as string
    )
  ])

  const props = {
    ...page,
    global,
    currentSite: currentSite
  }

  if (page && global) {
    return { props }
  }

  return { notFound: true }
}

export default PgPage
