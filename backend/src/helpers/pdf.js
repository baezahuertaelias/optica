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

module.exports = {
  createPdfDocument,
};
