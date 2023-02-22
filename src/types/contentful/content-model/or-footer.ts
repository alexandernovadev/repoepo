import { ContentfulAtLink } from '.'
import { MlRichTextProps } from '@gac/core-components/lib/atomic-components-react/components/UI/molecules/ml-rich-text/types'
import { Sites } from '../common'
import { AnalyticsHandler } from '@gac/core-components/lib/atomic-components-react/utils'

export interface ContentfulOrFooter extends Sites, AnalyticsHandler {
  brand: ContentfulAtLink
  workingSchedule: {
    title?: string
    schedules: {
      days: string
      hours: string
    }[]
  }[]
  linksColumns: {
    title: string
    links: ContentfulAtLink[]
  }[]
  footerFirm: {
    leftLink: ContentfulAtLink
    middleText: MlRichTextProps['text']
    socialMediaLinks: ContentfulAtLink[]
  }
}
