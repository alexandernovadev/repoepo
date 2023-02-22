import React from 'react'
import { OrReviews } from '@gac/core-components'
import { mockData } from './mock'
import { Sites } from '../../types'

export interface ReviewsProps extends Sites {}

export const Reviews: React.FC<ReviewsProps> = ({ site }: ReviewsProps) => {
  return <OrReviews className='mx-auto mb-8' {...mockData} site={site} />
}
