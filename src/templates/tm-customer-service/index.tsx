import { MlBreadcrumb, MlRichText } from '@gac/core-components'
import { useObjectState } from '../../hooks/useObjectState'
import { stripSite } from '../../utils/strip'
import { siteClasses } from './classes'
import { CustomerServiceSteps } from './components'
import { customerServicePath, initialFormState } from './data'
import { submitServiceRequest } from './resolver'
import { CustomerServiceState, TmCustomerServiceProps } from './types'
import { Section } from './components/Section'
import { useMemo } from 'react'

export const TmCustomerService = ({
  template: { title, description, sectionTitle, sections, ...template },
  site
}: TmCustomerServiceProps) => {
  const SiteClasses = useMemo(() => siteClasses(site), [site])

  const [formState, fieldHandler] =
    useObjectState<CustomerServiceState>(initialFormState)

  return (
    <div className='flex justify-center'>
      <div className='flex flex-col items-center container'>
        <MlBreadcrumb
          path={customerServicePath(stripSite(title))}
          site={site}
          className='mt-4 ml-6 mb-8 self-start'
        />
        <div className='flex flex-col items-center lg:w-[51rem] px-4 md:px-2 lg:px-0'>
          <h1
            className={`leading-7 text-xl md:leading-8 md:text-2xl lg:leading-9 lg:text-3xl ${SiteClasses.title}`}
          >
            {stripSite(title)}
          </h1>
          {description && (
            <MlRichText
              className='-mt-2.5 text-gray-600 leading-6  md:text-xl md:leading-7'
              text={description}
              site={site}
            />
          )}
          <CustomerServiceSteps
            fieldHandler={fieldHandler}
            submit={submitServiceRequest}
            state={formState}
            site={site}
            {...template}
          />
          <Section
            sectionTitle={sectionTitle}
            sections={sections}
            site={site}
          />
        </div>
      </div>
    </div>
  )
}
