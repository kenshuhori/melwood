const { createWorker } = require("tesseract.js");

const worker = createWorker();

(async () => {
  await worker.load();
  await worker.loadLanguage("jpn");
  await worker.initialize("jpn");
  const {
    data: { text }
  } = await worker.recognize("image.png");
  console.log(text);
  await worker.terminate();
})();
