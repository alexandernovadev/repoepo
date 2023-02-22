import { Dispatch, SetStateAction } from 'react'
import { certificatesStateProps } from '../../redux/features/certificatesSlice'
import { ContentfulTags, Sites } from '../../types'
import { ContentfulTemplateCertificates } from '../../types/contentful/content-model/tm-certificates'

export interface TmCertificatesProps extends Sites {
  template: ContentfulTemplateCertificates,
  pageTitle: string
}

export interface CerticatesState {
  certificates: certificatesStateProps
}

export interface ToolsProps extends Sites {
  setColumns: Dispatch<SetStateAction<any>>
  columns: number
  sort: number
  setSort: Dispatch<SetStateAction<number>>
}

export interface CarsGridProps extends Sites {
  columns: number
  placeholderImage?: string
  certificatesTag: Array<ContentfulTags>
}

export interface Brand {
  id?: string
  value?: string
  slug?: string
}
