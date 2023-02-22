import { itemCardBorderClasses } from './classes'
import { ItemCardProps } from './types'

export const ItemCard = ({
  className = '',
  onClick,
  disabled,
  selected,
  site,
  children
}: ItemCardProps) => {
  const disabledClasses = disabled
    ? 'opacity-50 brightness-50 cursor-not-allowed'
    : ''

  return (
    <button
      className={`border rounded-lg p-4 shadow-horizontal ${disabledClasses} ${itemCardBorderClasses(
        site,
        selected,
        disabled
      )} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
