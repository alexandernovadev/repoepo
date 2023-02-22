import {
  ContentfulMlRichText,
  ContentfulAtButton,
  ContentfulAtLink,
  ContentfulMlPricingCard,
  ContentfulMlMenuItem,
  ContentfulMlLinkList,
  ContentfulMlHeading,
  ContentfulMlPromotionsCard,
  ContentfulMlCardNews,
  ContentfulMlVertical,
  ContentfulOrSlider,
  ContentfulMlHorizontal,
  ContentfulMlArticle
} from './content-model'
import { ContentfulOrHomeBanner } from './content-model/or-home-banner'

export type ContentfulCommonBlock =
  | ContentfulAtButton
  | ContentfulMlRichText
  | ContentfulAtLink
  | ContentfulMlPricingCard
  | ContentfulMlMenuItem
  | ContentfulMlLinkList
  | ContentfulMlHeading
  | ContentfulMlLinkList
  | ContentfulMlPromotionsCard
  | ContentfulMlCardNews
  | ContentfulMlVertical
  | ContentfulMlHorizontal
  | ContentfulOrHomeBanner
  | ContentfulOrSlider
  | ContentfulMlArticle
