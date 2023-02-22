export const getTypePaymentByCode = (code: string) => {
  switch (code) {
    case 'VN':
    case 'S2':
    case 'S1':
    case 'NC':
    case 'VC':
      return 'Tarjeta de crédito'

    case 'VD':
    case 'VP':
      return 'Tarjeta de débito'

    default:
      return code
  }
}