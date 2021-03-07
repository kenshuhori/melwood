const { createWorker } = require("tesseract.js");

const worker = createWorker();

async function ocr(filename) {
  await worker.load();
  await worker.loadLanguage("jpn");
  await worker.initialize("jpn");
  const {
    data: { text }
  } = await worker.recognize(filename);
  console.log(text);
  await worker.terminate();
};

let filename = process.argv[2];
ocr(filename)
