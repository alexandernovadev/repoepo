declare global {
  interface Window {
    gtag: any
  }
}

export const pageview = () => {
  // window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
  //   page_path: url
  // })
}

export const event = () => {
  // window.gtag('event', gtmData.action, gtmData.params)
}
