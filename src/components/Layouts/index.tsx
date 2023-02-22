import Head from 'next/head'
import { useRouter } from 'next/router'
import {
  AtMessage,
  AtMessageVariant,
  OrFooter,
  OrHeader
} from '@gac/core-components'
import { formatHeaderData } from '../../utils/formatHeaderData'
import { event } from '../../utils/ga'
import { LayoutProps } from '../../types/Layouts'
import { renderTemplate } from './renderTemplate'
import useShowChat from '../../hooks/useShowChat'
import { ContentfulOrFooter, SitesNames } from '../../types'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

export const Layout = ({
  templateType,
  pageTitle,
  contentfulPage: {
    navbar,
    footer,
    blocks,
    template,
    gubagooChat,
    description,
    keywords,
    noindex,
    nofollow,
    slug
  },
  site,
  children
}: LayoutProps) => {
  const { formatData } = formatHeaderData(navbar)
  const router = useRouter()
  const current = router.asPath.replace(/(\?|#).*/, () => '')
  const { onlineStatus } = useOnlineStatus()
  useShowChat(gubagooChat, site)

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        {description && <meta name='description' content={description} />}
        {keywords?.length ? (
          <meta name='keywords' content={keywords.join(', ')} />
        ) : null}
        <meta
          name='robots'
          content={`${noindex ? 'noindex' : 'index'}, ${
            nofollow ? 'nofollow' : 'follow'
          }`}
        />
      </Head>
      {onlineStatus ? (
        <></>
      ) : (
        <AtMessage
          className='top-0'
          variant={AtMessageVariant.OFFLINE}
          description='Por favor reestablece la conexión de internet para poder navegar'
        />
      )}
      <OrHeader
        site={site as SitesNames}
        analyticsHandler={event}
        data={{ ...formatData, current }}
        variant={navbar?.variant}
        className={onlineStatus ? 'top-0' : 'top-[56px] lg:top-0'}
      />
      <div
        className={
          // onlineStatus ? 'bodyContainer' :
          // 'bodyContainerOffline'
          'bodyContainer'
        }
      >
        {children ??
          renderTemplate({
            templateType,
            blocks,
            template,
            site,
            slug,
            pageTitle
          })}
        {footer && (
          <OrFooter
            {...(footer as ContentfulOrFooter)}
            analyticsHandler={event}
            className='mt-auto'
            site={site as SitesNames}
          />
        )}
      </div>
    </div>
  )
}
