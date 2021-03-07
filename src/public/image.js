const { createWorker } = require("tesseract.js");
const fs = require("fs");

const worker = createWorker({
  logger: m => console.log(m)
});

async function ocr(filename) {
  await worker.load();
  await worker.loadLanguage("jpn");
  await worker.initialize("jpn");
  const {
    data: { text }
  } = await worker.recognize(filename);
  await output_file(text);
  console.log(text);
  await worker.terminate();
};

async function output_file(text) {
  fs.writeFile("output.txt", text, (err) => {
    if (err) throw err;
    console.log('正常に書き込みが完了しました');
  });
};

let filename = process.argv[2];
ocr(filename)
