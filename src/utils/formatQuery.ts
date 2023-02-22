export const formatCatalogQuery = (query: any) => {
  const urlQuery = Object.keys(query)
    ?.map((key) => {
      if (
        query[key] !== undefined &&
        key !== 'slug' &&
        key !== 'page' &&
        key !== 'city'
      ) {
        if (Array.isArray(query[key])) {
          return (
            '&' + key + '=' + query[key]?.map((item: string) => item).join(',')
          )
        } else {
          return '&' + key + '=' + query[key]
        }
      } else {
        return ''
      }
    })
    .join('')

  return urlQuery
}
