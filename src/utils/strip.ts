const siteSubstring = /^\w{2}\s?\|\s?/i

const extensionSubstring = /\..*$/i

const strip = (exp: RegExp) => (value: string) => {
  if (typeof value !== 'string') {
    throw new TypeError('A string type is required for this function')
  }

  return value.replace(exp, '')
}

export const stripFileExtension = strip(extensionSubstring)

export const stripSite = strip(siteSubstring)
