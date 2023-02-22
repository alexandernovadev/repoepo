import {
  ContentfulAtLink,
  ContentfulAtButton,
  ContentfulOrHeader,
  ContentfulOrFooter,
  ContentfulMlPricingCard
} from './content-model'

export type ContentfulComponent =
  | ContentfulAtLink
  | ContentfulAtButton
  | ContentfulOrHeader
  | ContentfulOrFooter
  | ContentfulMlPricingCard
