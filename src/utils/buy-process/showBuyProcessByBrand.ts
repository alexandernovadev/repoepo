import { ContentfulBrandProps, GlobalInformation } from '../../types'
import { Car } from '../../types/contentful/car'
import { isObjectEmpty } from '../isObjectEmpty'

export const getCorrectFormByPdp = (listOfBuyProcessVersions: {v1?: string, v2?: string}, contentfulVersion: string, car: Car, global: GlobalInformation) => {
  // Validaciones Marca vs Pdp (Contentful)

  if (car?.carType?.value?.toLowerCase() === 'usado') {
    const usedBrand: ContentfulBrandProps = global?.brands?.find((brand) => brand?.title?.toLowerCase() === 'usado')! ?? {}
    if (!usedBrand.showBuyProcessBybrand) return false

    return !getActiveBuyProcessByCarType(contentfulVersion, usedBrand)
  }

  // FDC v1 activo en Marca y FDC v1 activo en tmPDP
  if (listOfBuyProcessVersions?.v1 && contentfulVersion === 'Flujo de compra v1'){
    return true
  }

  // FDC v2 activo en Marca y FDC v2 activo en tmPDP
  if (listOfBuyProcessVersions?.v2 && contentfulVersion === 'Flujo de compra v2'){
    return true
  }

  // Si en la marca no tenemos ningun status activo, por default se debe ver el flujo que este marcado en tmPDP
  if (!listOfBuyProcessVersions) return true

  // Si ninguna de estas condiciones se cumple, no habilitamos el flujo de compra
  return false
}

const getActiveBuyProcessByVersion = (version: string, listOfBuyProcessVersions: any) => {
  if (listOfBuyProcessVersions?.No) return true

  switch (version) {
    case 'Buy Process':
      return !listOfBuyProcessVersions?.v1

    case 'Buy Process v2':  
      return !listOfBuyProcessVersions?.v2

    case 'Pdp':
      return listOfBuyProcessVersions

  }
}

const getActiveBuyProcessByCarType = (version: string, usedBrand: ContentfulBrandProps) => {
  if (usedBrand.showBuyProcessBybrand?.find((options: string) => options === 'No')) return true

  switch (version) {
    case 'Buy Process':
    case 'Flujo de compra v1':
      return !usedBrand.showBuyProcessBybrand?.find((options: string) => options === 'v1')

    case 'Buy Process v2':
    case 'Flujo de compra v2':
      return !usedBrand.showBuyProcessBybrand?.find((options: string) => options === 'v2')
  }
}

export const showbuyProcessByBrand = (car: Car, global: GlobalInformation, version: string) => {
  // searching the correct brand for the actual car
  const activeBrand = global?.brands?.find((brand) => brand?.title?.toLowerCase() === car?.carBrandType?.value?.toLowerCase())

  if (car?.carType?.value?.toLowerCase() === 'usado') {
    const usedBrand: ContentfulBrandProps = global?.brands?.find((brand) => brand?.title?.toLowerCase() === 'usado')! ?? {}
    return getActiveBuyProcessByCarType(version, usedBrand)
  }

  if (activeBrand) {
    let listOfBuyProcessVersions: any = {}
    
    // list map for buyProcess options
    activeBrand.showBuyProcessBybrand?.forEach((buyProcess) => {
      listOfBuyProcessVersions[buyProcess] = true
    })

    // if we dont found any buyProcess options we return all de responses in true
    return isObjectEmpty(listOfBuyProcessVersions) ? false : getActiveBuyProcessByVersion(version, listOfBuyProcessVersions)
  }

  return false
}