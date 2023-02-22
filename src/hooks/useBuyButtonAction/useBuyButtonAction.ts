import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { getActualBuyProcess } from '../../utils/buy-process/getActualBuyProcess'
import { useBuyButtonActionProps } from './types'

const useBuyButtonAction = ({
  selectedVersion,
  enablePurchasing,
  purchaseRoute,
  purchaseText,
  action
}: useBuyButtonActionProps) => {
  const router = useRouter()

  const { detailsAction } = useMemo(() => {
    if (enablePurchasing && purchaseRoute) {
      return {
        detailsAction: () => {
          router.push(`/${getActualBuyProcess(purchaseRoute)}/${selectedVersion}`)
        },
        buttonText: purchaseText
      }
    }

    return {
      detailsAction: () => action(),
      buttonText: purchaseText
    }
  }, [selectedVersion])

  return [detailsAction]
}

export default useBuyButtonAction
