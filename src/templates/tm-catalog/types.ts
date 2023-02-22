import { Dispatch, SetStateAction } from 'react'
import { catalogStateProps } from '../../redux/features/catalogSlice'
import { ContentfulBlock, ContentfulTemplateCatalog, Sites } from '../../types'

export interface TmCatalogProps extends Sites {
  blocks?: ContentfulBlock[]
  template?: ContentfulTemplateCatalog
}

export interface InformationProps extends Sites {
  template?: ContentfulTemplateCatalog
}

export interface CarsGridProps extends Sites {
  columns: number
}

export interface SelectStoreProps {
  catalog: catalogStateProps
}

export interface ToolsProps extends Sites {
  setColumns: Dispatch<SetStateAction<number>>
  sort: number
  setSort: Dispatch<SetStateAction<number>>
  columns: number
  setInitialFilters: Dispatch<SetStateAction<any>>
  sideBarOptions: any
  companyId: string
}

export interface NotFoundProps extends Sites {
  setInitialFilters: Dispatch<SetStateAction<any>>
  setQueryFilters: Dispatch<SetStateAction<any>>
}

export interface CleanFiltersProps extends NotFoundProps {
  dispatch: Dispatch<SetStateAction<any>>
}

interface optionsProps {
  checkLabel: string
  id: string
  checked: boolean
}

interface optionsSelectProps {
  label: string
  value: string
}

export interface CheckboxProps {
  type: string
  endpoint: string
  data: {
    label: string
    name: string
    options: Array<optionsProps>
  }
}

export interface SelectProps {
  type: string
  data: {
    label: string
    name: string
    needBeforeSelect: boolean
    options: {
      first: {
        endpoint: string
        inputLabel: string
        placeholder: string
        options: Array<optionsSelectProps>
      }
      second: {
        inputLabel: string
        placeholder: string
        endpoint: string
        options: Array<optionsSelectProps>
      }
    }
  }
}

export enum MlSkeletonVariants {
  ML_CARD_PRODUCT = 'ml-card-product',
  ML_SIDEBAR_FILTER = 'ml-sidebar-filter',
  ML_CARD_BRANCH = 'ml-card-branch'
}
