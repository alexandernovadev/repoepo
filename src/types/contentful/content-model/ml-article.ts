import { ContentfulAtButton, ContentfulAtLink } from '.'

export type ContentfulMlArticle = {
  title: string
  description: string
  link?: ContentfulAtLink
  button?: ContentfulAtButton
  className?: string
  variant: MlArticleVariants
  image?: any
  imagePlaceholder?: any
  date?: string
}

export enum MlArticleVariants {
  DEFAULT = 'default',
  CONTENT_STRIP_LEFT = 'content-strip-left',
  CONTENT_STRIP_RIGHT = 'content-strip-right',
  CONTENT_STRIP_NEWS_LEFT = 'content-strip-news-left',
  CONTENT_STRIP_NEWS_RIGHT = 'content-strip-news-right'
}
