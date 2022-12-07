const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
const path = require("path");
const multer = require("multer");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Make connection with db
const connectionToDb = async () => {
  await mongoose
    .connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connection Successfull"))
    .catch((err) => {
      console.error(err);
    });
};
connectionToDb();

app.get("/", (req, res) => {
  return res.send("Welcome to the Application");
});

global.__basedir = __dirname;

// route imports
const userRouter = require("./routes/user");
const carRouter = require("./routes/car");

app.use("/tmp", express.static(path.join(__dirname, "/tmp")));

app.use("/api/user", userRouter);
app.use("/api/car", carRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
