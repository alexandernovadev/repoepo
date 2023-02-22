import { PatentResponse, SelectState } from './types'

export const dependencies = {
  year: ['brand', 'model', 'version'],
  brand: ['model', 'version'],
  model: ['version']
}

export const requiredFields = [
  'year',
  'brand',
  'brandId',
  'model',
  'modelId',
  'version',
  'versionId',
  'mileage',
  'email'
]

export const initialSelectState: SelectState = {
  year: {
    disabled: true,
    options: undefined,
    loading: true
  },
  brand: {
    disabled: true,
    options: undefined,
    loading: false
  },
  model: {
    disabled: true,
    options: undefined,
    loading: false
  },
  version: {
    disabled: true,
    options: undefined,
    loading: false
  }
}

export const onWaitingSelectState = (
  prevState: SelectState,
  hasStarted = true,
  isEmpty = false
): SelectState => ({
  year: {
    disabled: hasStarted,
    options: prevState.year.options,
    loading: hasStarted
  },
  brand: {
    disabled: hasStarted || isEmpty,
    options: prevState.brand.options,
    loading: hasStarted
  },
  model: {
    disabled: hasStarted || isEmpty,
    options: prevState.model.options,
    loading: hasStarted
  },
  version: {
    disabled: hasStarted || isEmpty,
    options: prevState.version.options,
    loading: hasStarted
  }
})

export const emptyCarPlaceholder = {
  year: '',
  brand: '',
  brandId: '',
  model: '',
  modelId: '',
  version: '',
  versionId: ''
}

export const patentResponseMap = (response: PatentResponse) => ({
  brand: response.brand.name,
  brandId: response.brand.id.toString(),
  model: response.model,
  modelId: response.modelId.toString(),
  version: response.version,
  versionId: response.versionId.toString(),
  year: response.year.toString()
})
