import { formatCatalogQuery } from '../../../utils/formatQuery'

export const areSidebarFiltersRefresh = (
  urlQueryFilters: any = {},
  reduxFilters: any,
  saveDependsFilters: Array<string>
) => {
  let areDependsFilters: boolean = false // bandera para determinar si se vuelve a renderizar el sidebar o si no
  let getActiveFilters: Array<string> = saveDependsFilters // recibimos el estado saveDependsFilters por props y lo inicializamos en getActiveFilters
  let formatQuery: string = '' // variable donde guardaremos la url con los filtros padres que hara la peticion al backend
  let addedNewFilter: boolean = false // bandera para verificar si los filtros padres ya ingresaron a la funcion areSidebarFiltersRefresh
  let reduxNotFoundNewFilter: boolean = true // bandera para verificar si el filtro nuevos se encuentra en el estado de Redux
  let reduxNotFoundUsedFilter: boolean = true // bandera para verificar si el filtro usados se encuentra en el estado de Redux
  let findNewFilter: boolean = false // bandera para verificar si el filtro nuevos se encuentra en el estado interno de areSidebarFiltersRefresh
  let findUsedFilter: boolean = false // bandera para verificar si el filtro usados se encuentra en el estado interno de areSidebarFiltersRefresh
  let theLastFilter: number = Object.keys(reduxFilters).length - 1 // ultima posicion de la cola del estado de filtros de Redux
  let totalQueryFilters: any = {
    // objeto que se le enviara a la funcion formatCatalogQuery para recibir la url
    typeId: []
  }

  // revisamos los filtros que llegan por url (query params) y lo transformamos a una url especial
  if (urlQueryFilters['typeId']) {
    totalQueryFilters = {
      typeId:
        urlQueryFilters['typeId']?.toString()?.split(',').length > 0
          ? urlQueryFilters['typeId']?.toString()?.split(',')
          : ''
    }

    if (urlQueryFilters['typeId']?.toString()?.split(',').length > 0) {
      formatQuery = `?${formatCatalogQuery(totalQueryFilters).slice(1)}`
    } else {
      formatQuery = ''
    }
  }

  // revisamos el arreglo de filtros Padres, si encontramos alguno levantamos la bandera de que ya ingreso
  saveDependsFilters?.forEach((item: string) => {
    if (item === 'nuevo') {
      findNewFilter = true // bandera para filtro nuevo
    }
    if (item === 'usado') {
      findUsedFilter = true // bandera para filtro usado
    }
  })

  // revisamos si en el estado de filtro de redux estan nuestros filtros Padres (usados || nuevos)
  // esto para hacer validaciones al momento que se eliminan los filtros
  // si ya no estan en el estado de redux pero estan en nuestro estado saveDependsFilters significa que ya entraron y se deben borrar
  Object.keys(reduxFilters)?.forEach((filter) => {
    if (filter.toLowerCase() === 'nuevo') {
      reduxNotFoundNewFilter = false // bandera para filtro nuevo redux
    }
    if (filter.toLowerCase() === 'usado') {
      reduxNotFoundUsedFilter = false // bandera para filtro usado redux
    }
  })

  // case 0
  if (
    reduxNotFoundNewFilter &&
    reduxNotFoundUsedFilter &&
    findNewFilter &&
    findUsedFilter
  ) {
    return {
      areDependsFilters: false, // por lo tanto se envia la dependencia en falso para que no se vuelva a renderizar el sidebar
      getActiveFilters: [],
      finalUrlQuery: ''
    }
  }

  // caso 1: Si el ultimo filtro que llega en cola es USADO && no se encontro el filtro nuevo en nuestro estado inicial
  // significa que no a entrado el filtro Nuevo por lo que no se debe recargar toda la data del sidebar
  if (
    Object.keys(reduxFilters)[theLastFilter]?.toLowerCase() === 'usado' &&
    findNewFilter === false
  ) {
    return {
      areDependsFilters: false, // por lo tanto se envia la dependencia en falso para que no se vuelva a renderizar el sidebar
      getActiveFilters: [],
      finalUrlQuery: ''
    }
  }

  // caso 2: Si no encontramos el filtro nuevo en redux && lo encontramos en nuestro estado de filtros padres && encontramos tambien el filtro usados en nuestro estado de filtros padres
  // significa que se borro el filtro nuevo, pero permanece el usado por lo que no debemos recargar el sidebar ya que la data de usados es la misma por default
  if (reduxNotFoundNewFilter && findNewFilter && findUsedFilter) {
    return {
      areDependsFilters: false,
      getActiveFilters: ['usado'], // eliminamos nuevos del estado y permanece usado
      finalUrlQuery: formatQuery
    }
  }

  // caso 3: Si no encontramos el filtro NUEVOS en reedux && esta dentro de nuestro estado de filtros Padres
  // borramos el filtro nuevos de nuestro estado y enviamos el flag (areDependsFilters) para que se vuelva a renderizar la data del sidebar con la default
  if (reduxNotFoundNewFilter && findNewFilter) {
    return {
      areDependsFilters: findUsedFilter ? false : true,
      getActiveFilters: findUsedFilter ? ['usado'] : [],
      finalUrlQuery: formatQuery
    }
  }

  // caso 4: Si no encontramos el filtro USADOS en reedux && esta dentro de nuestro estado de filtros Padres
  // borramos el filtro usados de nuestro estado y enviamos el flag (areDependsFilters) para que se vuelva a renderizar la data del sidebar con la default
  if (reduxNotFoundUsedFilter && findUsedFilter) {
    return {
      areDependsFilters: findNewFilter ? true : false,
      getActiveFilters: findNewFilter ? ['nuevo'] : [],
      finalUrlQuery: formatQuery
    }
  }

  // caso 5: Va de la mano con el caso 1
  // si encontramos el filtro usados en Redux && no lo encontramos en nuestro estado de filtros padres && el ultimo filtro en cola es nuevo
  // agregamos el filtro usado al estado de filtros Padres
  // esto porque usados ya estaba activo pero como no lo estaba el filtro nuevo no se agrego al estado ya que no era necesario refrescar la data del sidebar
  // pero como ahora ingreso nuevo y esta usados se tienen que activar ambos
  if (
    !reduxNotFoundUsedFilter &&
    !findUsedFilter &&
    Object.keys(reduxFilters)[theLastFilter]?.toLowerCase() === 'nuevo'
  ) {
    getActiveFilters.push('usado')
  }

  // caso 6: Cuando viene en cola usado y nuevos
  if (
    Object.keys(reduxFilters)[theLastFilter]?.toLowerCase() === 'nuevo' ||
    Object.keys(reduxFilters)[theLastFilter]?.toLowerCase() === 'usado'
  ) {
    // revisamos que no esten dentro de filtros padres
    saveDependsFilters?.forEach((item: string) => {
      if (item === Object.keys(reduxFilters)[theLastFilter]?.toLowerCase()) {
        addedNewFilter = true
      }
    })
    // si no lo estan, lo agregamos al estado con el push() y mandamos el flag en true, de lo contrario ira en false y no se actualizara la data
    if (!addedNewFilter) {
      getActiveFilters?.push(
        Object.keys(reduxFilters)[theLastFilter]?.toLowerCase()
      )
      areDependsFilters = true

      return {
        areDependsFilters,
        getActiveFilters,
        finalUrlQuery: areDependsFilters ? formatQuery : ''
      }
    }
  }

  // caso 7: Si encontramos el filtro nuevo en Redux pero no lo encontramos en el local
  // esto para validar si el usuario recarga la pagina el filtro nuevo no es el ultimo filtro enviado
  if (!reduxNotFoundNewFilter && !findNewFilter) {
    return {
      areDependsFilters: true,
      getActiveFilters: ['nuevo'],
      finalUrlQuery: formatQuery
    }
  }

  return {
    areDependsFilters,
    getActiveFilters,
    finalUrlQuery: areDependsFilters ? formatQuery : ''
  }
}
