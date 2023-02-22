
export const getActualBuyProcess = (purchaseRoute: string) => {
  switch (purchaseRoute) {
    case 'Flujo de compra v1':
      return 'buy-process'

    case 'Flujo de compra v2':
      return 'buy-process-v2'

    default:
      return 'buy-process'
  }
}