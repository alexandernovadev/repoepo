import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useDispatch } from 'react-redux'
import { fetchWithoutToken } from '../../../utils/fetch'
import { SitesNames } from '../../../types'
import { BuyProcessV2State, next, PaymentProcess, setReservationPayment } from '../../../redux/features/buyProcessV2Slice'

const PAYMENT_ENDPOINT = 'customer/api/payments'
const transbankTokens = [
  'token_ws',
  'TBK_TOKEN',
  'TBK_ID_SESION',
  'TBK_ORDEN_COMPRA'
]

const formatUrlParams = (getUrlParamas: any) => {
  const auxUrlParam = Object.keys(getUrlParamas).map((key: any, index: number) => {
    return `${index === 0 ? '?' : '&'}${key}=${
      getUrlParamas[key]
    }`
  }).join('')

  return auxUrlParam
}

const findUrlParams = (queryParamas: any, params: Array<string>) => {
  let activeParams = false
  let getFindParams: any = {}

  Object.keys(queryParamas).forEach((query: string) => {
    params.forEach((param: string) => {
      if (query.toLowerCase() === param.toLowerCase()) {
        activeParams = true
        getFindParams = {
          ...getFindParams,
          [query]: queryParamas[query]
        }
      }
    })
  })

  return {
    activeParams,
    getFindParams
  }
}

const getUrlPathByEnvironment = () => {
  switch (process.env.NEXT_PUBLIC_ENVIRONMENT) {
    case 'development':
      return 'http://'
    
    default:
      return 'https://'
  }
}

export const useTransbankPayment = (site: SitesNames, state: BuyProcessV2State, hostName: string) => {
  const dispatch = useDispatch()
  const active = state.currentStep === 8
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { query: queryParamas, replace} = useRouter()
  const [paymentKeys, setPaymentKeys] = useState({
    url: '',
    token: ''
  })

  useEffect(() => {
    const { activeParams: findTokens, getFindParams: getUrlTransbankTokens} = findUrlParams(queryParamas, transbankTokens)

    if (findTokens) {
      replace(`/buy-process-v2/${state.car?.id}#payment-section`, undefined, {
        shallow: true
      })
      ;(async () => {
        try {
          setLoading(true)
          const paymentResponse = await fetchWithoutToken(
            `${PAYMENT_ENDPOINT}${formatUrlParams(getUrlTransbankTokens)}`,
            site
          )

          setLoading(false)
          
          if (paymentResponse?.status === 'REJECTED_IN_WEBPAY' || paymentResponse?.status === 'TIMEOUT') {
            dispatch(setReservationPayment({
              paymentStatus: PaymentProcess.CANCELLED
            }))
          }

          if (paymentResponse?.details?.[0]?.response_code === -1 || paymentResponse?.status === 'INVALID') {
            dispatch(setReservationPayment({
              paymentStatus: PaymentProcess.REJECTED
            }))
          }

          if (paymentResponse?.details?.[0]?.response_code === 0) {
            setCompleted(true)
            dispatch(setReservationPayment({
              orderNumber: paymentResponse?.details[0]?.buy_order,
              ammount: paymentResponse?.details[0]?.amount,
              typePayment: paymentResponse?.details[0]?.payment_type_code,
              lastFourDigitsCard: paymentResponse?.cardDetail?.card_number,
              dues: paymentResponse?.details[0]?.installments_number,
              datePayment: paymentResponse?.transactionDate,
              paymentStatus: PaymentProcess.ACCEPTED,
            }))
            dispatch(next())
          }
  
        } catch (error) {
          console.log(error)
        }
      })()
    }

  }, [])

  const getPaymentData = async (transbankButton: any) => {
    try {
      setLoading(true)
      const paymentResponse = await fetchWithoutToken(
        PAYMENT_ENDPOINT,
        site,
        {
          amount: 500000,
          rut: state.contact.fields.rut,
          returnUrl: `${getUrlPathByEnvironment()}${hostName}/buy-process-v2/${state.car?.id}`
        },
        'POST'
      )

      if (paymentResponse) {
        setPaymentKeys({ url: paymentResponse.url, token: paymentResponse.token })
        const transbankButtonRef = transbankButton.current!
        transbankButtonRef?.submit()
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return {
    loading,
    paymentKeys,
    getPaymentData,
    stepStatus: {
      active,
      completed,
      disabled: !active && !completed
    }
  }
}
