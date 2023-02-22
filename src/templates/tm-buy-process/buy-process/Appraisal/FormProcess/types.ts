import { BuyProcessStateProps } from '../../../../../redux/features/buyProcessSlice'
import { BuyProcessV2State } from '../../../../../redux/features/buyProcessV2Slice'
import { Sites } from '../../../../../types'

export type YearsResponse = { year: number }[]

export type PatentResponse = {
  brand: {
    id: number
    name: string
  }
  model: string
  modelId: number
  version: string
  versionId: number
  year: number
}

export type BrandsResponse = {
  id: number
  description: string
  isActive: 0 | 1
}[]

export type ModelsResponse = {
  id: number
  brandId: number
  description: string
  isActive: 0 | 1
}[]

export type VersionsResponse = {
  id: number
  modelId: number
  description: string
  isActive: 0 | 1
}[]

export interface FetchValuesState {
  brand?: BrandsResponse
  model?: ModelsResponse
  version?: VersionsResponse
}

export enum PatentAction {
  /** Patent is invalid or an unexpected error has ocurred */
  ERROR,
  /** Initial state */
  PRISTINE,
  /** User has made a query for the patent set */
  SEARCH_STARTED,
  /** Query fetched with valid data */
  SEARCH_FINISHED,
  /** Query didn't throw an error but returned with no data */
  SEARCH_FINISHED_EMPTY
}

export type ActionCallback = (
  action: PatentAction,
  payload?: Partial<BuyProcessStateProps['appraisal']>
) => void

export interface PatentSearchFormProps extends Sites {
  patent: string
  setPatent: (patent: string) => void
  action: ActionCallback
  disabled: boolean
}

export interface AppraisalFormProps extends Sites {
  className?: string
  buttonText?: string
  appraisal: BuyProcessStateProps['appraisal'] | BuyProcessV2State['appraisal']
  submitHandler: (e: any) => Promise<void>
  handler: (value: { name: string; value: string }) => void
  selectState: SelectState
  isUploading: boolean
  hasMissingField: boolean
  setEmailValid: (error: boolean) => void
}

export interface SelectState {
  [field: string]: { disabled: boolean; options?: string[]; loading: boolean }
}
