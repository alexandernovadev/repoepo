import React, { useState } from 'react'
import { MlArticle, MlBreadcrumb, MlRichText } from '@gac/core-components'
import { TmNewsDetailProps } from './types'
import { getCurrentPath } from './getCurrentPath'
import { MlRichTextVariant } from '../../types'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'
export const TmNewsDetail: React.FC<any> = ({
  site,
  template
}: TmNewsDetailProps) => {
  const [path] = useState(getCurrentPath())
  const { onlineStatus } = useOnlineStatus()
  const { title, description, variant, date, image, imagePlaceholder } =
    template.article

  return (
    <div className='container mx-auto'>
      <MlBreadcrumb
        site={site}
        path={path}
        className={`my-2 ml-4 md:mb-7 md:ml-2 lg:mb-10 lg:ml-7 ${
          onlineStatus ? 'mt-20 md:mt-24 lg:mt-10' : 'mt-32 sm:mt-36 lg:mt-10'
        }`}
      />
      <MlArticle
        site={site}
        className='md:mx-2 lg:mx-6 mb-5 md:mb-8'
        image={{
          url: image?.file?.url ?? imagePlaceholder?.file?.url,
          name: image?.title ?? imagePlaceholder?.title
        }}
        date={date}
        variant={variant}
        title={title}
        description={description}
      />
      <div className='lg:flex lg:justify-center md:mb-7 lg:mb-8'>
        <div className='bg-white px-5 py-8 md:px-14 md:py-6 lg:max-w-2xl rounded-2xl shadow-card'>
          <MlRichText
            variant={MlRichTextVariant.NEWS}
            site={site}
            text={template.content}
          />
        </div>
      </div>
    </div>
  )
}
