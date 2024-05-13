const express = require("express");
const app = express();
const port = 4000;

const bodyParser = require("body-parser");

const router = require("./apiRouter");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hellooooooo");
});

app.use("/api/v1/", router);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
