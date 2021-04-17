//. pdf-sample.js
const fs = require("fs");
const pdf = require("pdf-parse");

// process.argv :コマンドラインの引数
// if (process.argv.length > 1) {
//   var filename = process.argv[2];
//   var buf = fs.readFileSync(filename);
//   pdf(buf)
//     .then(function (data) {
//       var text = data.text;
//       console.log(text);
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// } else {
//   console.log("Usage: $ node pdf-sample ");
// }

function render_page(pageData) {
  //check documents https://mozilla.github.io/pdf.js/
  let render_options = {
    //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
    normalizeWhitespace: true,
    //do not attempt to combine same line TextItem's. The default value is `false`.
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(render_options).then(function (textContent) {
    let lastY,
      text = "";
    for (let item of textContent.items) {
      // console.log(item.str);
      if (lastY == item.transform[5] || !lastY) {
        text += item.str;
      } else {
        text += "\n" + item.str;
      }
      lastY = item.transform[5];
    }
    return text;
  });
}

let options = {
  pagerender: render_page,
};

// 直接ファイル名を指定してみる
const filename = "./../pdf/nissan.pdf";
let buf = fs.readFileSync(filename);
pdf(buf, options)
  .then((data) => {
    const text = data.text;
    // fs.writeFileSync("output.txt", text);

    // substr(開始位置, 文字数);
    // const key = "現金及び預金";
    const key = "貸倒引当金";

    const a = text.search(key);
    // const b = text.search("受取手形及び売掛金");
    const b = text.search("流動資産合計");

    // 行のピックアップ

    let obj = {}; // { key: [前回, 今回] }
    const item = text.substr(a, b - a);
    let value = item.substr(key.length);

    // console.log(text);

    // obj = { text: text, prev: undefined, next: undefined };

    // // 空白や改行コードを削除する
    // obj = trimText(obj);

    // // 1. - があれば、ゼロにする
    // obj = checkBlank(obj);

    // // 2. △ があれば、マイナスにする
    // obj = checkMinusSymbol(obj);

    // // 3. カンマを基に、数字を区切る
    // obj = checkNumberDigitsByComma(obj);

    // // カンマの削除, number型へ変換
    // let temp = "1,222,333,444";
    // temp = temp.replace(/,/g, "");
    // temp = Number(temp);
    // console.log(temp);

    // console.log(obj);

    // 日本語の識別
    // https://qiita.com/graminume/items/2ac8dd9c32277fa9da64
    console.log(isJapanese(text));
  })
  .catch((err) => {
    console.log(err);
  });

const trimText = (obj) => {
  let newText = obj.text;

  // 改行コードの削除
  // http://piyopiyocs.blog115.fc2.com/blog-entry-933.html
  newText = newText.replace(/\r?\n/g, "");

  // 空白文字の削除
  newText = newText.replace(/\s+/g, "");

  obj.text = newText;

  return obj;
};

const checkBlank = (obj) => {
  // 1. - があれば、0に
  const firstNumber = obj.text.slice(0, 1);
  const lastNumber = obj.text.slice(-1);

  if (obj.text.charAt(firstNumber) == "―") {
    obj.prev = 0;
  }
  if (obj.text.charAt(lastNumber) == "―") {
    // obj[key][1] = 0;
    obj.next = 0;
  }

  return obj;
};

const checkMinusSymbol = (obj) => {
  if (!obj.text.includes("△")) return;
  const text = obj.text;

  if (obj.prev || obj.next) {
    // すでに 配列に代入されている場合
    //
    // 🔥 後で記載する 🔥
    //
  } else {
    // 配列に何も代入されていない場合

    interNumbers = text.slice(1, text.length - 1);
    // 文字列の途中に △ があるか確認
    if (interNumbers.includes("△")) {
      // 存在すれば、△ を境に分断
      //// 今年度の数字
      const presentNumber = `-${text.slice(interNumbers.indexOf("△") + 2)}`;
      obj.next = presentNumber;
      //// 前年度の数字
      let prevNumber = text.slice(0, interNumbers.indexOf("△") + 1);
      if (prevNumber.includes("△")) {
        prevNumber = `-${text.slice(1, interNumbers.indexOf("△") + 1)}`;
      }
      obj.prev = prevNumber;
    } else {
      // 文字列の途中に △ がない場合（先頭にのみ △ がある場合）
      obj.text = `-${text.slice(1)}`;
    }
  }

  return obj;
};

// // 3.

// // 4 カンマを取り除き、number型へ変換する

const isJapanese = (str) => {
  return str.match(/^[\u30a0-\u30ff\u3040-\u309f\u3005-\u3006\u30e0-\u9fcf]+$/)
    ? true
    : false;
};
