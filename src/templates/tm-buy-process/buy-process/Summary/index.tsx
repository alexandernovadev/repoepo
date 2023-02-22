import {
  AtButton,
  MlCardSelectedCar,
  MlCardSelectedCardVariants,
  MlHeading
} from '@gac/core-components'
import { useRouter } from 'next/router'
import { QuoteDataItem } from '../../../tm-quotation/QuotationCard'
import { appraisalTitleHeading, mapCarCard } from '../../data'
import { summaryClasses } from './classes'
import { prepareSummaryData } from './data'
import { SummaryProps } from './types'
const {
  cardContainer,
  cardContentContainer,
  cardLeftColumn,
  cardRightColumn,
  buttonsContainer,
  cardMainTitle,
  cardSubtitle,
  itemListContainer,
  cardSeparator,
  mlCardContainer
} = summaryClasses

export const Summary = ({ data, site }: SummaryProps) => {
  const { car, isFinancingPreApproved } = data
  const summaryData = prepareSummaryData(data, site)
  const router = useRouter()

  return (
    <>
      <MlHeading
        {...appraisalTitleHeading(site)}
        title={
          isFinancingPreApproved
            ? '¡Tu crédito ha sido pre-aprobado!'
            : 'Gracias por cotizar con nosotros'
        }
        description='Un ejecutivo de venta te contactará en las próximas horas'
        site={site}
      />
      <div className={mlCardContainer}>
        <MlCardSelectedCar
          {...mapCarCard(car!)}
          site={site}
          variant={MlCardSelectedCardVariants.SMALL}
        />
      </div>
      <div className={cardContainer}>
        <div className={cardContentContainer}>
          <div className={cardLeftColumn}>
            <p className={cardMainTitle}>Resumen de cotización</p>
            {summaryData.order?.map((item, index) => (
              <div key={index}>
                {' '}
                <p className={cardSubtitle}>{item?.title}</p>
                <dl className={itemListContainer}>
                  {item?.items?.map((itemList, index) => (
                    <QuoteDataItem
                      key={index}
                      name={itemList?.label!}
                      value={itemList?.value as string}
                      site={site}
                    />
                  ))}
                </dl>
                {index < summaryData.order.length - 1 && (
                  <hr className={cardSeparator} />
                )}
              </div>
            ))}
          </div>
          <div className={cardRightColumn}>
            <p className={cardMainTitle}>Solicitante</p>
            {summaryData.applicant?.map((item, index) => (
              <div key={index}>
                <p className={cardSubtitle}>{item?.title}</p>
                <dl className={itemListContainer}>
                  {item?.items?.map((itemList, index) => (
                    <QuoteDataItem
                      key={index}
                      name={itemList?.label!}
                      value={itemList?.value as string}
                      site={site}
                    />
                  ))}
                </dl>
                {index < summaryData.applicant.length - 1 && (
                  <hr className={cardSeparator} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className={buttonsContainer}>
        <AtButton
          site={site}
          label='Volver'
          className='py-2 px-6'
          variant='primary-text'
          disabled
        />
        <AtButton
          site={site}
          label='Terminar'
          onClick={() => router.push('/')}
        />
      </div>
    </>
  )
}
