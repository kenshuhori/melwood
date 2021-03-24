//. pdf-sample.js
let fs = require("fs"),
  pdf = require("pdf-parse");
let Asset = require("./model/asset.js");
let Liability = require("./model/liability.js");
let NetAsset = require("./model/net_asset.js");

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
    } else if (row.length == 3 && row[0] == "固定資産合計") {
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
    } else if (row.length == 3 && row[0] == "固定負債合計") {
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
    if (row.length == 3 && row[0] == "純資産合計") {
      amount_net_asset = row[2];
    } else if (row.length == 3 && row[0] == category_end) {
      return true; // ループ終了
    }
  });
  return new NetAsset(amount_net_asset);
}

exports.getData = function () {
  let balanceSheetObject;
  if (process.argv.length > 1) {
    // var filename = process.argv[2];
    var filename = "pdf/nissan2.pdf";
    var buf = fs.readFileSync(filename);

    console.log("pdf");
    pdf(buf, options)
      .then(function (data) {
        var text = data.text.trim();
        const asset = assetBuilder(text);
        const liability = liabilityBuilder(text);
        const net_asset = netAssetBuilder(text);

        // console.log(`流動資産合計 : ${asset.amount_current_asset}`);
        // console.log(`固定資産合計 : ${asset.amount_fixed_asset}`);
        // console.log(`資産合計 : ${asset.amount_all_asset}`);
        // console.log(`流動負債合計 : ${liability.amount_current_liability}`);
        // console.log(`固定負債合計 : ${liability.amount_fixed_liability}`);
        // console.log(`負債合計 : ${liability.amount_all_liability}`);
        // console.log(`純資産合計 : ${net_asset.amount_net_asset}`);

        balanceSheetObject = {
          流動資産合計: asset.amount_current_asset,
          固定資産合計: asset.amount_fixed_asset,
          資産合計: asset.amount_all_asset,
          流動負債合計: liability.amount_current_liability,
          固定負債合計: liability.amount_fixed_liability,
          負債合計: liability.amount_all_liability,
          純資産合計: net_asset.amount_net_asset,
        };

        console.log(balanceSheetObject);
        return balanceSheetObject;
      })
      .catch(function (err) {
        console.log(err);
      });
  } else {
    console.log("Usage: $ node pdf-sample ");
  }
};
