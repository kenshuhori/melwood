const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const multer = require("multer");
const { getData } = require("./public/pdf_spike");

app.use(cors());

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "IMAGE-", Date.now() + path.extname(file.originalname));
    // extname: 拡張子
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myImage");

let obj;
app.post("/", (req, res, next) => {
  upload(req, res, async (error) => {
    obj = await getData(req.file);
    res.json(obj);
  });
});

app.listen(4000, () => {
  console.log(" 4000 でサーバー立ち上げ中....");
});
