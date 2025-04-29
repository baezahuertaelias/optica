// playground requires you to assign document definition to a variable called dd

var dd = {
  content: [
    // Header with logo and number
    {
      columns: [{
        image: 'sampleImage.jpg',
        width: 80,
        height: 40
      },
      {
        text: 'OPTICA\nTARAPACA',
        style: 'OpticaTitle',
        width: '*',
        margin: [20, 0],
      },
      {
        text: 'Nro 000000',
        style: 'idOT',
        width: 'auto',
        alignment: 'right',
      }
      ],
      //margin: [0, 0, 0, 20]
    },

    {
      text: 'Orden de trabajo',
      style: 'OTTitle',
      alignment: 'center',
      margin: [0, 20, 0, 0],
    },
    {
      table: {
        widths: ['*', '*'],
        body: [
          // First row with colspan
          [
            {
              text:
                [
                  {
                    text: 'Nombre: ',
                    bold: true,
                    style: 'descPatient'
                  },
                  {
                      text: 'Juanito Lechuga',
                      style: 'descPatient'
                  }
                ],
              colSpan: 2
            },
            {} // Empty cell (needed for proper colspanning)
          ],
          // Second row
          [
            {
              text: [
                {
                  text: 'Rut: ',
                  bold: true,
                  style: 'descPatient'
                },
                {
                      text: '11.111.111-1',
                      style: 'descPatient'
                 }
              ],
            },
            {
              text: [
                {
                  text: 'Fono: ',
                  bold: true
                },
                {
                      text: '+56945613298',
                      style: 'descPatient'
                 }
                
              ],
            }
          ],
          // Third row
          [
            {
              text: [
                {
                  text: 'Lugar: ',
                  bold: true,
                  style: 'descPatient'
                },
                {
                      text: 'Bilbao',
                      style: 'descPatient'
                 }
                
              ],
            },
            {
              text: [
                {
                  text: 'Fecha: ',
                  bold: true,
                  style: 'descPatient'
                },
                {
                      text: '02/08/25',
                      style: 'descPatient'
                 }
                
              ],
            }
          ]
        ]
      },
      margin: [0, 10, 0, 10],
      layout: 'noBorders',
    },



    // Lentes de lejos section
    {
      text: 'Lentes de lejos',
      style: 'subtitle',
      margin: [0, 0, 0, 5]
    },
    {
      table: {
        headerRows: 1,
        widths: ['auto', '*', '*', '*', '*'],
        body: [
          ['', 'ESF', 'CYL','EJE', 'DP'],
          ['OD', '', '', '', ''],
          ['OI', '', '', '', '',]
        ]
      },
      margin: [0, 0, 0, 15]
    },

    // Lentes de cerca section
    {
      text: 'Lentes de cerca',
      style: 'subtitle',
      margin: [0, 0, 0, 5]
    },
    {
      table: {
        headerRows: 1,
        widths: ['auto', '*', '*', '*', '*'],
        body: [
          ['', 'ESF', 'CYL','EJE', 'DP'],
          ['OD', '', '', '', ''],
          ['OI', '', '', '', '',]
        ]
      },
      margin: [0, 0, 0, 15]
    },

    // Observations
    {
      text: [{ text: 'Observaciones: ', bold: true }, { text: 'maximo 120 caracteres' }],
      margin: [0,0,0,50]
    },
    

    // Lens and frame information
    {
      text: [{ text: 'Marca de lentes: ', bold: true }, { text: 'Desconocido' }]
    },
    {
      text: [{ text: 'Modelo de armazon: ', bold: true }, { text: 'Desconocido' }]
    },

    // Payment information Signature line
    {

      margin: [0, 10, 0, 0],
      layout: 'noBorders',
      table: {
        widths: ['50%', '50%'],
        body: [
          [
            [
              { text: [{ text: 'Total: ', bold: true }, { text: 'Desconocido' }], },
              { text: [{ text: 'Abono: ', bold: true }, { text: 'Desconocido' }] },
              {text: [{ text: 'Pendiente: ', bold: true }, { text: 'Desconocido' }]}
            ], {
              text: '_______________________\nFirma Cliente',
              alignment: 'center', margin: [0, 15, 0, 0],
              bold: true
            }],
        ]
      }
    },

  ],
  
  footer: [{
      text: 'Clinica tarapaca\nFrancisco Bilbao 3171 - local',
      alignment: 'center',
      style: 'footer',
      margin: [0,0,0,0],
      bold: true
    }],

  styles: {
    OpticaTitle: {
      fontSize: 18,
      bold: true,
      alignment: 'left'
    },
    OTTitle: {
      fontSize: 16,
      bold: true
    },
    sectionHeader: {
      fontSize: 12,
      bold: true
    },
    footer: {
      fontSize: 10,
      italics: true
    }
  },

  defaultStyle: {
    fontSize: 10,
  },
  pageSize: { width: 396, height: 612 },
  pageMargins: [45, 20, 45, 45],

};