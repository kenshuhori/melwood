import Head from "next/head";
import { useState } from "react";
import { createWorker } from "tesseract.js";
import { Chart } from "react-google-charts";

const data = [
  { 売上高: [4502267, 4802062] },
  { 売上原価: [1766363, 1773675] },
  { 売上総利益: [2735903, 3028387] },
];

const GoogleChart = (props) => {
  const title = Object.keys(props.item)[0];

  console.log(props.item[title]);
  return (
    <Chart
      width={400}
      height={300}
      chartType="ColumnChart"
      loader={<div>グラフ描画中...</div>}
      data={[
        ["？？？", "前年度", "今年度"],
        ["", props.item[title][0], props.item[title][1]],
      ]}
      options={{
        title: title,
        chartArea: { width: "30%" },
        hAxis: {
          title: "",
          minValue: 0,
        },
        vAxis: {
          title: "",
        },
      }}
      legendToggle
    />
  );
};

const IndexPage = () => {
  const [file, setFile] = useState();
  const [ocrText, setOcrText] = useState();
  const [previewImage, setPreviewImage] = useState();

  const worker = createWorker({
    logger: (m) => console.log(m),
  });

  const getTextByOCR = async () => {
    await worker.load();
    await worker.loadLanguage("eng+jpn");
    await worker.initialize("eng+jpn");
    const {
      data: { text },
    } = await worker.recognize(file);
    await worker.terminate();
    setOcrText(text.replace(/\s+/g, ""));
    console.log(text);
  };

  const changeImage = (e) => {
    setFile(e.target.files[0]);
    setPreviewImage(window.URL.createObjectURL(e.target.files[0]));
  };

  const handleClick = async () => {
    if (!file) return;
    setOcrText("OCR解析中...");
    await getTextByOCR();
  };

  return (
    <div>
      <Head>
        <title>OCR Web App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to OCR Web App</h1>
      <main>
        {previewImage && (
          <img
            style={{ maxWidth: "500px", margin: "0 auto" }}
            src={previewImage}
          />
        )}
        <br />
        <input type="file" onChange={(e) => changeImage(e)} />
        <button onClick={() => handleClick()}>画像解析</button>
        <div>{ocrText}</div>
      </main>

      <h2>Graphs</h2>
      <div style={{ display: "flex", maxWidth: 900 }}>
        {data &&
          data.map((item, i) => {
            return <GoogleChart item={item} key={`google-chart-${i}`} />;
          })}
      </div>
    </div>
  );
};

export default IndexPage;
