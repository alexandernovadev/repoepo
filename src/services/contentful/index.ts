import { ContentfulPgPage } from '../../types'
import { cleanContentfulEntry } from '../../utils/contentful'
import { client } from '../../services/contentful/client'
import { findContentfulSite } from '../../sites/gacSites'

export const getPageEntries = async <T = unknown>(
  query?: Record<string, unknown>
) => {
  const result = await client.getEntries<T>({
    content_type: 'pgPage',
    ...query
  })

  return result
}

export const getAllSlugs = async () => {
  const { items } = await getPageEntries<{ slug: string }>({
    select: 'fields.slug'
  })

  return items.map((item) =>
    item.fields.slug.split('/').filter((path) => Boolean(path))
  )
}

export const getPageBySlug = async (slug: string, site: string) => {
  const actualSite = findContentfulSite(site)
  const collection = await getPageEntries<ContentfulPgPage>({
    'fields.slug': slug,
    'fields.site': actualSite,
    include: 10
  })
  return collection.items.length
    ? cleanContentfulEntry(collection.items[0])
    : null
}

export const getContentTypeByName = async (
  contentType: string,
  fieldsName: string,
  site: string
) => {
  const actualSite = findContentfulSite(site)
  const results = await client.getEntries({
    include: 10,
    content_type: contentType,
    'fields.name': fieldsName,
    'fields.site': actualSite
  })

  return cleanContentfulEntry(results.items[0]) as any
}

export const getAssetByNameAndResize = async (name: string) => {
  try {
    const assets = await client.getAssets({ include: 1, 'fields.title': name })
    const myAsset = assets.items[0]
    const fileUrl = myAsset?.fields.file.url
    const fileType = myAsset?.fields.file.contentType
    const fileName = myAsset?.fields.file.fileName

    return {
      url: 'https:' + fileUrl + '?w=1200&h=630&fit=fill',
      type: fileType,
      name: fileName
    }
  } catch (error) {
    console.error('error')
    return {}
  }
}
