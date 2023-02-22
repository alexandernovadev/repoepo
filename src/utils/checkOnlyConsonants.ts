const allConsonantsRegex = /^[^aeiou]+$/i

export const checkOnlyConsonants = (toCheck: string): boolean => {
  if (allConsonantsRegex.test(toCheck)) {
    return true
  } else {
    return false
  }
}
