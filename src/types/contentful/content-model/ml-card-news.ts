import { ContentfulAtButton, ContentfulAtLink } from '.'
import { ContentfulAsset } from '..'

export type ContentfulMlCardNews = {
  variant?: string
  image: ContentfulAsset
  title: string
  description: string
  buttonLabel?: string
  className?: string
  button: ContentfulAtButton
  link: ContentfulAtLink
}
