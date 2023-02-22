import { Sites } from '../../../types'

export interface UseComponentProps extends Sites {
  activeFilters: any
  setFilters: (
    field: string,
    value: any,
    label: string,
    id: string,
    query: string,
    depends?: string
  ) => void
}

export enum AtSelectCatalogVariants {
  SMALL = 'small',
  MEDIUM = 'medium'
}
