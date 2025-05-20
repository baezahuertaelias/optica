const PdfPrinter = require("pdfmake");
const path = require("path");
const fs = require("fs"); // Import the filesystem module

// Make sure these font files exist in the specified path
const fonts = {
  Roboto: {
    normal: path.join(__dirname, "/fonts/Roboto/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "/fonts/Roboto/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "/fonts/Roboto/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "/fonts/Roboto/Roboto-MediumItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);

function createPdfDocument(data) {
  try {



    // Read the image file
    const imagePath = path.join(__dirname, "sampleImage.jpg");
    const imageBuffer = fs.readFileSync(imagePath);
    const image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;
    const cabecera = {
      columns: [
        {
          image: image,
          width: 40,
          height: 40
        },
        {
          text: "OPTICA\nTARAPACA",
          style: "OpticaTitle",
          width: "*",
          margin: [20, 0],
        },
        {
          text: "Nro " + data.id,
          style: "idOT",
          width: "auto",
          alignment: "right",
        },
      ],
    };

    const titulo = {
      text: "Orden de trabajo",
      style: "OTTitle",
      alignment: "center",
      margin: [0, 20, 0, 0],
    };

    const detallePaciente = {
      table: {
        widths: ["*", "*"],
        body: [
          [
            {
              text: [
                { text: "Nombre: ", bold: true, style: "descPatient" },
                { text: data.patient.name, style: "descPatient" },
              ],
              colSpan: 2,
            },
            {}, // Empty cell (needed for proper colspanning)
          ],
          [
            {
              text: [
                { text: "Rut: ", bold: true, style: "descPatient" },
                { text: data.patient.passport, style: "descPatient" },
              ],
            },
            {
              text: [
                { text: "Fono: ", bold: true },
                { text: data.patient.tel, style: "descPatient" },
              ],
            },
          ],
          [
            {
              text: [
                { text: "Lugar: ", bold: true, style: "descPatient" },
                { text: "-------", style: "descPatient" },
              ],
            },
            {
              text: [
                { text: "Fecha: ", bold: true, style: "descPatient" },
                { text: data.createdAt.toLocaleString("en-GB", { dateStyle: 'short' }), style: "descPatient" },
              ],
            },
          ],
        ],
      },
      margin: [0, 10, 0, 10],
      layout: "noBorders",
    };

    const tituloLentes = (titulo) => {
      return {
        text: `Lentes de ${titulo}`,
        style: "subtitle",
        margin: [0, 0, 0, 5],
      };
    };

    const tablaLentes = (data) => {
      // Sample data - replace with actual values from your application
      const sampleData = {
        OD: { ESF: data.sphereRE, CYL: data.cylinderRE, EJE: data.axisRE, DP: data.pupilarDistance },
        OI: { ESF: data.sphereLE, CYL: data.cylinderLE, EJE: data.axisLE, DP: "" },
      };
      
      const aa = {
        table: {
          headerRows: 1,
          widths: ["auto", "*", "*", "*", "*"],
          body: [
            ["", "ESF", "CYL", "EJE", "DP"],
            [
              "OD",
              sampleData.OD.ESF,
              sampleData.OD.CYL,
              sampleData.OD.EJE,
              sampleData.OD.DP,
            ],
            [
              "OI",
              sampleData.OI.ESF,
              sampleData.OI.CYL,
              sampleData.OI.EJE,
              sampleData.OI.DP,
            ],
          ],
        },
        margin: [0, 0, 0, 15],
      };
      
      if (data.add) {
        aa.table.body.push([
              "ADD",
              data.add,
              "",
              "",
              "",
            ])
      }
      return aa
    };

    const observaciones = (data) => {
      return {
        text: [
          { text: "Observaciones: ", bold: true },
          { text: data || "Sin observaciones" },
        ],
        margin: [0, 0, 0, 50],
      };
    };

    const infoLentes = (data) => {
      return {
        text: [{ text: data.titulo, bold: true }, { text: data.contenido }],
      };
    };


    const infoPago = (data) => {
      const paymentData = data || {
        total: "$150.000",
        abono: "$50.000",
        pendiente: "$100.000",
      };

      return {
        margin: [0, 10, 0, 0],
        layout: "noBorders",
        table: {
          widths: ["50%", "50%"],
          body: [
            [
              [
                {
                  text: [
                    { text: "Total: ", bold: true },
                    { text: paymentData.total },
                  ],
                },
                {
                  text: [
                    { text: "Abono: ", bold: true },
                    { text: paymentData.abono },
                  ],
                },
                {
                  text: [
                    { text: "Pendiente: ", bold: true },
                    { text: paymentData.pendiente },
                  ],
                },
              ],
              {
                text: "_______________________\nFirma Cliente",
                alignment: "center",
                margin: [0, 15, 0, 0],
                bold: true,
              },
            ],
          ],
        },
      };
    };

    let docDefinition = {
      content: [
        cabecera,
        titulo,
        detallePaciente,
        tituloLentes("lejos"),
        tablaLentes(data.subjectiveRefractionsFar),
        tituloLentes("cerca"),
        tablaLentes(data.subjectiveRefractionsNear),
        observaciones(data.otherDetails),
        infoLentes({ titulo: "Marca de lentes: ", contenido: "-------" }),
        infoLentes({
          titulo: "Modelo de armazon: ",
          contenido: "-----",
        }),
        infoPago(),
      ],

      footer: [
        {
          text: "Clinica tarapaca\nFrancisco Bilbao 3171 - local",
          alignment: "center",
          style: "footer",
          margin: [0, 0, 0, 0],
          bold: true,
        },
      ],

      styles: {
        OpticaTitle: {
          fontSize: 18,
          bold: true,
          alignment: "left",
        },
        OTTitle: {
          fontSize: 16,
          bold: true,
        },
        subtitle: {
          fontSize: 14,
          bold: true,
        },
        sectionHeader: {
          fontSize: 12,
          bold: true,
        },
        footer: {
          fontSize: 10,
          italics: true,
        },
      },
      defaultStyle: {
        fontSize: 10,
      },
      pageSize: { width: 396, height: 612 },
      pageMargins: [45, 20, 45, 45],
    };

    // Create and return the PDF document
    console.log("Termino");

    return printer.createPdfKitDocument(docDefinition);
    // Create and return the PDF document
    /* const pdfDoc = printer.createPdfKitDocument(docDefinition);

    // Pipe the output to a writable stream (e.g., file)
    const outputPath = path.join(__dirname, "output.pdf");
    pdfDoc.pipe(fs.createWriteStream(outputPath));

    // Finalize the PDF and write it to the specified path
    pdfDoc.end();

    console.log(`PDF created at ${outputPath}`); */
  } catch (error) {
    console.log("errorPDF", error);
  }
}

function createPDFClinicalRecord(data){
  // playground requires you to assign document definition to a variable called dd

var dd = {
    content: [
      // Header row with title and number
      {
        columns: [
          { text: 'FICHA CLINICA', style: 'header', bold: true, width: '70%' },
          { text: 'Nro 1111', style: 'header', bold: true, width: '30%', alignment: 'right' }
        ],
        columnGap: 10,
        margin: [0, 0, 0, 10]
      },
      
      // Horizontal line
      //{ canvas: [ { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 } ] },
      //{ canvas: [ { type: 'line', x1: 0, y1: 2, x2: 520, y2: 2, lineWidth: 1 } ] },
      
      // Patient information table
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            [
              { text: 'FECHA DE ATENCION', style: 'tableHeader', bold: true },
              { text: '11-04-2025' }
            ],
            [
              { text: 'NOMBRE', style: 'tableHeader', bold: true },
              { text: 'JUANITO PEREZ' }
            ],
            [
              { text: 'RUT', style: 'tableHeader', bold: true },
              { text: '11.111.111-1' }
            ],
            [
              { text: 'PASAPORTE', style: 'tableHeader', bold: true },
              { text: '999.999.999-9' }
            ],
            [
              { text: 'SEXO', style: 'tableHeader', bold: true },
              { text: 'FEMENINO' }
            ],
            [
              { text: 'FONO', style: 'tableHeader', bold: true },
              { text: '+56 9 1234 1234' }
            ],
            [
              { text: 'EDAD', style: 'tableHeader', bold: true },
              { text: '53' }
            ],
            [
              { text: 'FECHA DE NACIMIENTO', style: 'tableHeader', bold: true },
              { text: '1970-05-03' }
            ],
            [
              { text: 'DOMICILIO', style: 'tableHeader', bold: true },
              { text: 'SIEMPREVIVA 123' }
            ],
            [
              { text: 'CORREO ELECTRÓNICO', style: 'tableHeader', bold: true },
              { text: 'AAA@AAA.AA' }
            ],
            [
              { text: 'OCUPACIÓN', style: 'tableHeader', bold: true },
              { text: 'AAA' }
            ],
            [
              { text: 'REPRESENTANTE LEGAL (EN MENORES)', style: 'tableHeader', bold: true },
              { text: 'AAA' }
            ],
            [
              { text: 'PREVISIÓN', style: 'tableHeader', bold: true },
              { text: 'AAAA' }
            ],
          ]
        }
      },
      
      // Horizontal line
      //{ canvas: [ { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 } ], margin: [0, 5, 0, 5] },
      
      // Anamnesis section
      { text: 'ANAMNESIS:', style: 'sectionHeader', bold: true, margin: [0, 10, 0, 5] },
      { text: 'Es un texto que puede ser más largo', margin: [0, 0, 0, 10] },
      
      { text: 'Ultima receta: 1992/06/05', margin: [0, 0, 0, 5] },
      { text: 'Antecedente Medico General: Diabetes Mellitus / ', margin: [0, 0, 0, 5] },
      { text: 'Antecedente Medico Oftamologico: Sin información', margin: [0, 0, 0, 5] },
      { text: 'Antecedente Familiar: Sin información', margin: [0, 0, 0, 10] },
      
      // AV Table with Rojo Pupilar
      { pageBreak: 'before', text: 'AV', style: 'sectionHeader', bold: true, margin: [0, 5, 0, 5] },
      {
        columns: [
          {
            width: '70%',
            table: {
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  '',
                  { text: 'AV sc', alignment: 'center', bold: true },
                  { text: 'AV csl', alignment: 'center', bold: true },
                  { text: 'CAE', alignment: 'center', bold: true }
                ],
                [
                  { text: 'OD', bold: true },
                  { text: '' },
                  { text: '' },
                  { text: '' }
                ],
                [
                  { text: 'OI', bold: true },
                  { text: '' },
                  { text: '' },
                  { text: '' }
                ],
                [
                  { text: 'Binocular', bold: true },
                  { text: '' },
                  { text: '' },
                  { text: '' }
                ]
              ]
            }
          },
          {
            width: '30%',
            stack: [
              { text: 'Rojo Pupilar', bold: true, margin: [0, 0, 0, 5] },
              { text: 'OD: Presente', margin: [5, 0, 0, 5] },
              { text: 'OI: Presente', margin: [5, 0, 0, 0] }
            ],
            margin: [10, 0, 0, 0]
          }
        ]
      },
      
      // Horizontal line
      //{ canvas: [ { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 2 } ], margin: [0, 10, 0, 10] },
      //{ canvas: [ { type: 'line', x1: 0, y1: 0, x2: 520, y2: 0, lineWidth: 1 } ], margin: [0, 5, 0, 10] },
      
      // Refracción Subjetiva
      { text: 'REFRACCION SUBJETIVA', style: 'sectionHeader', bold: true, margin: [0, 5, 0, 5] },
      
      { text: 'Lejos', bold: true, margin: [0, 5, 0, 5] },
      {
        table: {
          widths: ['15%', '17%', '17%', '17%', '17%', '17%'],
          body: [
            [
              '',
              { text: 'Esfera', bold: true, alignment: 'center' },
              { text: 'Cilindro', bold: true, alignment: 'center' },
              { text: 'Eje', bold: true, alignment: 'center' },
              { text: 'AV Alcanzada', bold: true, alignment: 'center' },
              { text: 'DP', bold: true, alignment: 'center' }
            ],
            [
              { text: 'OI', bold: true },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: 'OD', bold: true },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' }
            ]
          ]
        }
      },
      
      { text: 'Cerca', bold: true, margin: [0, 10, 0, 5] },
      {
        table: {
          widths: ['15%', '17%', '17%', '17%', '17%', '17%'],
          body: [
            [
              '',
              { text: 'Esfera', bold: true, alignment: 'center' },
              { text: 'Cilindro', bold: true, alignment: 'center' },
              { text: 'Eje', bold: true, alignment: 'center' },
              { text: 'AV Alcanzada', bold: true, alignment: 'center' },
              { text: 'DP', bold: true, alignment: 'center' }
            ],
            [
              { text: 'OI', bold: true },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: 'OD', bold: true },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: 'ADD', bold: true },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' },
              { text: '' }
            ]
          ]
        },
        margin: [0, 0, 0, 10]
      },
      
      // Tonometría
      { text: 'TONOMETRÍA APLANÁTICA', style: 'sectionHeader', bold: true, margin: [0, 10, 0, 5] },
      {
        table: {
          widths: ['35%', '65%'],
          body: [
            [
              { text: 'OD', bold: true },
              { text: '12 mmHg' }
            ],
            [
              { text: 'OI', bold: true },
              { text: '12 mmHg' }
            ],
            [
              { text: 'Hora', bold: true },
              { text: '13:50 hrs' }
            ]
          ]
        },
        margin: [0, 0, 0, 10]
      },
      
      // Lensometría
      { text: 'LENSOMETRÍA', style: 'sectionHeader', bold: true, margin: [0, 10, 0, 5] },
      {
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            [
              '',
              { text: 'Esfera', bold: true, alignment: 'center' },
              { text: 'Cilindro', bold: true, alignment: 'center' },
              { text: 'Eje', bold: true, alignment: 'center' }
            ],
            [
              { text: 'OI', bold: true },
              { text: '' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: 'OD', bold: true },
              { text: '' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: 'ADD', bold: true },
              { text: '' },
              { text: '' },
              { text: '' }
            ]
          ]
        },
        margin: [0, 0, 0, 10]
      },
      
      // Autorefractometría
      { text: 'AUTOREFRACTOMETRÍA', style: 'sectionHeader', bold: true, margin: [0, 10, 0, 5] },
      {
        table: {
          widths: ['25%', '25%', '25%', '25%'],
          body: [
            [
              '',
              { text: 'Esfera', bold: true, alignment: 'center' },
              { text: 'Cilindro', bold: true, alignment: 'center' },
              { text: 'Eje', bold: true, alignment: 'center' }
            ],
            [
              { text: 'OI', bold: true },
              { text: '' },
              { text: '' },
              { text: '' }
            ],
            [
              { text: 'OD', bold: true },
              { text: '' },
              { text: '' },
              { text: '' }
            ]
          ]
        },
        margin: [0, 0, 0, 10]
      },
      
      // Final sections
      { text: 'OTROS EXÁMENES: Sin información', style: 'sectionHeader', bold: true, margin: [0, 10, 0, 5] },
      
      { text: 'OBSERVACIONES: Sin información', style: 'sectionHeader', bold: true, margin: [0, 10, 0, 5] },
      
      { text: 'DIAGNÓSTICO: Aqui van los checkbox de miopia', style: 'sectionHeader', bold: true, margin: [0, 10, 0, 5] },
      
      { text: 'INDICACIONES: Datos dropdown tipolentes lagrimasartificiales tiempocontrol', style: 'sectionHeader', bold: true, margin: [0, 10, 0, 5] }
    ],
    styles: {
      header: {
        fontSize: 16,
        bold: true,
        margin: [0, 0, 0, 5]
      },
      subheader: {
        fontSize: 14,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        margin: [0, 5, 0, 5]
      },
      tableHeader: {
        bold: true,
        fontSize: 11
      }
    },
    defaultStyle: {
      fontSize: 11
    }
  };
}

module.exports = {
  createPdfDocument,
};
