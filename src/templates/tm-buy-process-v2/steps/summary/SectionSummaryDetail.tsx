import { QuoteDataItem } from '../../../tm-quotation/QuotationCard'
import { summaryClasees } from '../../common/classes'
import { DetailsSummary } from '../../common/types'

export const SectionSummaryDetail = ({
  itemsSummary,
  site,
  title
}: DetailsSummary) => {
  const {
    titleSection,
    cardSubtitleContact,
    itemListContainer,
    cardSeparator
  } = summaryClasees

  return (
    <>
      <p className={titleSection}>{title}</p>

      {itemsSummary.map((item, index) => (
        <div key={index}>
          <p className={cardSubtitleContact}>{item?.title}</p>
          <dl className={itemListContainer}>
            {item?.items?.map((itemList, i) => (
              <QuoteDataItem
                key={`detail-${i}`}
                name={itemList?.label!}
                value={itemList?.value as string}
                site={site}
              />
            ))}
          </dl>
          {index < itemsSummary.length - 1 && <hr className={cardSeparator} />}
        </div>
      ))}
    </>
  )
}
