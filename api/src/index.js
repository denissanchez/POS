import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { config as dotEnvConfig } from "dotenv";

const dotenv = dotEnvConfig({
  path: path.join(__dirname, "./../.env"),
})

if (dotenv.error) {
  throw dotenv.error
}

import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { getAdapter } from "./repository/excel.js";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import AuthRoutes from "./auth.routes.js";
import { isAuthenticated } from "./middlewares/secure.js";
import { createConnection } from "./repository/db.js";
import { verifyCredentials, create, getById } from "./repository/users.js";


createConnection();

const app = express();

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 10 * 60 * 60 * 1000 },
  })
);

passport.use(
  new LocalStrategy(function verify(username, password, done) {
    const user = verifyCredentials(username, password);

    if (!user) {
      return done(null, false, { message: "Incorrect username or password" });
    }


    return done(null, user);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (_id, done) {
  done(null, getById(_id));
});

app.use(passport.initialize());
app.use(passport.session());


const server = createServer(app);
const io = new Server(server);

app.use((req, res, next) => {
  req.io = io;
  next();
});

io.on("connection", (socket) => {
  const adapter = getAdapter();
  const id = adapter.addSubscriber(socket);

  socket.on('summary:capture', () => {
    io.emit('summary:capture')
  })

  socket.on('summary:cancel', () => {
    io.emit('summary:cancel')
  })

  socket.on("disconnect", () => {
    adapter.removeSubscriber(id);
  });
});

app.get("/login", function (req, res) {
  res.render('login');
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.get("/user", isAuthenticated, function (req, res) {
  const { password, ...userInfo } = req.user;
  res.json(userInfo);
});

app.get("/logout", function (req, res, next) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/login");
  });
});

app.get("/setup", function (req, res) {
  create({
    name: "Denis Sanchez",
    username: "admin",
    password: "admin",
  });
  res.end();
});

app.use("/api/v1", AuthRoutes);

app.get("/api/print", async (req, res) => {
  const doc = new PDFDocument({ bufferPages: true });
    let filename = req.body.filename;
    filename = encodeURIComponent(filename) + ".pdf";

    res.setHeader("Content-disposition", 'inline; filename="' + filename + '"');
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // add text with the content 'PROFORMA' horizontally centered inside PDF page
    const pageWidth = doc.page.width;

    console.log(pageWidth)

    doc.fontSize(25).text('PROFORMA', (pageWidth / 2) - 80, 50);
    doc.fontSize(11).text('DIRECCIÓN: Jr. Ayacucho B18 (Ref. a dos cuadras del real plaza)- Cajamarca', 50, 85);
    doc.fontSize(11).text('RUC: 123456789', 450, 85);


    doc.fontSize(20).text('DATOS DE CLIENTE', (pageWidth / 2) - 100, 120);
    doc.fontSize(11).text('RAZÓN SOCIAL: DERCO S.A.C', 50, 150);
    doc.fontSize(11).text('NRO. DOCUMENTO: 123456789', 50, 165);
    doc.fontSize(11).text('TELEFONO: 123456789', 50, 180);

    doc.fontSize(20).text('DATOS DEL VEHICULO', (pageWidth / 2) - 100, 220);
    doc.fontSize(11).text('MARCA/MODELO: DERCO S.A.C', 50, 250);
    doc.fontSize(11).text('AÑO: 123456789', 50, 265);
    doc.fontSize(11).text('PLACA: 123456789', 50, 280);

    // doc.fontSize(13).text('Quotation Number: 12345', 50, 80);
    // doc.text('Date: ' + new Date().toLocaleDateString(), 50, 100);

    let y = 320; // Initial vertical position for the table

    const table = {
      widths: [10, 30, 50, 30, 30, 30],
      headers: ['ÍTEM', 'TIPO', 'DESCRIPCIÓN', 'CANTIDAD', 'P. UNIT.', 'SUBTOTAL'],
      rows: [
        [1, 'TIPO', 'DESCRIPCIÓN', 'CANTIDAD', 'P. UNIT.', 'SUBTOTAL'],
        [2, 'TIPO', 'DESCRIPCIÓN', 'CANTIDAD', 'P. UNIT.', 'SUBTOTAL'],
      ],
    };

    table.headers.forEach((header, i) => {
      doc.fontSize(11).text(header, 50 + table.widths[i] + i*100, y);
    });

    // Draw a horizontal line
    // doc.moveTo(50, y+20).lineTo(550, y+20).stroke();

    // Draw the rows
    // table.rows.forEach((row, i) => {
    //   y = y + 30;
    //   row.forEach((column, j) => {
    //     doc.fontSize(10).text(column, 50 + j*100, y);
    //   });
    // });

    // Calculate and write the total amount
    // let totalAmount = table.rows.reduce((sum, row) => sum + parseFloat(row[4].substring(1)), 0);
    // doc.fontSize(13).text('Total Amount: $' + totalAmount, 50, y + 50);


    doc.end();
})

app.get('*.*', express.static(path.resolve(__dirname + "/front/browser"), {
  maxAge: process.env.ENVIRONMENT === 'production' ? '1y' : 0
}));

app.get("*", isAuthenticated, function (req, res) {
  res.sendFile(__dirname + "/front/browser/index.html");
});

const port = process.env.PORT || 8080;

server.listen(port, '0.0.0.0', () => {
  console.log(`server listening on http://localhost:${port}`);
});
