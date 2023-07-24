"use strict";

import path from "path";
import cluster from "cluster";
import os from "os";
import cors from "cors";
import express from "express";
import sequelize from "./utilities/database.js";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
//all error controllers imported here
// import { corsError } from "./middleware/error-handlers/cors-error.js";
import { centralError } from "./middleware/error-handlers/central-error.js";

const cpu = os.cpus().length;

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const port = process.env.PORT || 8000;

const app = express();
app.get("/", (req, res) => {
  res.send(
    `<!DOCTYPE html>
<html lang="en">

  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type='text/javascript'> 
title = "Server Status | | Backend server";
position = 0;
function scrolltitle() {
    document.title = title.substring(position, title.length) + title.substring(0, position); 
    position++;
    if (position > title.length) position = 0;
    titleScroll = window.setTimeout(scrolltitle,170);
}
scrolltitle();
</script>
  </head>
  <body">
  <div style="border: 1px solid green">
  <h1 style="background-color: orange"><bold>Your API is working check other errors </bold></h1
  </div>
  </body>
</html>`
  );
});

//all routes import here
import userRoutes from "./routes/user-routes.js";

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < cpu; i++) {
    cluster.fork();
  }
  console.log(cpu);
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  //defining absolute path of current WORKDIR
  const __dirname = path.resolve();

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(express.static(__dirname));
  app.use(express.static(path.join(__dirname, "public")));
  app.use(
    cors({
      origin: "*",
    })
  );

  app.use("/user", userRoutes);

  app.use(helmet());
  app.use(compression());
  //handle cors error
//   app.use(corsError);
  app.use(centralError);

  // sync with database
  // need to check auth with database after that sync with database
  sequelize
    .sync()
    .then(() => {
      app.listen(port);
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(`Server is running on port ${port}`);
}