import { format } from 'date-fns';
import { es } from 'date-fns/locale/index.js';
import { Router } from "express";
import path from "path";
import PDFDocument from "pdfkit";
import { fileURLToPath } from "url";
import wrapAnsi from 'wrap-ansi';
import { isAuthorized } from "../middlewares/authorization.js";
import {
  createTransaction,
  getAll,
  getById,
} from "../repository/transactions.js";
import { CAN_VIEW_TRANSACTIONS } from "../utils/constants.js";
import { runAsyncWrapper } from "../utils/wrapper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

router.get(
  "/",
  isAuthorized(CAN_VIEW_TRANSACTIONS),
  runAsyncWrapper(async (req, res) => {
    const { type, from, to } = req.query;

    if (!type || type === "") {
      res.json(getAll(from, to));
    } else {
      res.json(getAll(from, to, [type]));
    }
  })
);

router.post(
  "/",
  runAsyncWrapper(async (req, res) => {
    const { name, _id } = req.user;

    try {
      const transaction = await createTransaction({
        ...req.body,
        createdAt: new Date().toISOString(),
        seller: { _id, name},
      });

      res.status(201).json(transaction);
    } catch (e) {
      console.error(e);
      res.status(500).send(e);
    }
  })
);

router.get(
  "/:id",
  isAuthorized(CAN_VIEW_TRANSACTIONS),
  runAsyncWrapper(async (req, res) => {
    const transaction = await getById(req.params.id);

    if (transaction) {
      res.json(transaction);
    } else {
      res.status(404).json({
        message: "Transacción no encontrada",
      });
    }
  })
);

