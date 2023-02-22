import React from 'react'
import { ContentfulBlock, Sites, SitesNames } from '../../types'
import { Block } from '../Blocks'

export interface BlockListProps extends Sites {
  blocks: ContentfulBlock[]
}

export const BlockList = ({ blocks, site }: BlockListProps) => {
  return (
    <>
      {site &&
        blocks?.map((block, index) => (
          <Block
            site={site as SitesNames}
            key={`${block.CONTENT_TYPE}-${index}`}
            block={block}
          />
        ))}
    </>
  )
}
