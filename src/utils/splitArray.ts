/* Retorna un array de sub arrays con los elements */
/* Divididos de forma equitativa */
export const splitArray = (arr: any[], size: number) =>
  arr.reduce((carry, _, index, orig) => {
    return !(index % size)
      ? carry.concat([orig.slice(index, index + size)])
      : carry
  }, [])
