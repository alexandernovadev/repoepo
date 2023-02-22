import { AtIcon } from '@gac/core-components'

export const Loading = ({ className = '' }) => (
  <div className={`h-screen ${className}`}>
    <AtIcon type='spinner-dark' />
  </div>
)
