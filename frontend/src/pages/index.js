import Head from "next/head";
import { useState } from "react";
import styles from "src/styles/Home.module.scss";
import { createWorker } from "tesseract.js";
import { ColumnChart } from "src/components/ColumnChart";
import { ContentWrapper } from "src/components/ContentWrapper";
import testData from "src/utils/testData.json";

// メモ：PDFからデータを読み込むにあたって、下記の対応が必要
// 1. 「△」 を 「マイナス」に変換
// 2. 該当なしを表す「ー」を 「null」あるいは「0」に変換

const totalAssets = testData["資産の部"]["資産合計"];
const totalLiabilities = testData["負債の部"]["負債合計"];
const totalEquities = testData["純資産の部"]["純資産合計"];

const currentAssets = testData["資産の部"]["流動資産"]["流動資産合計"];
const currentLiabilities = testData["負債の部"]["流動負債"]["流動負債合計"];

const nonCurrentAssets = [
  totalAssets[0] - currentAssets[0],
  totalAssets[1] - currentAssets[1],
];
const nonCurrentLiabilities = [
  totalLiabilities[0] - currentLiabilities[0],
  totalLiabilities[1] - currentLiabilities[1],
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
        <h1 className={styles.title}>Welcome to OCR Web App</h1>
        <main>
          {previewImage && (
            <div className={styles.previewImage}>
              <img className={styles.previewImg} src={previewImage} />
            </div>
          )}
          <div className={styles.buttons__container}>
            <input
              className={styles.fileButton}
              type="file"
              id="fileButton"
              onChange={(e) => changeImage(e)}
            />
            <label className={styles.fileButtonLabel} htmlFor="fileButton">
              ファイルを選択する
            </label>
            <button
              className={styles.analysisButton}
              onClick={() => handleClick()}
            >
              画像解析
            </button>
          </div>
          <div>{ocrText}</div>
        </main>

        <h2>Graphs</h2>
        {/* <div style={{ display: "flex" }}>
          {data &&
            data.map((item, i) => {
              return <ColumnChart item={item} key={`column-chart-${i}`} />;
            })}
        </div> */}
      </ContentWrapper>
    </div>
  );
};

export default Home;