router.get(
  "/print/:id",
  isAuthorized(CAN_VIEW_TRANSACTIONS),
  runAsyncWrapper(async (req, res) => {
    const transaction = await getById(req.params.id);

    const title = ('PROFORMA_' + transaction.client.name.replace(/\s/g, '_')).toUpperCase();

    if (!transaction) {
      res.status(404).json({
        message: "Transacción no encontrada",
      });

      return;
    }

    const doc = new PDFDocument({ bufferPages: true });
    const filename = encodeURIComponent(title) + ".pdf";

    res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
    res.setHeader("Content-type", "application/pdf");


    doc.info['Title'] = title;

    doc.pipe(res);

    const pageWidth = doc.page.width;

    doc.image(path.join(__dirname, "./../front/browser/assets/img/logo.jpeg"), 240, 40, { width: 130 });

    doc.rect(50, 100, pageWidth - 100, 27).fill("#005b96");

    doc.font('Helvetica-Bold')
    doc.fontSize(23).fill("#f3f6f4").text('PROFORMA', (pageWidth / 2) - 80, 105);
    doc.font('Helvetica')

    doc.fillColor("black");
    doc.font('Helvetica-Bold')
    doc.fontSize(11).text('DIRECCIÓN:', 50, 135);
    doc.font('Helvetica')
    doc.fontSize(11).text('Jr. Ayacucho B18 (Ref. a dos cuadras del Real Plaza) - Cajamarca', 150, 135);

    doc.font('Helvetica-Bold')
    doc.fontSize(11).text('RUC:', 50, 150);
    doc.font('Helvetica')
    doc.fontSize(11).text('10736606319', 150, 150);

    doc.rect(50, 165, pageWidth - 100, 24).fill("#005b96");

    doc.font('Helvetica-Bold')
    doc.fontSize(20).fill("#f3f6f4").text('DATOS DE CLIENTE:', (pageWidth / 2) - 100, 170);
    doc.font('Helvetica')

    doc.fillColor("black");
    doc.font('Helvetica-Bold')
    doc.fontSize(11).text(`RAZÓN SOCIAL:`, 50, 200);
    
    doc.font('Helvetica')
    doc.fontSize(11).text(`${transaction.client.name}`, 150, 200);

    doc.font('Helvetica-Bold')
    doc.fontSize(11).text(`RUC/DNI:`, 50, 215);

    doc.font('Helvetica')
    doc.fontSize(11).text(`${transaction.client._id}`, 150, 215);

    doc.font('Helvetica-Bold')
    doc.fontSize(11).text(`TELEFONO:`, 50, 230);
    
    doc.font('Helvetica')
    doc.fontSize(11).text(`${transaction.client.phone}`, 150, 230);

    doc.rect(50, 250, pageWidth - 100, 24).fill("#005b96");

    doc.font('Helvetica-Bold')
    doc.fontSize(20).fill("#f3f6f4").text('DATOS DEL VEHICULO:', (pageWidth / 2) - 110, 255);
    doc.font('Helvetica')

    doc.fillColor("black");

    doc.font('Helvetica-Bold')
    doc.fontSize(11).text(`MARCA/MODELO:`, 50, 285);
    
    doc.font('Helvetica')
    doc.fontSize(11).text(`${transaction.car.brand} ${transaction.car.model}`, 150, 285);
    
    doc.font('Helvetica-Bold')
    doc.fontSize(11).text(`AÑO:`, 50, 300);

    doc.font('Helvetica')
    doc.fontSize(11).text(`${transaction.car.year || '-'}`, 150, 300);

    doc.font('Helvetica-Bold')
    doc.fontSize(11).text(`PLACA:`, 50, 315);

    doc.font('Helvetica')
    doc.fontSize(11).text(`${transaction.car.plate}`, 150, 315);

    let y = 345;

    const table = {
      starts: [50, 100, 210, 370, 420, 480],
      headers: ['ÍTEM', 'TIPO', 'DESCRIPCIÓN', 'CANT.', 'P. UNIT.', 'SUBTOTAL'],
    };

    doc.font('Helvetica-Bold')

    table.headers.forEach((header, i) => {
      doc.fontSize(11).text(header, table.starts[i], y);
    });

    doc.font('Helvetica')

    doc.moveTo(50, y + 15).lineTo(pageWidth - 50, y + 15).stroke();

    const items = {
      starts: [60, 85, 180, 380, 415, 485],
      rows: transaction.items.map((item, index) => {
        const subtotal = item.subtotal - (item.subtotal * 0.18);

       return [
          index + 1,
          item.product.category,
          wrapAnsi(item.product.name.replace('(Por mayor)', '')),
          item.quantity,
          `S/ ${(subtotal / item.quantity).toFixed(2)}`,
          `S/ ${subtotal.toFixed(2)}`
        ]
      })
    }

    y = y + 20;

    items.rows.forEach((row, i) => {
      row.forEach((column, j) => {
        doc.fontSize(10).text(column, items.starts[j], y);
      });

      y = y + 25;
      doc.moveTo(50, y).lineTo(pageWidth - 50, y).stroke();

      y = y + 5;
    });
    
    const total = transaction.items.reduce((acc, item) => acc + item.subtotal, 0);
    const igv = total * 0.18;
    const subtotal = total - igv;

    doc.font('Helvetica-Bold').fontSize(11).text(`SUBTOTAL:`, 415, y + 5);
    doc.font('Helvetica').fontSize(11).text(`S/ ${subtotal.toFixed(2)}`, 485, y + 5);
    
    doc.font('Helvetica-Bold').fontSize(11).text(`IGV:`, 415, y + 20);
    doc.font('Helvetica').fontSize(11).text(`S/ ${igv.toFixed(2)}`, 485, y + 20);

    doc.font('Helvetica-Bold').fontSize(11).text(`TOTAL:`, 415, y + 35);
    doc.font('Helvetica').fontSize(11).text(`S/ ${total.toFixed(2)}`, 485, y + 35);

    y = 625;

    doc.fillColor("red");
    doc.font('Helvetica-Bold').fontSize(11).text('NOTA', 50, y);

    doc.fillColor("black");
    doc.font('Helvetica').fontSize(11).text(transaction.note || '-', 50, y + 15);

    y = 670;

    doc.font('Helvetica-Bold').fontSize(11).text(`FECHA`, 50, y);
    doc.font('Helvetica').fontSize(11).text(format(new Date(transaction.createdAt), "eeee, dd 'de' MMMM 'del' yyyy", { locale: es }), 110, y);

    doc.font('Helvetica-Bold').fontSize(11).text(`VIGENCIA:`, 50, y + 15);
    doc.font('Helvetica').fontSize(11).text(`3 dias hábiles desde su emisión.`, 110, y + 15);

    doc.moveTo(50, y + 28).lineTo(pageWidth - 50, y + 28).stroke();

    doc.font('Helvetica-Bold').fontSize(11).text(`Contacto:`, 50, y + 33);
    doc.font('Helvetica').fontSize(11).text(`César Wagner Terrones Vera`, 105, y + 33);
    doc.font('Helvetica-Bold').fontSize(11).text(`- WhatsApp:`, 248, y + 33);
    doc.font('Helvetica').fontSize(11).text(`935990943`, 315, y + 33);
    doc.font('Helvetica-Bold').fontSize(11).text(`- Correo:`, 371, y + 33);
    doc.font('Helvetica').fontSize(11).text(`cesarw.vera@gmail.com`, 420, y + 33);

    doc.end();
  })
);

export default router;
