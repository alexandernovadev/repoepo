export const findContentfulBrand = (brand: string, contentfulBrands: any) => {
  const brandName = brand.toLowerCase()
  const dataBrand = contentfulBrands.find(
    (item: any) => item.title.toLowerCase() === brandName
  )

  return dataBrand?.brand
}
