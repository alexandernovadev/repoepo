import {
  BrandsResponse,
  ModelsResponse,
  PatentResponse,
  VersionsResponse,
  YearsResponse
} from './types'
import { fetchWithoutToken } from '../../../../../utils/fetch'
import { formatNumberToLocale } from '../../../../../utils/formatNumber'
import { BuyProcessStateProps } from '../../../../../redux/features/buyProcessSlice'
import { SitesNames } from '../../../../../types'
import { getCompanyId } from '../../../../../utils/sites'

const appraisalRoute = 'customer/api/appraisal'

export const getPatent = (patent: string, site: SitesNames) =>
  fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${appraisalRoute}/patent?patent=${patent}`,
    {
      headers: {
        companyId: getCompanyId(site).toString()
      }
    }
  ).then((response) => {
    if (response.ok) {
      return response.json() as unknown as PatentResponse
    }
    if (response.status === 404) {
      return {}
    }
    throw new Error('Invalid patent')
  })

export const getYears = (site: SitesNames) =>
  fetchWithoutToken(`${appraisalRoute}/year`, site).then(
    (years: YearsResponse) => years.map((value) => value.year.toString())
  )

export const getBrands = (year: string, site: SitesNames) =>
  fetchWithoutToken(`${appraisalRoute}/brand?year=${year}`, site).then(
    (brands: BrandsResponse) => brands
  )

export const getModels = (year: string, brandId: string, site: SitesNames) =>
  fetchWithoutToken(
    `${appraisalRoute}/model?year=${year}&brandId=${brandId}`,
    site
  ).then((models: ModelsResponse) => models)

export const getVersions = (modelId: string, site: SitesNames) =>
  fetchWithoutToken(`${appraisalRoute}/version?modelId=${modelId}`, site).then(
    (versions: VersionsResponse) => versions
  )

const mileageOptionsFill = Array(20)
  .fill(10000)
  .map((value, idx) => formatNumberToLocale((idx + 1) * value, 'mileage'))

export const mileageOptions = [
  `Menos de ${formatNumberToLocale(10000,'mileage')}`,
  ...mileageOptionsFill,
  `Más de ${formatNumberToLocale(200000,'mileage')}`
]

export const suggestedPrice = (
  appraisal: BuyProcessStateProps['appraisal'],
  contactData: BuyProcessStateProps['contact']['contactData'],
  site: SitesNames
) => {
  const {
    brand,
    brandId,
    mileage,
    model,
    modelId,
    patent,
    version,
    versionId,
    year
  } = appraisal
  const { email } = contactData
  const preparedData = {
    patent: patent === '' ? null : patent,
    email,
    brandId,
    brandName: brand,
    modelId,
    modelName: model,
    versionId,
    versionName: version,
    mileage: parseInt(mileage.replace(/\.| |[a-zA-Zá]/g, '')),
    year: parseInt(year)
  }

  return fetchWithoutToken(appraisalRoute, site, preparedData, 'POST')
}
