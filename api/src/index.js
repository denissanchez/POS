import path from "path";
import { fileURLToPath } from "url";

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

app.get('*.*', express.static(path.resolve(__dirname + "/front/browser"), {
  maxAge: process.env.ENVIRONMENT === 'production' ? '1y' : 0
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
