import { PgPage } from '../../templates/pg-page'
// import { TmBuyProcess } from '../../templates/tm-buy-process'
import { TmCatalog } from '../../templates/tm-catalog'
import { TmError } from '../../templates/tm-error'
import { TmNewsDetail } from '../../templates/tm-news-detail'
import { TmQuotation } from '../../templates/tm-quotation'
import { TmTechnicalServiceMain } from '../../templates/tm-technical-service-main'
import { TmCertificates } from '../../templates/tm-certificates'
import { TmTechnicalServiceSuccess } from '../../templates/tm-technical-service-success'
import { TmTermsAndConditions } from '../../templates/tm-terms-and-conditions'
import { TmMaintenanceGuidelines } from '../../templates/tm-maintenance-guidelines'
import { TmBranchOfficesMain } from '../../templates/tm-branch-offices-main'
import { TmIframe } from '../../templates/tm-iframe'
import { TmCustomerService } from '../../templates/tm-customer-service'
import { TmComplaintsBook } from '../../templates/tm-complaints-book'
import {
  // ContentfulTemplateBuyProcess,
  ContentfulTemplateCatalog,
  ContentfulTemplateQuotation
} from '../../types'
import { ContentfulTemplateError } from '../../types/contentful/content-model/tm-error'
import { ContentfulTemplateTechnicalServiceMain } from '../../types/contentful/content-model/tm-technical-service-main'
import { ContentfulTemplateTechnicalServiceSuccess } from '../../types/contentful/content-model/tm-technical-service-success'
import { ContentfulTemplateCertificates } from '../../types/contentful/content-model/tm-certificates'
import { ContentfulTemplateMaintenanceGuidelines } from '../../types/contentful/content-model/tm-maintenance-guidelines'
import { ContentfulTemplateBranchOfficesMain } from '../../types/contentful/content-model/tm-branch-offices-main'
import { ContentfulTemplateTermsAndConditions } from '../../types/contentful/content-model/tm-terms-and-conditions'
import { ContentfulTmCustomerService } from '../../types/contentful/content-model/tm-customer-service'
import { ContentfulTemplateComplaintsBook } from '../../types/contentful/content-model/tm-complaints-book'
import { renderTemplateProps } from './types'
// import { TmBuyProcessV2 } from '../../templates/tm-buy-process-v2'

export const renderTemplate = ({
  templateType,
  blocks,
  template,
  site,
  slug,
  pageTitle
}: renderTemplateProps) => {
  switch (templateType) {
    case 'tmCatalog':
      return (
        <TmCatalog
          site={site}
          blocks={blocks}
          template={template as ContentfulTemplateCatalog}
        />
      )

    case 'tmQuotation':
      return (
        <TmQuotation
          site={site}
          template={template as ContentfulTemplateQuotation}
        />
      )

    case 'tmError':
      return (
        <TmError site={site} template={template as ContentfulTemplateError} />
      )

    case 'tmNews':
      return <TmNewsDetail site={site} template={template} />

    // case 'tmBuyProcess':
    //   if ((template as ContentfulTemplateBuyProcess).v2) {
    //     return (
    //       <TmBuyProcessV2
    //         site={site}
    //         template={template as ContentfulTemplateBuyProcess}
    //       />
    //     )
    //   }

    //   break

    // return (
    //   <TmBuyProcess
    //     slug={slug}
    //     site={site}
    //     template={template as ContentfulTemplateBuyProcess}
    //   />
    // )

    case 'tmTechnicalServiceMain':
      return (
        <TmTechnicalServiceMain
          slug={slug}
          site={site}
          template={template as ContentfulTemplateTechnicalServiceMain}
        />
      )

    case 'tmTechnicalServiceSuccess':
      return (
        <TmTechnicalServiceSuccess
          site={site}
          template={template as ContentfulTemplateTechnicalServiceSuccess}
        />
      )

    case 'tmCertificates':
      return (
        <TmCertificates
          site={site}
          template={template as ContentfulTemplateCertificates}
          pageTitle={pageTitle}
        />
      )

    case 'tmMaintenanceGuidelines':
      return (
        <TmMaintenanceGuidelines
          site={site}
          template={template as ContentfulTemplateMaintenanceGuidelines}
        />
      )

    case 'tmBranchOfficesMain':
      return (
        <TmBranchOfficesMain
          site={site}
          template={template as ContentfulTemplateBranchOfficesMain}
        />
      )

    case 'tmTermsAndConditions':
      return (
        <TmTermsAndConditions
          site={site}
          template={template as ContentfulTemplateTermsAndConditions}
        />
      )

    case 'tmCustomerService':
      return (
        <TmCustomerService
          site={site}
          template={template as ContentfulTmCustomerService}
        />
      )

    case 'tmComplaintsBook':
      return (
        <TmComplaintsBook
          site={site}
          template={template as ContentfulTemplateComplaintsBook}
        />
      )

    case 'tmIframe':
      return <TmIframe template={template} />
    default:
      return <PgPage site={site} blocks={blocks} />
  }
}
