/* eslint-disable @typescript-eslint/no-explicit-any */
import { Entry } from 'contentful'
import { ComponentContentType } from '../types'

export const cleanContentfulEntry = <
  T = Record<string, any & { fields?: Record<string, any> }>
>(
  data: Entry<T>
) => {
  let result: any = {}
  const { fields, sys } = data

  if (
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    sys?.contentType?.sys?.id === ComponentContentType.AT_LINK &&
    (fields as Record<string, any>).actionUrl
  ) {
    ;(fields as Record<string, any>).href = (
      fields as Record<string, any>
    ).actionUrl
  }

  if (fields) {
    Object.keys(fields).forEach((key) => {
      let field = (fields as Record<string, any>)[key]
      if (field.fields) {
        result = {
          ...result,
          [key]: {
            ...cleanContentfulEntry(field),
            CONTENT_TYPE: field.sys?.contentType?.sys.id ?? null,
            CONTENTFUL_ID: field.sys?.id ?? null
          }
        }
        return
      }

      if (Array.isArray(field)) {
        const hasFields = field.some((item: Entry<any>) => !!item.fields)

        if (!hasFields) {
          result = { ...result, [key]: field }
          return
        }

        result = {
          ...result,
          [key]: field.map((item) => ({
            ...cleanContentfulEntry(item),
            CONTENT_TYPE: item.sys?.contentType?.sys.id ?? null,
            CONTENTFUL_ID: item.sys?.id ?? null
          }))
        }

        return
      }

      if (key === 'file' && /^image\/(?!svg)/.test(field.contentType)) {
        field = {
          ...field,
          url: `${field.url}?fm=webp`
        }
      }

      result[key] = field
    })
  }

  return result as T
}
