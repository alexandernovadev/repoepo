import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { ContentfulPgPage, SitesNames } from '../../types'
import { Layout } from '../Layouts'

const DEFAULT_SECONDS = 7000

export interface VehicleNotFoundProps extends ContentfulPgPage {
  site: SitesNames
  quiterErrorRedirectTime: string
  notFound: boolean
}

export const PdpNotFound = (props: VehicleNotFoundProps) => {
  const router = useRouter()
  const { site, template, quiterErrorRedirectTime } = props

  useEffect(() => {
    let seconds = DEFAULT_SECONDS

    if (quiterErrorRedirectTime && !Number.isNaN(quiterErrorRedirectTime)) {
      seconds = parseInt(quiterErrorRedirectTime) * 1000
    }

    setTimeout(() => {
      router.push('/catalog?page=1&typeId=2')
    }, seconds)
  }, [])

  return (
    <Layout
      pageTitle='Vehículo no disponible'
      site={site}
      contentfulPage={props}
      templateType={template.CONTENT_TYPE}
    />
  )
}
