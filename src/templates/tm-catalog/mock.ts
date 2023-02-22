export const resetOptions = [
  {
    label: 'Seleccionar',
    value: '0'
  },
  {
    label: 'Agregados recientemente',
    value: '1'
  },
  {
    label: 'Precio más bajo al más alto',
    value: '2'
  },
  {
    label: 'Precio más alto al más bajo',
    value: '3'
  },
  {
    label: 'Mayor a menor kilometraje',
    value: '4'
  },
  {
    label: 'Menor a mayor kilometraje',
    value: '5'
  }
]

export const defaultOptions = [
  {
    label: 'Agregados recientemente',
    value: '1'
  },
  {
    label: 'Precio más bajo al más alto',
    value: '2'
  },
  {
    label: 'Precio más alto al más bajo',
    value: '3'
  },
  {
    label: 'Mayor a menor kilometraje',
    value: '4'
  },
  {
    label: 'Menor a mayor kilometraje',
    value: '5'
  }
]

export const defaultPath = [
  {
    label: 'Home',
    url: '/'
  },
  {
    label: 'Catálogo',
    url: '#'
  }
]

export const selectSidebarMockData = (finalUrlQuery: string) => {
  const sidebarData = [
    {
      type: 'checkbox',
      endpoint: 'type',
      query: 'typeId',
      data: {
        label: 'Tipos de auto',
        name: 'tipos-de-auto',
        options: []
      }
    },
    {
      type: 'select',
      data: {
        label: 'Marca y modelo',
        name: 'brand-model',
        needBeforeSelect: true,
        options: {
          first: {
            query: 'brandId',
            endpoint: `brand${finalUrlQuery}`,
            inputLabel: 'Marca',
            placeholder: 'Selecciona la marca',
            options: []
          },
          second: {
            inputLabel: 'Modelo',
            placeholder: 'Selecciona el model',
            endpoint: `model${finalUrlQuery}`,
            query: 'modelId',
            options: []
          }
        }
      }
    },
    {
      type: 'year',
      data: {
        label: 'Año',
        name: 'year',
        needBeforeSelect: true,
        options: {
          first: {
            inputLabel: 'Desde',
            query: 'year',
            endpoint: `year${finalUrlQuery}`,
            placeholder: 'Selecciona el año',
            options: []
          },
          second: {
            inputLabel: 'Hasta',
            endpoint: `year${finalUrlQuery}`,
            query: 'year',
            placeholder: 'Selecciona el año',
            options: []
          }
        }
      }
    },
    {
      type: 'list-price',
      data: {
        label: 'Precio',
        name: 'price',
        needBeforeSelect: true,
        options: {
          first: {
            inputLabel: 'Desde',
            endpoint: 'list-price',
            placeholder: 'Selecciona el precio',
            query: 'listPrice',
            options: []
          },
          second: {
            inputLabel: 'Hasta',
            endpoint: 'list-price',
            query: 'listPrice',
            placeholder: 'Selecciona el precio',
            options: []
          }
        }
      }
    },
    {
      type: 'checkbox',
      endpoint: `category${finalUrlQuery}`,
      query: 'categoryId',
      data: {
        label: 'Categoría',
        name: 'categoria',
        options: []
      }
    },
    {
      type: 'mileage',
      data: {
        label: 'Kilometraje',
        name: 'kilometraje',
        needBeforeSelect: true,
        options: {
          first: {
            endpoint: 'mileage',
            query: 'mileage',
            inputLabel: 'Desde',
            placeholder: 'Selecciona el kilometraje',
            options: []
          },
          second: {
            inputLabel: 'Hasta',
            query: 'mileage',
            endpoint: 'mileage',
            placeholder: 'Selecciona el kilometraje',
            options: []
          }
        }
      }
    },
    {
      type: 'checkbox',
      endpoint: 'fuel',
      query: 'fuelId',
      data: {
        label: 'Combustible',
        name: 'combustible',
        options: []
      }
    },
    {
      type: 'checkbox',
      endpoint: `color${finalUrlQuery}`,
      query: 'colorId',
      data: {
        label: 'Color',
        name: 'color',
        options: []
      }
    },
    {
      type: 'checkbox',
      endpoint: 'traction',
      query: 'tractionId',
      data: {
        label: 'Tracción',
        name: 'traccion',
        options: []
      }
    },
    {
      type: 'checkbox',
      endpoint: 'transmission',
      query: 'transmissionId',
      data: {
        label: 'Transmisión',
        name: 'transmission',
        options: []
      }
    }
    // {
    //   type: 'checkbox',
    //   endpoint: 'doors',
    //   query: 'doorsId',
    //   data: {
    //     label: 'Puertas',
    //     name: 'puertas',
    //     options: [
    //       {
    //         checkLabel: '2-3 puertas',
    //         id: '2-3p',
    //         checked: false
    //       },
    //       {
    //         checkLabel: '4-5 puertas',
    //         id: '4-5p',
    //         checked: false
    //       }
    //     ]
    //   }
    // },
    // {
    //   type: 'checkbox',
    //   endpoint: 'seats',
    //   query: 'seatsId',
    //   data: {
    //     label: 'Asientos',
    //     name: 'asientos',
    //     options: [
    //       {
    //         checkLabel: '2 asientos',
    //         id: '2-a',
    //         checked: false
    //       },
    //       {
    //         checkLabel: '4 asientos',
    //         id: '4-a',
    //         checked: false
    //       },
    //       {
    //         checkLabel: '5 asientos',
    //         id: '5-asientos',
    //         checked: false
    //       },
    //       {
    //         checkLabel: '7 asientos',
    //         id: '7-asientos',
    //         checked: false
    //       }
    //     ]
    //   }
    // }
  ]

  return sidebarData
}
