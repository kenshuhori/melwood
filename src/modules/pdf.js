//. pdf-sample.js
let fs = require("fs"),
  pdf = require("pdf-parse");
let Asset = require("../model/asset");
let Liability = require("../model/liability");
let NetAsset = require("../model/net_asset");

// default render callback
function render_page(pageData) {
  let render_options = {
    normalizeWhitespace: true,
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(render_options).then(function (textContent) {
    let lastY,
      text = "";
    for (let item of textContent.items) {
      pure_str = item.str.split(",").join("");
      if (
        isNaN(Number(pure_str)) == false ||
        pure_str == "―" ||
        pure_str.charAt(0) == "△"
      ) {
        item.str = " " + item.str;
      }
      currentY = Math.round( item.transform[5] * Math.pow( 10, 2 ) ) / Math.pow( 10, 2 ); // 少数第2位まで残るように四捨五入
      if (lastY == currentY || !lastY) {
        text += item.str;
      } else if (item.str) {
        text += "\n" + item.str;
      }
      lastY = currentY;
    }
    return text;
  });
}

let options = {
  pagerender: render_page,
};

function toHalfWidth(str) {
  return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
    return String.fromCharCode(s.charCodeAt(0) - 65248);
  });
}

function companyInfoBuilder(text) {
  const category_end = "四半期決算説明会開催の有無";
  const category_data = text.substr(0, text.indexOf(category_end));
  const rows = category_data.split("\n");
  const regexpQuarter = /([0-9０-９]{4})年([0-9０-９])月期第([0-9０-９])四半期決算短信/;
  const regexpCompanyName = /上場会社名(.+)上場取引所/;
  const regexpCompanyCode = /コード番号([0-9]{4})/
  let companyInfo = {
    name: "",
    code: "",
    year: 0,
    quarter: 0,
  }
  rows.some(function (row_str) {
    row_str = row_str.replace(/ /g, "")
    if (!companyInfo.quarter && !!regexpQuarter.exec(row_str)) {
      let result = regexpQuarter.exec(row_str);
      companyInfo.year = toHalfWidth(result[1]);
      companyInfo.quarter = toHalfWidth(result[3]);
    } else if (!companyInfo.name && !!regexpCompanyName.exec(row_str)) {
      let result = regexpCompanyName.exec(row_str);
      companyInfo.name = result[1]
    } else if (!companyInfo.code && !!regexpCompanyCode.exec(row_str)) {
      let result = regexpCompanyCode.exec(row_str);
      companyInfo.code = toHalfWidth(result[1]);
    }
  })
  return companyInfo;
}

function assetBuilder(text) {
  const category_begin = "資産の部";
  const category_end = "資産合計";
  let amount_current_asset,
    amount_fixed_asset = 0;
  const category_data = text
    .slice(text.indexOf(category_begin) + category_begin.length)
    .trim();
  const rows = category_data.split("\n");
  rows.some(function (row_str) {
    let row = row_str.split(" ").filter((r) => r !== "");
    if (row.length == 3 && row[0] == "流動資産合計") {
      amount_current_asset = row[2];
    } else if (row.length == 3 && ["固定資産合計", "非流動資産合計"].includes(row[0])) {
      amount_fixed_asset = row[2];
    } else if (row.length == 3 && row[0] == category_end) {
      return true; // ループ終了
    }
  });
  return new Asset(amount_current_asset, amount_fixed_asset);
}

function liabilityBuilder(text) {
  const category_begin = "負債の部";
  const category_end = "負債合計";
  let amount_current_liability,
    amount_fixed_liability = 0;
  const category_data = text
    .slice(text.indexOf(category_begin) + category_begin.length)
    .trim();
  const rows = category_data.split("\n");
  rows.some(function (row_str) {
    let row = row_str.split(" ").filter((r) => r !== "");
    if (row.length == 3 && row[0] == "流動負債合計") {
      amount_current_liability = row[2];
    } else if (row.length == 3 && ["固定負債合計", "非流動負債合計"].includes(row[0])) {
      amount_fixed_liability = row[2];
    } else if (row.length == 3 && row[0] == category_end) {
      return true; // ループ終了
    }
  });
  return new Liability(amount_current_liability, amount_fixed_liability);
}

function netAssetBuilder(text) {
  const category_begin = "純資産の部";
  const category_end = "負債純資産合計";
  let amount_net_asset = 0;
  const category_data = text
    .slice(text.indexOf(category_begin) + category_begin.length)
    .trim();
  const rows = category_data.split("\n");
  rows.some(function (row_str) {
    let row = row_str.split(" ").filter((r) => r !== "");
    if (row.length == 3 && ["純資産合計", "資本合計"].includes(row[0])) {
      amount_net_asset = row[2];
    } else if (row.length == 3 && row[0] == category_end) {
      return true; // ループ終了
    }
  });
  return new NetAsset(amount_net_asset);
}

exports.readPDF = async function (filename) {
  return new Promise((resolve, reject) => {
    let balanceSheetObject;
    if (process.argv.length > 1) {
      var buf = fs.readFileSync(filename);
      pdf(buf, options)
        .then(function (data) {
          var text = data.text.trim();
          const company = companyInfoBuilder(text);
          const asset = assetBuilder(text);
          const liability = liabilityBuilder(text);
          const net_asset = netAssetBuilder(text);

          balanceSheetObject = {
            流動資産合計: asset.amount_current_asset,
            固定資産合計: asset.amount_fixed_asset,
            資産合計: asset.amount_all_asset,
            流動負債合計: liability.amount_current_liability,
            固定負債合計: liability.amount_fixed_liability,
            負債合計: liability.amount_all_liability,
            純資産合計: net_asset.amount_net_asset,
          };

          return resolve({
            company: company,
            balanceSheetObject: balanceSheetObject
          });
        })
        .catch(function (err) {
          console.log(err);
          return reject(err);
        });
    } else {
      console.log("Usage: $ node pdf.js sample.pdf ");
    }
  });
};
