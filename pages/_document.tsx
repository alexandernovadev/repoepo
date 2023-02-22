import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentProps as NextDocumentProps
} from 'next/document'
import { getFaviconForSite } from '../src/helpers/_document/favicon'
import { getFontForSite } from '../src/helpers/_document/font'
import { gacSites } from '../src/sites/gacSites'
import { SitesNames } from '../src/types'

interface DocumentProps extends NextDocumentProps {
  site: SitesNames
}

class MyDocument extends Document<DocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)

    const currentSiteId =
      process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
        ? process.env.NEXT_PUBLIC_CURRENT_SITE
        : ctx.req?.headers?.host
    const currentSite = currentSiteId ? gacSites(currentSiteId) : ''

    return { ...initialProps, site: currentSite }
  }

  render() {
    const font = getFontForSite(this.props.site)
    const favicon = getFaviconForSite(this.props.site)

    return (
      <Html lang='es' className='scroll-smooth'>
        <Head>
          <link
            rel='preload'
            href={font.preloadHref}
            as='font'
            type='font/woff2'
            crossOrigin=''
          />

          <link rel='stylesheet' href={font.cssHref} />
          <link rel='icon' type='image/svg+xml' href={favicon.faviconSvg} />
          <link rel='icon' type='image/png' href={favicon.faviconPng} />
          {this.props.site === SitesNames.SALAZAR_ISRAEL && (
            <script
              async
              src='//salazarisrael.api.useinsider.com/ins.js?id=10005039'
            ></script>
          )}
        </Head>
        <body className={font.bodyClass}>
          <Main />
          <div id='portal'></div>
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
