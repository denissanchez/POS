import dotenv from "dotenv";

dotenv.config();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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


createConnection();

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
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
    return done(null, {
      id: 1234,
      username,
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  done(null, {
    id: 1234,
    username: "admin",
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/views/login.html");
});

app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.use("/api/v1", AuthRoutes);

app.get('*.*', express.static(path.resolve(__dirname + "/front/browser"), {
  maxAge: '1y'
}));

app.get("*", isAuthenticated, function (req, res) {
  res.sendFile(__dirname + "/front/browser/index.html");
});

const server = createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  const adapter = getAdapter();
  const id = adapter.addSubscriber(socket);

  socket.on("disconnect", () => {
    adapter.removeSubscriber(id);
  });
});

const port = process.env.PORT || 8080;

server.listen(port, () => {
  console.log(`server listening on http://localhost:${port}`);
});
