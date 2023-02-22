import { SitesNames } from '../types'
import { getCompanyRequestHeader } from './sites'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL

export const fetchWithoutToken = async (
  endpoint: string,
  site: SitesNames,
  data?: unknown,
  method = 'GET',
  headers?: any,
  signal?: AbortSignal
) => {
  const url = `${BASE_URL}${endpoint}`
  // const siteHeader = process.env.NEXT_PUBLIC_ENVIRONMENT === 'master' ? {} : getCompanyRequestHeader(site)
  const siteHeader = getCompanyRequestHeader(site)

  if (method === 'GET') {
    const response = await fetch(url, {
      headers: { ...headers, ...siteHeader },
      signal
    })
    return await response.json()
  }

  const response = await fetch(url, {
    method,
    headers: {
      ...headers,
      ...siteHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    signal
  })

  return await response.json()
}

export const fetchWithToken = async (
  endpoint: string,
  site: SitesNames,
  data?: unknown,
  method = 'GET',
  headers?: any,
  signal?: AbortSignal
) => {
  const url = `${BASE_URL}${endpoint}`
  const token = localStorage.getItem('access_token') || ''
  const siteHeader = getCompanyRequestHeader(site)

  if (method === 'GET') {
    const response = await fetch(url, {
      headers: {
      ...headers,
      ...siteHeader,
        Authorization: token
      },
      signal
    })
    return await response.json()
  }

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: token,
      ...headers,
      ...siteHeader,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    signal
  })

  return await response.json()
}
