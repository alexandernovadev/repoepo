import { toCapitalize } from '../../../utils/toCapitalize'

export const getFormatBranchOffice = (branchs: any) => {
  const newBranchOfficesArray = branchs?.map((branch: any) => {
    if (branch?.brands){
      return branch.name + '/ ' + branch?.brands?.map((brand: any) => toCapitalize(brand.value)).join('/ ')
    } else {
      return branch.name
    }
  })

  return newBranchOfficesArray
}

export const getDocumentValidation = (type: string, value: string) => {
  switch (type) {
    case 'DNI':
      return /^[0-9]{1,8}$/.test(value)
    case 'C.E.':
      return /^([a-zA-Z0-9_-]){1,12}$/.test(value)
  }
 }

 export const getDocumentValidationError = (type: string, value: string) => {
  switch (type) {
    case 'DNI':
      return value.length === 8 ? false : true
    case 'C.E.':
      return value.length === 12 ? false : true
  }
 }