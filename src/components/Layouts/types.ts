import { ContentfulBlock, ContentfulTemplateBuyProcess, ContentfulTemplateCatalog, ContentfulTemplateQuotation, SitesNames } from "../../types"
import { ContentfulTemplateBranchOfficesMain } from "../../types/contentful/content-model/tm-branch-offices-main"
import { ContentfulTemplateCertificates } from "../../types/contentful/content-model/tm-certificates"
import { ContentfulTemplateComplaintsBook } from "../../types/contentful/content-model/tm-complaints-book"
import { ContentfulTmCustomerService } from "../../types/contentful/content-model/tm-customer-service"
import { ContentfulTemplateError } from "../../types/contentful/content-model/tm-error"
import { ContentfulTemplateMaintenanceGuidelines } from "../../types/contentful/content-model/tm-maintenance-guidelines"
import { ContentfulTemplateTechnicalServiceMain } from "../../types/contentful/content-model/tm-technical-service-main"
import { ContentfulTemplateTechnicalServiceSuccess } from "../../types/contentful/content-model/tm-technical-service-success"
import { ContentfulTemplateTermsAndConditions } from "../../types/contentful/content-model/tm-terms-and-conditions"

export interface renderTemplateProps {
  templateType?: string
  template:
    | ContentfulTemplateCatalog
    | ContentfulTemplateQuotation
    | ContentfulTemplateError
    | ContentfulTemplateTechnicalServiceMain
    | ContentfulTemplateBuyProcess
    | ContentfulTemplateTechnicalServiceSuccess
    | ContentfulTemplateCertificates
    | ContentfulTemplateMaintenanceGuidelines
    | ContentfulTemplateBranchOfficesMain
    | ContentfulTemplateTermsAndConditions
    | ContentfulTmCustomerService
    | ContentfulTemplateComplaintsBook
  blocks: ContentfulBlock[]
  site: SitesNames
  slug: string
  pageTitle: string
}
