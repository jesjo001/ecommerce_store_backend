import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import multer from "multer";
import log from "./logger"; //logger doesnt block I/O like console.log does
import connect from "./db/connect";
import deserializeUser from "./middleware/validation/deserializeUser";
dotenv.config();

import Route from "./routes/routes";

const upload = multer({ dest: 'uploads/'});

const PORT = process.env.PORT as any;
const HOST = process.env.HOST as string;

const app = express();
app.use(deserializeUser);

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/", Route);
app.get("/", (req, res) => res.status(200).send("Welcome to Insta Feeds"));
app.get("*", (req, res) => res.status(404).send("Page not found"));

app.listen(PORT, HOST, () => {
  log.info(`Server listening at http://${HOST}:${PORT}/api/v1`);
  connect();
});
