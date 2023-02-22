import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useObjectState } from '../../../../../hooks/useObjectState'
import {
  BuyProcessStateProps,
  next,
  update
} from '../../../../../redux/features/buyProcessSlice'
import {
  AppraisalSelection,
  setAppraisal,
  setAppraisalResults,
  setAppraisalSelection
} from '../../../../../redux/features/buyProcessV2Slice'
import { SitesNames } from '../../../../../types'
import { patentRegex } from '../../../../../utils/formatPatent'
import { isValidEmail } from '../../../../../utils/isValidEmail'
import {
  dependencies,
  emptyCarPlaceholder,
  initialSelectState,
  onWaitingSelectState,
  requiredFields
} from './fieldConfig'
import {
  getBrands,
  getModels,
  getVersions,
  getYears,
  suggestedPrice
} from './resolvers'
import { ActionCallback, FetchValuesState, PatentAction } from './types'

/** Controller for handling form logic for the appraisal process, which features
 *  autocomplete functionality through its patent field, needing to differentiate
 * between manually set select fields or autocompleted state, and dependant fields,
 *  requiring reset of dependents fields */
export const useAppraisalController = (
  appraisal: BuyProcessStateProps['appraisal'],
  contact: BuyProcessStateProps['contact']['contactData'],
  site: SitesNames,
  v2 = false
) => {
  const dispatch = useDispatch()
  const { brandId, modelId, year, isAutocompleted, patent } = appraisal
  const { email } = contact
  const [isEmailValid, setEmailValid] = useState(() =>
    isValidEmail(email as string)
  )
  const [isUploading, setIsUploading] = useState(false)

  const [isApraisalError, setIsApraisalError] = useState(false)

  const [selectState, setSelectState] = useObjectState(initialSelectState)
  const [fetchValuesState, setFetchValuesState] =
    useObjectState<FetchValuesState>({})

  /** Handle valid response for submitting appraisal, a `null` response
   *  indicates a car that's too old for discount, so it should not count,
   * while in a successful case, send simulation to the buying process
   * (v1 or v2) for subsequent handling
   **/
  const submitHandler = async (e: any) => {
    setIsUploading(true)
    e.preventDefault()
    // Prepare data for getting appraisal, then go to next view
    let response
    try {
      response = await suggestedPrice(appraisal, contact, site)
    } catch {
      setIsApraisalError(true)
      return
    }

    if (response.error || (!response.result && !v2)) {
      setIsApraisalError(true)
      return
    }

    if (response.result === null && v2) {
      dispatch(setAppraisalResults(null))
      dispatch(setAppraisalSelection(AppraisalSelection.TOO_OLD))
      return
    }

    const payload = {
      appraisalSimulation: {
        ...response.result,
        ...(patentRegex.test(patent) ? { patent } : { patent: '' })
      }
    }

    dispatch(
      !v2 ? update(payload) : setAppraisalResults(payload.appraisalSimulation)
    )
    dispatch(!v2 ? next() : setAppraisalSelection(AppraisalSelection.RESULTS))
  }

  const handler = (payload: any) => {
    const isFieldWithId =
      payload.name === 'brand' ||
      payload.name === 'model' ||
      payload.name === 'version'
    const isSelectField = isFieldWithId || payload.name === 'year'
    // Get ID associated with field description
    let id
    if (isFieldWithId) {
      id = {
        [`${payload.name}Id`]: (fetchValuesState as any)[payload.name].find(
          (value: any) => value.description === payload.value
        ).id
      }
    }

    const fieldUpdate = {
      appraisal: {
        [payload.name]: payload.value,
        ...id,
        ...(isSelectField ? { isAutocompleted: false } : {})
      }
    }

    dispatch(!v2 ? update(fieldUpdate) : setAppraisal(fieldUpdate.appraisal))
  }

  const hasMissingField =
    !!requiredFields.find(
      // @ts-expect-error requiredFields is a direct map of fields from appraisal
      (field) => appraisal[field] === ''
    ) || !isEmailValid

  /** Callback for handling different responses delivered by the patent autocompletion field */
  const optionsCallback: ActionCallback = (action, payload) => {
    switch (action) {
      case PatentAction.ERROR: {
        setSelectState({ ...initialSelectState, year: selectState.year })
        const empty = { patent: '', ...emptyCarPlaceholder }
        dispatch(v2 ? setAppraisal(empty) : update({ appraisal: empty }))
        break
      }
      case PatentAction.SEARCH_STARTED: {
        setSelectState(onWaitingSelectState(selectState))
        break
      }
      case PatentAction.SEARCH_FINISHED: {
        setSelectState(onWaitingSelectState(selectState, false))
        dispatch(
          v2
            ? setAppraisal(payload!)
            : update({ appraisal: { ...appraisal, ...payload } })
        )
        break
      }
      case PatentAction.SEARCH_FINISHED_EMPTY: {
        setSelectState(onWaitingSelectState(selectState, false, true))
        break
      }
      default:
        throw new Error('Invalid action')
    }
  }

  const cleanField = (dependant: string, hasDependantValue = false) => {
    setSelectState({
      [dependant]: {
        ...initialSelectState[dependant],
        loading: hasDependantValue
      }
    })

    if (!isAutocompleted) {
      const payload = { appraisal: { [dependant]: '', [`${dependant}Id`]: '' } }

      dispatch(v2 ? setAppraisal(payload.appraisal) : update(payload))
    }
  }

  const updateSelectField = (response: any, field: string) => {
    setFetchValuesState({ [field]: response })
    setSelectState({
      [field]: {
        disabled: false,
        options: response.map((o: any) => o.description),
        loading: false
      }
    })
  }

  useEffect(() => {
    getYears(site).then((options) =>
      setSelectState({ year: { disabled: false, options, loading: false } })
    )
  }, [])

  // If there's no value set, should do nothing
  const noData: any = {
    brand: year === '',
    model: year === '' || brandId === '',
    version: modelId === ''
  }

  // Besides the year field which depends on nothing,
  // the rest of the select fields require other fields
  // defined in the dependencies object

  useEffect(() => {
    dependencies.year.forEach((dep) => cleanField(dep, !noData[dep]))
    if (noData.brand) return
    getBrands(year, site).then((res) => updateSelectField(res, 'brand'))
  }, [year])

  useEffect(() => {
    dependencies.brand.forEach((dep) => cleanField(dep, !noData[dep]))
    if (noData.model) return
    getModels(year, brandId, site).then((res) =>
      updateSelectField(res, 'model')
    )
  }, [brandId])

  useEffect(() => {
    dependencies.model.forEach((dep) => cleanField(dep, !noData[dep]))
    if (noData.version) return
    getVersions(modelId, site).then((res) => updateSelectField(res, 'version'))
  }, [modelId])

  return {
    selectState,
    isUploading,
    hasMissingField,
    isApraisalError,

    handler,
    optionsCallback,
    submitHandler,
    setIsApraisalError,
    setEmailValid
  }
}
