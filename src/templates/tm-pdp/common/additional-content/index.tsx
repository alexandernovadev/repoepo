import { MlHeading, MlRichText } from '@gac/core-components'
import { AdditionalContentProps } from '../types'

export const AdditionalContent = ({
  heading,
  content,
  site,
  className = ''
}: AdditionalContentProps) => (
  <div className={`${className} bg-white pt-10`}>
    {heading && <MlHeading {...heading} site={site} />}
    {content && <MlRichText {...content} site={site} />}
  </div>
)
