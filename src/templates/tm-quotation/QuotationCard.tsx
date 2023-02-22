import { useMemo } from 'react'
import { SitesNames } from '../../types'
import {
  cardClasses,
  cardImageClasses,
  quoteDataItemClassesMultiLine,
  quoteDataItemClassesSingleLine,
  cardSectionTitleClasses,
  getQuoteDataItemSiteClasses
} from './classes'
import { mapCarTypeProperty, mapClientProperty } from './data'
import { QuotationCardProps, QuoteDataItemProps } from './types'

export const QuotationCard = ({ car, client, site }: QuotationCardProps) => (
  <div className={cardClasses}>
    <img
      loading='lazy'
      width='auto'
      height='auto'
      className={cardImageClasses}
      src={car!.image.src}
      alt={car!.image.alt}
    />
    <div>
      <p className={cardSectionTitleClasses}>Datos auto</p>
      <dl className='flex flex-col gap-2'>
        {Object.entries(car!).map(
          ([name, value]) =>
            typeof value !== 'object' &&
            name !== 'isNew' &&
            value && (
              <QuoteDataItem
                key={name}
                name={mapCarTypeProperty(name, car?.isNew!)}
                value={value}
                isHighlighted={name === 'price'}
                site={site}
              />
            )
        )}
      </dl>
    </div>
    <hr className='bg-main-01' />
    <div>
      <p className={cardSectionTitleClasses}>Detalles solicitante</p>
      <dl className='flex flex-col gap-6 md:gap-2'>
        {Object.entries(client!).map(([name, value]) => {
          return (
            <QuoteDataItem
              key={name}
              name={
                name === 'rut' && site === SitesNames.WIGO_MOTORS
                  ? 'DNI'
                  : mapClientProperty[name]
              }
              value={value}
              isMultiline
              site={site}
            />
          )
        })}
      </dl>
    </div>
  </div>
)

export const QuoteDataItem = ({
  name,
  value,
  isHighlighted,
  isMultiline,
  site
}: QuoteDataItemProps) => {
  const classes = isMultiline
    ? quoteDataItemClassesMultiLine
    : quoteDataItemClassesSingleLine
  const QuoteDataItemClasses = useMemo(() => {
    return getQuoteDataItemSiteClasses(site)
  }, [site])
  return (
    <div className={classes.container}>
      <dt className={classes.title}>{name}</dt>
      <dd
        className={`
        ${QuoteDataItemClasses.detail} ${classes.detail}
        ${isHighlighted ? 'font-bold' : 'font-medium'}`}
      >
        {value}
      </dd>
    </div>
  )
}
