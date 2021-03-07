import Head from "next/head";
import { useState } from "react";
import { createWorker } from "tesseract.js";
import { ColumnChart } from "src/components/ColumnChart";
import { ContentWrapper } from "src/components/ContentWrapper";

const data = [
  { 売上高: [4502267, 4802062] },
  { 売上原価: [1766363, 1773675] },
  { 売上総利益: [2735903, 3028387] },
];

const Home = () => {
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

      <ContentWrapper>
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
              return <ColumnChart item={item} key={`column-chart-${i}`} />;
            })}
        </div>
      </ContentWrapper>
    </div>
  );
};

export default Home;
