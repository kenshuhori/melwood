const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const multer = require("multer");
const { getData } = require("./pdf");
const { readAll, read, insertRow } = require("./supabase");

app.use(cors());

const port = process.env.PORT || 4000;

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
    obj = await getData(req.file.path);
    let company = obj["company"]
    let company_exist = await read("companies", {column: "code", value: company["code"]})
    if(!company_exist) {
      let company_inserted = await insertRow("companies", {
        name: company["name"],
        code: company["code"]
      })
    }
    res.json(obj);
  });
});

app.get("/", (req, res, next) => {
  console.log(`melwood-backend is running port at ${port}`)
})

app.listen(port, () => {
  console.log(`${port} でサーバー立ち上げ中....`);
});
