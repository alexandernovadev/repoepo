import React from 'react'
import {
  BlockContentType,
  ContentfulAtButton,
  ContentfulBlock,
  ContentfulMlCardNews,
  ContentfulMlLinkList,
  ContentfulMlRichText,
  ContentfulOrContainer,
  ContentfulOrHomeBanner,
  ContentfulOrSlider,
  SitesNames
} from '../../types'
import {
  MlCardBasic,
  MlCardNews,
  MlHeading,
  MlRichText,
  OrContainer,
  MlVertical,
  MlLinkList,
  MlLinkListColor,
  AtButton,
  OrNewsContainer
} from '@gac/core-components'
import { BlockList } from '../BlocksList'
import { ContentfulMlVertical } from '../../types/contentful/content-model/ml-vertical'
import { ContentfulMlHeading } from '../../types/contentful/content-model/ml-heading'
import { ContentfulMlPromotionsCard } from '../../types/contentful/content-model/ml-promotions-card'
import { HomeBanner } from '../HomeBanner'
import { event } from '../../utils/ga'
import { renderSlider } from '../Slider/renderSlider'
import { Reviews } from '../Reviews'
import { ContentfulOrNewsContainer } from '../../types/contentful/content-model/or-news-container'

export interface BlockProps {
  block: ContentfulBlock
  className?: string
  site: SitesNames
}

export const Block = ({ block, className = '', site }: BlockProps) => {
  switch (block.CONTENT_TYPE) {
    case BlockContentType.MlRichText: {
      const { text, options, variant } = block as ContentfulMlRichText
      return (
        <MlRichText
          variant={variant}
          site={site as SitesNames}
          text={text}
          options={options}
          className={className}
        />
      )
    }

    case BlockContentType.OrContainer: {
      const { blocks } = block as ContentfulOrContainer

      return (
        <OrContainer
          {...(block as ContentfulOrContainer)}
          site={site as SitesNames}
          analyticsHandler={event}
        >
          <BlockList site={site} blocks={blocks} />
        </OrContainer>
      )
    }

    case BlockContentType.OrNewsContainer: {
      const newsContainerBlock = block as ContentfulOrNewsContainer
      return (
        <OrNewsContainer
          {...newsContainerBlock}
          news={newsContainerBlock.news.map((block) => ({
            button: block.button,
            link: block.link,
            description: block.description,
            title: block.title,
            image: block.image.file.url,
            variant: block.variant,
            analyticsHandler: event,
            site
          }))}
          site={site as SitesNames}
          analyticsHandler={event}
        />
      )
    }

    case BlockContentType.OrSlider: {
      const { type, items, disableLoop } = block as ContentfulOrSlider
      return <>{renderSlider(type, items, !disableLoop, site)}</>
    }

    case BlockContentType.AtButton: {
      const { label, variant } = block as ContentfulAtButton

      return (
        <AtButton
          analyticsHandler={event}
          variant={variant}
          label={label}
          site={site as SitesNames}
        />
      )
    }

    case BlockContentType.MlHeading: {
      const {
        title,
        description,
        backgroundColor,
        marginBottom,
        paddingTop,
        paddingBottom,
        alignment,
        isH1
      } = block as ContentfulMlHeading

      return (
        <MlHeading
          backgroundColor={backgroundColor}
          title={title}
          description={description}
          marginBottom={marginBottom}
          paddingTop={paddingTop}
          paddingBottom={paddingBottom}
          alignment={alignment}
          isH1={isH1}
          site={site as SitesNames}
        />
      )
    }

    case BlockContentType.MlCardBasic: {
      const { title, description, image, button, link } =
        block as ContentfulMlPromotionsCard

      return (
        <MlCardBasic
          title={title}
          description={description}
          image={image.file.url}
          imageDescription={image.title}
          button={button}
          link={link}
          analyticsHandler={event}
          site={site as SitesNames}
        />
      )
    }

    case BlockContentType.MlCardNews: {
      const { title, description, image, variant, button, link } =
        block as ContentfulMlCardNews
      return (
        <MlCardNews
          button={button}
          link={link}
          description={description}
          title={title}
          image={image.file.url}
          variant={variant}
          analyticsHandler={event}
          site={site as SitesNames}
        />
      )
    }

    case BlockContentType.MlVertical: {
      const { variant, text, image } = block as ContentfulMlVertical

      return (
        <MlVertical
          text={text}
          variant={variant}
          image={image}
          imageAlt={image?.title}
          site={site as SitesNames}
        />
      )
    }

    case BlockContentType.MlLinkList: {
      const { links, linkColor } = block as ContentfulMlLinkList

      return (
        <MlLinkList
          analyticsHandler={event}
          linkColor={linkColor as MlLinkListColor}
          links={links}
          site={site as SitesNames}
        />
      )
    }

    case BlockContentType.OrHomeBanner: {
      return <HomeBanner {...(block as ContentfulOrHomeBanner)} site={site} />
    }

    case BlockContentType.OrReviews: {
      return <Reviews site={site} />
    }

    default:
      return null
  }
}
