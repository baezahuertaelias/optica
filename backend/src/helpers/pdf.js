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

function createTextDiagnosis(data) {

  const eyeConditions = {
    Miopia: data.myopia,
    Hipermetropia: data.hyperopia,
    Astigmatismo: data.astigmatism,
    Presbicia: data.presbyopia,
    Emetrope: data.emmetrope,
    Derivado: data.derived,
  };

  return Object.entries(eyeConditions)
    .filter(([key, value]) => value === true)
    .map(([key, value]) => key)
    .join(', ');
}

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
    return printer.createPdfKitDocument(docDefinition);

  } catch (error) {
    console.log("errorPDF", error);
  }
}

function createPDFClinicalRecord(data) {

  let docDefinition = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header section with enhanced styling
      {
        columns: [
          {
            stack: [
              {
                text: 'FICHA CLÍNICA',
                style: 'mainTitle'
              },
              {
                canvas: [{
                  type: 'line',
                  x1: 0, y1: 5, x2: 300, y2: 5,
                  lineWidth: 2,
                  lineColor: '#2c5aa0'
                }]
              }
            ],
            width: '70%'
          },
          {
            table: {
              widths: ['100%'],
              body: [[
                {
                  text: `Nº ${data.id}`,
                  style: 'recordNumber',
                  fillColor: '#f8f9fa',
                  border: [true, true, true, true]
                }
              ]]
            },
            width: '30%',
            alignment: 'right'
          }
        ],
        columnGap: 20,
        margin: [0, 0, 0, 20]
      },

      // Patient information with improved table design
      {
        style: 'patientInfoTable',
        table: {
          headerRows: 1,
          widths: ['30%', '70%'],
          body: [
            [
              { text: 'INFORMACIÓN DEL PACIENTE', style: 'tableTitle', colSpan: 2, fillColor: '#e3f2fd' },
              {}
            ],
            [
              { text: 'Fecha de Atención', style: 'fieldLabel' },
              { text: data.createdAt.toLocaleString('es-US'), style: 'fieldValue' }
            ],
            [
              { text: 'Nombre Completo', style: 'fieldLabel' },
              { text: data.patient.name.toUpperCase(), style: 'fieldValueBold' }
            ],
            [
              { text: 'RUT / Pasaporte', style: 'fieldLabel' },
              { text: data.patient.passport, style: 'fieldValue' }
            ],
            [
              { text: 'Sexo', style: 'fieldLabel' },
              { text: data.patient.gender.value, style: 'fieldValue' }
            ],
            [
              { text: 'Teléfono', style: 'fieldLabel' },
              { text: data.patient.tel, style: 'fieldValue' }
            ],
            [
              { text: 'Edad', style: 'fieldLabel' },
              { text: `${Math.floor((new Date() - new Date(data.patient.birthday).getTime()) / 3.15576e+10)} años`, style: 'fieldValue' }
            ],
            [
              { text: 'Fecha de Nacimiento', style: 'fieldLabel' },
              { text: new Date(data.patient.birthday).toLocaleDateString('es-US'), style: 'fieldValue' }
            ],
            [
              { text: 'Domicilio', style: 'fieldLabel' },
              { text: data.patient.homeAddress, style: 'fieldValue' }
            ],
            [
              { text: 'Correo Electrónico', style: 'fieldLabel' },
              { text: data.patient.mail, style: 'fieldValue' }
            ],
            [
              { text: 'Ocupación', style: 'fieldLabel' },
              { text: data.patient.occupation, style: 'fieldValue' }
            ],
            [
              { text: 'Representante Legal', style: 'fieldLabel' },
              { text: data.patient.legalRepresentative || 'No aplica', style: 'fieldValue' }
            ]
          ]
        },
        layout: {
          fillColor: function (rowIndex) {
            return (rowIndex > 0 && rowIndex % 2 === 0) ? '#f8f9fa' : null;
          },
          hLineWidth: function (i, node) {
            return (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5;
          },
          vLineWidth: function () { return 0.5; },
          hLineColor: function () { return '#dee2e6'; },
          vLineColor: function () { return '#dee2e6'; }
        }
      },

      // Clinical History Section
      {
        stack: [
          {
            text: 'HISTORIA CLÍNICA',
            style: 'sectionTitle',
            margin: [0, 25, 0, 10]
          },
          {
            table: {
              widths: ['100%'],
              body: [
                [{
                  stack: [
                    { text: 'Anamnesis', style: 'subsectionTitle' },
                    { text: data.anamnesis || 'Sin información registrada', style: 'clinicalText' }
                  ],
                  margin: [10, 10, 10, 10]
                }]
              ]
            },
            layout: 'lightHorizontalLines'
          },

          // Medical History in organized layout
          {
            columns: [
              {
                width: '50%',
                stack: [
                  { text: 'Antecedentes Médicos Generales', style: 'subsectionTitle' },
                  { text: data.generalMedicalHistory || 'No reportados', style: 'clinicalText' },
                  { text: 'Antecedentes Familiares', style: 'subsectionTitle', margin: [0, 10, 0, 5] },
                  { text: data.familyMedicalHistory || 'No reportados', style: 'clinicalText' }
                ]
              },
              {
                width: '50%',
                stack: [
                  { text: 'Antecedentes Oftalmológicos', style: 'subsectionTitle' },
                  { text: data.ophthalmologicalMedicalHistory || 'No reportados', style: 'clinicalText' },
                  { text: 'Última Receta', style: 'subsectionTitle', margin: [0, 10, 0, 5] },
                  { text: new Date(data.latestClinicalDate).toLocaleDateString('es-US'), style: 'clinicalText' }
                ]
              }
            ],
            columnGap: 15,
            margin: [0, 15, 0, 0]
          }
        ]
      },

      // Page break and Visual Acuity section
      {
        pageBreak: 'before',
        text: 'EXAMEN OFTALMOLÓGICO',
        style: 'sectionTitle',
        margin: [0, 0, 0, 15]
      },

      // Enhanced AV section
      {
        columns: [
          {
            width: '65%',
            stack: [
              { text: 'Agudeza Visual', style: 'subsectionTitle' },
              {
                table: {
                  headerRows: 1,
                  widths: ['20%', '25%', '25%', '30%'],
                  body: [
                    [
                      { text: '', style: 'tableHeader' },
                      { text: 'AV s/c', style: 'tableHeader', alignment: 'center' },
                      { text: 'AV c/c', style: 'tableHeader', alignment: 'center' },
                      { text: 'Estenopeico', style: 'tableHeader', alignment: 'center' }
                    ],
                    [
                      { text: 'OD', style: 'eyeLabel' },
                      { text: data.visualAcuity.withoutCorrectionRE, alignment: 'center' },
                      { text: data.visualAcuity.laserCorrectionRE, alignment: 'center' },
                      { text: data.visualAcuity.pinholeRE, alignment: 'center' }
                    ],
                    [
                      { text: 'OI', style: 'eyeLabel' },
                      { text: data.visualAcuity.withoutCorrectionLE, alignment: 'center' },
                      { text: data.visualAcuity.laserCorrectionLE, alignment: 'center' },
                      { text: data.visualAcuity.pinholeLE, alignment: 'center' }
                    ],
                    [
                      { text: 'Binocular', style: 'eyeLabel' },
                      { text: data.visualAcuity.withoutCorrectionBI, alignment: 'center' },
                      { text: data.visualAcuity.laserCorrectionBI, alignment: 'center' },
                      { text: data.visualAcuity.pinholeBI, alignment: 'center' }
                    ]
                  ]
                },
                layout: {
                  fillColor: function (rowIndex) {
                    return rowIndex === 0 ? '#e8f4f8' : (rowIndex % 2 === 0 ? '#f8f9fa' : null);
                  }
                }
              }
            ]
          },
          {
            width: '35%',
            table: {
              widths: ['100%'],
              body: [
                [{
                  text: 'Reflejo Rojo Pupilar',
                  style: 'subsectionTitle',
                  fillColor: '#fff3e0',
                  margin: [8, 8, 8, 5]
                }],
                [{
                  stack: [
                    {
                      text: `OD: ${data.visualAcuity.pupilRedRE ? 'Presente' : 'Ausente'}`,
                      style: data.visualAcuity.pupilRedRE ? 'positiveResult' : 'negativeResult'
                    },
                    {
                      text: `OI: ${data.visualAcuity.pupilRedLE ? 'Presente' : 'Ausente'}`,
                      style: data.visualAcuity.pupilRedLE ? 'positiveResult' : 'negativeResult',
                      margin: [0, 5, 0, 0]
                    }
                  ],
                  margin: [8, 5, 8, 8]
                }]
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ],
        columnGap: 20
      },

      // Enhanced Refraction sections
      {
        stack: [
          {
            text: 'REFRACCIÓN SUBJETIVA',
            style: 'sectionTitle',
            margin: [0, 25, 0, 15]
          },

          // Distance refraction
          { text: 'Visión de Lejos', style: 'subsectionTitle' },
          {
            table: {
              headerRows: 1,
              widths: ['12%', '18%', '18%', '12%', '22%', '18%'],
              body: [
                [
                  { text: '', style: 'tableHeader' },
                  { text: 'Esfera', style: 'tableHeader', alignment: 'center' },
                  { text: 'Cilindro', style: 'tableHeader', alignment: 'center' },
                  { text: 'Eje', style: 'tableHeader', alignment: 'center' },
                  { text: 'AV Alcanzada', style: 'tableHeader', alignment: 'center' },
                  { text: 'DP (mm)', style: 'tableHeader', alignment: 'center' }
                ],
                [
                  { text: 'OD', style: 'eyeLabel' },
                  { text: data.subjectiveRefractionsFar.sphereRE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.cylinderRE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.axisRE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.vareachedRE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.pupilarDistance, alignment: 'center' }
                ],
                [
                  { text: 'OI', style: 'eyeLabel' },
                  { text: data.subjectiveRefractionsFar.sphereLE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.cylinderLE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.axisLE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.vareachedLE, alignment: 'center' },
                  { text: '', alignment: 'center' }
                ]
              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? '#e8f4f8' : (rowIndex % 2 === 0 ? '#f8f9fa' : null);
              }
            },
            margin: [0, 0, 0, 15]
          },

          // Near refraction
          { text: 'Visión de Cerca', style: 'subsectionTitle' },
          {
            table: {
              headerRows: 1,
              widths: ['12%', '18%', '18%', '12%', '22%', '18%'],
              body: [
                [
                  { text: '', style: 'tableHeader' },
                  { text: 'Esfera', style: 'tableHeader', alignment: 'center' },
                  { text: 'Cilindro', style: 'tableHeader', alignment: 'center' },
                  { text: 'Eje', style: 'tableHeader', alignment: 'center' },
                  { text: 'AV Alcanzada', style: 'tableHeader', alignment: 'center' },
                  { text: 'DP (mm)', style: 'tableHeader', alignment: 'center' }
                ],
                [
                  { text: 'OD', style: 'eyeLabel' },
                  { text: data.subjectiveRefractionsNear.sphereRE, alignment: 'center' },
                  { text: data.subjectiveRefractionsNear.cylinderRE, alignment: 'center' },
                  { text: data.subjectiveRefractionsNear.axisRE, alignment: 'center' },
                  { text: data.subjectiveRefractionsNear.vareachedRE, alignment: 'center' },
                  { text: '', alignment: 'center' }
                ],
                [
                  { text: 'OI', style: 'eyeLabel' },
                  { text: data.subjectiveRefractionsFar.sphereLE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.cylinderLE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.axisLE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.vareachedLE, alignment: 'center' },
                  { text: data.subjectiveRefractionsFar.pupilarDistance, alignment: 'center' }
                ],
                [
                  { text: 'ADD', style: 'addLabel', fillColor: '#fff3e0' },
                  { text: data.subjectiveRefractionsNear.add, alignment: 'center', bold: true },
                  { text: '', alignment: 'center' },
                  { text: '', alignment: 'center' },
                  { text: '', alignment: 'center' },
                  { text: '', alignment: 'center' }
                ]
              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? '#e8f4f8' : (rowIndex === 3 ? '#fff3e0' : (rowIndex % 2 === 0 ? '#f8f9fa' : null));
              }
            }
          }
        ]
      },

      // Measurements section with improved layout
      {
        columns: [
          {
            width: '48%',
            stack: [
              { text: 'TONOMETRÍA APLANÁTICA', style: 'subsectionTitle', margin: [0, 20, 0, 8] },
              {
                table: {
                  widths: ['30%', '70%'],
                  body: [
                    [
                      { text: 'OD', style: 'eyeLabel' },
                      { text: `${data.applanationTonometry.rightEye} mmHg`, style: 'measurementValue' }
                    ],
                    [
                      { text: 'OI', style: 'eyeLabel' },
                      { text: `${data.applanationTonometry.leftEye} mmHg`, style: 'measurementValue' }
                    ],
                    [
                      { text: 'Hora', style: 'fieldLabel' },
                      { text: new Date(data.latestClinicalDate).toLocaleTimeString('es-US'), style: 'fieldValue' }
                    ]
                  ]
                },
                layout: 'lightHorizontalLines'
              }
            ]
          },
          {
            width: '48%',
            stack: [
              { text: 'LENSOMETRÍA', style: 'subsectionTitle', margin: [0, 20, 0, 8] },
              {
                table: {
                  headerRows: 1,
                  widths: ['25%', '25%', '25%', '25%'],
                  body: [
                    [
                      { text: '', style: 'tableHeader' },
                      { text: 'Esfera', style: 'tableHeader', alignment: 'center' },
                      { text: 'Cilindro', style: 'tableHeader', alignment: 'center' },
                      { text: 'Eje', style: 'tableHeader', alignment: 'center' }
                    ],
                    [
                      { text: 'OD', style: 'eyeLabel' },
                      { text: data.lensometry.sphereRE, alignment: 'center' },
                      { text: data.lensometry.cylinderRE, alignment: 'center' },
                      { text: data.lensometry.axisRE, alignment: 'center' }
                    ],
                    [
                      { text: 'OI', style: 'eyeLabel' },
                      { text: data.lensometry.sphereLE, alignment: 'center' },
                      { text: data.lensometry.cylinderLE, alignment: 'center' },
                      { text: data.lensometry.axisLE, alignment: 'center' }
                    ],
                    [
                      { text: 'ADD', style: 'addLabel', fillColor: '#fff3e0' },
                      { text: data.lensometry.add, alignment: 'center', bold: true },
                      { text: '', alignment: 'center' },
                      { text: '', alignment: 'center' }
                    ]
                  ]
                },
                layout: {
                  fillColor: function (rowIndex) {
                    return rowIndex === 0 ? '#e8f4f8' : (rowIndex === 3 ? '#fff3e0' : null);
                  }
                }
              }
            ]
          }
        ],
        columnGap: 20
      },

      // Autorefractometry
      {
        stack: [
          { text: 'AUTOREFRACTOMETRÍA', style: 'subsectionTitle', margin: [0, 20, 0, 8] },
          {
            table: {
              headerRows: 1,
              widths: ['25%', '25%', '25%', '25%'],
              body: [
                [
                  { text: '', style: 'tableHeader' },
                  { text: 'Esfera', style: 'tableHeader', alignment: 'center' },
                  { text: 'Cilindro', style: 'tableHeader', alignment: 'center' },
                  { text: 'Eje', style: 'tableHeader', alignment: 'center' }
                ],
                [
                  { text: 'OD', style: 'eyeLabel' },
                  { text: data.autorefractometry.sphereRE, alignment: 'center' },
                  { text: data.autorefractometry.cylinderRE, alignment: 'center' },
                  { text: data.autorefractometry.axisRE, alignment: 'center' }
                ],
                [
                  { text: 'OI', style: 'eyeLabel' },
                  { text: data.autorefractometry.sphereLE, alignment: 'center' },
                  { text: data.autorefractometry.cylinderLE, alignment: 'center' },
                  { text: data.autorefractometry.axisLE, alignment: 'center' }
                ]
              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? '#e8f4f8' : (rowIndex % 2 === 0 ? '#f8f9fa' : null);
              }
            }
          }
        ]
      },

      // Clinical conclusions section
      {
        stack: [
          {
            text: 'CONCLUSIONES CLÍNICAS',
            style: 'sectionTitle',
            margin: [0, 25, 0, 15]
          },
          {
            table: {
              widths: ['100%'],
              body: [
                [{
                  stack: [
                    { text: 'Otros Exámenes', style: 'conclusionLabel' },
                    { text: data.otherExam || 'No se realizaron exámenes adicionales', style: 'conclusionText' }
                  ],
                  margin: [12, 10, 12, 8]
                }],
                [{
                  stack: [
                    { text: 'Observaciones Clínicas', style: 'conclusionLabel' },
                    { text: data.observations || 'Sin observaciones particulares', style: 'conclusionText' }
                  ],
                  margin: [12, 8, 12, 8]
                }],
                [{
                  stack: [
                    { text: 'Diagnóstico', style: 'conclusionLabel' },
                    { text: createTextDiagnosis(data.typeDiagnosis), style: 'conclusionTextImportant' }
                  ],
                  margin: [12, 8, 12, 8],
                  fillColor: '#e8f5e8'
                }],
                [{
                  stack: [
                    { text: 'Indicaciones y Tratamiento', style: 'conclusionLabel' },
                    {
                      text: data.typeIndication.value + (data.typeDiagnosis.artificialTear ? '\n• Uso de lágrimas artificiales según necesidad' : ''),
                      style: 'conclusionTextImportant'
                    }
                  ],
                  margin: [12, 8, 12, 10],
                  fillColor: '#fff3e0'
                }]
              ]
            },
            layout: 'lightHorizontalLines'
          }
        ]
      }
    ],
    footer: {
      columns: [
        {
          text: [
            { text: 'CONSULTA OFTALMOLÓGICA DE ÓPTICA TARAPACÁ\n', style: 'footerTitle' },
            { text: 'Francisco Bilbao 3717 local 2\n', style: 'footerText' },
            { text: 'oftalmologia.tarapaca@gmail.com\n', style: 'footerText' },
            { text: 'Iquique', style: 'footerText' }
          ],
          alignment: 'center',
          width: '100%'
        }
      ],
      margin: [0, 10, 0, 0]
    },
    styles: {
      mainTitle: {
        fontSize: 20,
        bold: true,
        color: '#2c5aa0',
        alignment: 'left'
      },
      recordNumber: {
        fontSize: 14,
        bold: true,
        color: '#2c5aa0',
        alignment: 'center',
        margin: [8, 8, 8, 8]
      },
      sectionTitle: {
        fontSize: 14,
        bold: true,
        color: '#1976d2',
        alignment: 'left'
      },
      subsectionTitle: {
        fontSize: 12,
        bold: true,
        color: '#424242',
        margin: [0, 8, 0, 5]
      },
      tableTitle: {
        fontSize: 12,
        bold: true,
        color: '#1976d2',
        alignment: 'center',
        margin: [0, 8, 0, 8]
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        color: '#37474f',
        fillColor: '#e8f4f8',
        margin: [4, 6, 4, 6]
      },
      fieldLabel: {
        fontSize: 10,
        bold: true,
        color: '#37474f',
        margin: [8, 4, 4, 4]
      },
      fieldValue: {
        fontSize: 10,
        color: '#212121',
        margin: [4, 4, 8, 4]
      },
      fieldValueBold: {
        fontSize: 10,
        bold: true,
        color: '#212121',
        margin: [4, 4, 8, 4]
      },
      eyeLabel: {
        fontSize: 10,
        bold: true,
        color: '#1976d2',
        margin: [4, 4, 4, 4]
      },
      addLabel: {
        fontSize: 10,
        bold: true,
        color: '#f57c00',
        margin: [4, 4, 4, 4]
      },
      measurementValue: {
        fontSize: 11,
        bold: true,
        color: '#2e7d32',
        margin: [4, 4, 4, 4]
      },
      clinicalText: {
        fontSize: 10,
        color: '#424242',
        lineHeight: 1.3,
        margin: [0, 4, 0, 8]
      },
      conclusionLabel: {
        fontSize: 11,
        bold: true,
        color: '#1976d2',
        margin: [0, 0, 0, 4]
      },
      conclusionText: {
        fontSize: 10,
        color: '#424242',
        lineHeight: 1.3
      },
      conclusionTextImportant: {
        fontSize: 10,
        bold: true,
        color: '#212121',
        lineHeight: 1.3
      },
      positiveResult: {
        fontSize: 10,
        color: '#2e7d32',
        bold: true
      },
      negativeResult: {
        fontSize: 10,
        color: '#d32f2f',
        bold: true
      },
      patientInfoTable: {
        margin: [0, 0, 0, 20]
      },
      footerTitle: {
        fontSize: 10,
        bold: true,
        color: '#848884'
      },
      footerText: {
        fontSize: 8,
        color: '#848884'
      },
    },
    defaultStyle: {
      fontSize: 10,
      color: '#212121',
      lineHeight: 1.2
    }
  };
  // Create and return the PDF document
  return printer.createPdfKitDocument(docDefinition);
}

module.exports = {
  createPdfDocument,
  createPDFClinicalRecord
};
