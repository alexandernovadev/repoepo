import { AtLink, MlHeading } from '@gac/core-components'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { quoteSelector } from '../../redux/features/quoteSlice'
import { siteImportantPrimaryTextClass } from '../../sites/siteClasses'
import { tmQuotationBodyClasses } from './classes'
import { atLinkData, mlHeadingData } from './data'
import { QuotationCard } from './QuotationCard'
import { TmQuotationProps } from './types'

export const TmQuotation = ({
  site,
  template: { successDescription, successTitle }
}: TmQuotationProps) => {
  const router = useRouter()
  const data = useSelector(quoteSelector)

  useEffect(() => {
    if (!data.car && !data.client) {
      router.push('form-error')
    }
  }, [data])

  return (
    <div className={tmQuotationBodyClasses}>
      {data.car && data.client && (
        <>
          <MlHeading
            site={site}
            {...mlHeadingData}
            titleClassName={`${
              mlHeadingData.titleClassName
            } ${siteImportantPrimaryTextClass(site)}`}
            title={successTitle}
            description={successDescription}
          />
          <QuotationCard {...data} site={site} />
          <AtLink site={site} {...atLinkData} />
        </>
      )}
    </div>
  )
}
