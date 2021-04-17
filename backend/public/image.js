const { createWorker } = require("tesseract.js");
const fs = require("fs");

const worker = createWorker({
  logger: m => console.log(m)
});

async function ocr(filename) {
  await worker.load();
  await worker.loadLanguage("jpn+eng");
  await worker.initialize("jpn+eng");
  const {
    data: { text }
  } = await worker.recognize(filename);
  await cut_off_text(text);
  await worker.terminate();
};

async function cut_off_text(text) {
  rows = text.split("\n");
  for (let i in rows) {
    let row = convert_to_3words(rows[i]);
    console.log(row);
  }
};

function convert_to_3words(sentence) {
  let row = sentence.split('').map( char => convert_circlenum_to_num(char) );
  array_row = row.map(function(val, index, array) {
    if (!!array[index + 1] && isNaN(array[index + 1]) && val.match(/\s/g)) {
      return "";
    }
    return val;
  });
  return array_row.join('')
};

function convert_circlenum_to_num ( str ) {
  switch (str) {
    case "①": return "1";
    case "②": return "2";
    case "③": return "3";
    case "④": return "4";
    case "⑤": return "5";
    case "⑥": return "6";
    case "⑦": return "7";
    case "⑧": return "8";
    case "⑩": return "10";
    case "⑪": return "11";
    case "⑫": return "12";
    case "⑬": return "13";
    case "⑭": return "14";
    case "⑮": return "15";
    case "⑯": return "16";
    case "⑰": return "17";
    case "⑱": return "18";
    case "⑲": return "19";
    case "⑳": return "20";
    default : return str;
  }
};

let filename = process.argv[2];
ocr(filename)
