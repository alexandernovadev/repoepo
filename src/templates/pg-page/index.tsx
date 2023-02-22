import React from 'react'
import { BlockList } from '../../components/BlocksList'
import { ContentfulBlock, Sites } from '../../types'

export interface PgPageProps extends Sites {
  blocks: ContentfulBlock[]
}

export const PgPage = ({ blocks, site }: PgPageProps) => {
  return <BlockList site={site} blocks={blocks} />
}
