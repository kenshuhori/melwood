//. pdf-sample.js
var fs = require("fs"),
  pdf = require("pdf-parse");
const { isNumber } = require("util");
const nestedObjectAssgin = require("nested-object-assign");

// default render callback
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
      pure_str = item.str.split(",").join("");
      // console.log(pure_str);
      // console.log(isNaN(Number(pure_str)) == false);
      // console.log(pure_str == "―");
      if (
        isNaN(Number(pure_str)) == false ||
        pure_str == "―" ||
        pure_str.charAt(0) == "△"
      ) {
        item.str = " " + item.str;
      }
      if (lastY == item.transform[5] || !lastY) {
        text += item.str;
      } else if (item.str) {
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

if (process.argv.length > 1) {
  var filename = process.argv[2];
  var buf = fs.readFileSync(filename);
  pdf(buf, options)
    .then(function (data) {
      var text = data.text;
      // console.log(text);

      convertToObject(text);
    })
    .catch(function (err) {
      console.log(err);
    });
} else {
  console.log("Usage: $ node pdf-sample ");
}

const arrayToNestedObject = (arr, value) => {
  let obj = {};

  for (let i = arr.length - 1; i >= 0; i--) {
    const key = arr[i];
    const prevKey = arr[i + 1];

    if (i === arr.length - 1) {
      obj[key] = value;
    } else {
      obj[key] = { [prevKey]: obj[prevKey] };
    }
  }
  obj = { [arr[0]]: obj[arr[0]] };

  return obj;
};

const convertToObject = (text) => {
  // 0. 「資産の部」までのデータを削除
  const index = text.indexOf("資産の部");
  text = text.slice(index - 1);

  // 0. obj, arr: 成果物
  let obj = {};
  let prevTempObj = {};
  let tempObj = {};
  let combinedObj = {};
  let key;
  let keys = [];
  let prevKeys = [];
  let tempArray = [];

  // 1. 改行コードを基に行を分割
  let textArray = [];
  textArray = text.split("\n");

  // 2. 空白区切りを基に１行を 1 or 3 つの要素に分割
  textArray.map((textLine) => {
    // console.log(textLine);

    elements = textLine.split(" ");
    //　🔥 例外
    if (elements[0] == "無形固定資産") return;
    if (elements[0] == "") return;

    // 要素数が3つの場合、「合計」が現れるまでループ
    if (elements.length === 3) {
      tempKey = elements[0];
      tempObj[tempKey] = [elements[1], elements[2]];

      if (!tempKey.includes("合計")) {
        return; // mapループの次の番へ（for の continueと同義）
      }
    }

    key = elements[0];
    if (Object.keys(tempObj).length === 0) {
      // 要素が1つのみ：key のみ
      keys.push(key);
    } else {
      // 要素が3つある： key value が揃ってる
      let temp = {};
      keys.map((_, i) => {
        if (keys[i] !== prevKeys[i]) {
          combinedObj = Object.assign({}, tempObj, prevTempObj);
          temp = arrayToNestedObject(keys, combinedObj);
        }
      });
      prevKeys = keys.slice();
      keys.pop();
      prevTempObj = tempObj;
      tempObj = {}; // リセット

      tempArray.push(temp);
    }
  });

  console.log(tempArray);

  let newObj = {};
  tempArray.map((item) => {
    if (Object.keys(item).length === 0) return;
    newObj = nestedObjectAssgin({}, newObj, item);
  });

  // console.log(newObj);
};
