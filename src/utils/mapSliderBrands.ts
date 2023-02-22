export const mapBrand = (item: any) => ({
  src: item.brand.brandImage.file.url,
  alt: item.brand.labelImage,
  href: item.catalogLink
})
