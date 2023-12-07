import { Router } from "express";
import { runAsyncWrapper } from "../utils/wrapper.js";
import {
  getAll,
  getById,
  createTransaction,
} from "../repository/transactions.js";
import { isAuthorized } from "../middlewares/authorization.js";
import { CAN_VIEW_TRANSACTIONS } from "../utils/constants.js";
import PDFDocument from "pdfkit";

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
    try {
      await createTransaction({
        ...req.body,
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }

    res.status(201).end();
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

    const doc = new PDFDocument({ bufferPages: true });
    let filename = req.body.filename;
    filename = encodeURIComponent(filename) + ".pdf";

    res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // add text horizontally centered inside PDF page
    doc.fontSize(25).text('PROFORMA', 100, 80);

    doc.fontSize(13).text('Quotation Number: 12345', 50, 80);
    doc.text('Date: ' + new Date().toLocaleDateString(), 50, 100);

    let y = 150; // Initial vertical position for the table

    const table = {
      headers: ['Item', 'Description', 'Quantity', 'Unit Price', 'Total'],
      rows: [
        ['Item 1', 'Description 1', '1', '$100', '$100'],
        ['Item 2', 'Description 2', '2', '$200', '$400'],
        // Add more rows as needed
      ],
    };

    // Draw the headers
    table.headers.forEach((header, i) => {
      doc.fontSize(13).text(header, 50 + i*100, y);
    });

    // Draw a horizontal line
    doc.moveTo(50, y+20).lineTo(550, y+20).stroke();

    // Draw the rows
    table.rows.forEach((row, i) => {
      y = y + 30;
      row.forEach((column, j) => {
        doc.fontSize(10).text(column, 50 + j*100, y);
      });
    });

    // Calculate and write the total amount
    let totalAmount = table.rows.reduce((sum, row) => sum + parseFloat(row[4].substring(1)), 0);
    doc.fontSize(13).text('Total Amount: $' + totalAmount, 50, y + 50);


    doc.end();
  })
);

export default router;
