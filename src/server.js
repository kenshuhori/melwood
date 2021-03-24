const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const multer = require("multer");

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

const { getData } = require("./public/pdf_spike");

// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.json());
// mongoose.connect('mongodb://test:pass@db:27017');

app.use(cors());

// app.post("/", (req, res) => {
//   console.log("----------");
//   console.log(req);
//   console.log("----------");
//   res.json({ message: "success" });
// });

app.post("/", {
  upload((req, res, err) => {
    console.log("Request ----", req.body);
    console.log("Request ---file", req.file)
    if(!eff) {
      return res.send(200).end()
    }
  })
})

app.listen(4000, () => {
  console.log(" 4000 でサーバー立ち上げ中....");
});

// getData();
