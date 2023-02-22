import { useEffect } from 'react'

export const TmIframe = (template: any) => {
  useEffect(() => {
    const iframe = document.getElementById('legacyIframe')

    if (iframe) {
      ;(iframe as any).src = template?.template?.url
    }
  }, [template])
  return (
    <iframe
      className='w-full h-[var(--page-height)] md:h-[var(--page-height-tablet)] lg:h-[var(--page-height-desktop)]'
      id='legacyIframe'
      src='#'
      style={{
        ['--page-height' as any]: `${template.template.pageHeight}px`,
        ['--page-height-tablet' as any]: `${template.template.pageHeightTablet}px`,
        ['--page-height-desktop' as any]: `${template.template.pageHeightDesktop}px`
      }}
    />
  )
}
