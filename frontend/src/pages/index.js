import Head from "next/head";
import { useState } from "react";
import { useRef } from "react";
import styles from "src/styles/Home.module.scss";
import { createWorker } from "tesseract.js";
import { ColumnChart } from "src/components/ColumnChart";
import { Header } from "src/components/Header";
import {
  ContentWrapper,
  WideContentWrapper,
} from "src/components/ContentWrapper";
import testData from "src/utils/testData.json";
import ReactLoading from "react-loading";

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

  const ocrTextRef = useRef();
  const Loading = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={100} width={200} />
  );

  const isFileSet = file ? true : false;

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
    // 一度画像を選択した状態で、 「再度ファイルを選択する」をクリック→キャンセルするとエラーが起きる。
  };

  const handleClick = async () => {
    if (!file) return;
    setOcrText("OCR解析中...");
    ocrTextRef.current.scrollIntoView({ behavior: "smooth" });
    await getTextByOCR();
  };

  return (
    <>
      <Head>
        <title>OCR Web App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={styles.homeContainer}>
        <ContentWrapper>
          <Header />
          <h1 className={styles.title}>Fundamentals</h1>
          <p className={styles.description}>
            決算書のPDFファイルをアップロードするだけで、1つのウィンドウで投資研究に必要なデータをご提供します。何十ものウェブサイト、ニュースレター、雑誌を何時間もかけて読む必要はありません。
          </p>

          <main>
            {previewImage ? (
              <div className={styles.previewImage}>
                <img className={styles.previewImg} src={previewImage} />
              </div>
            ) : (
              <div className={styles.conceptImage}>
                <img className={styles.conceptImg} src="concept-image.svg" />
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
                disabled={!isFileSet}
              >
                画像解析
              </button>
            </div>
            <div className={styles.ocrResult} ref={ocrTextRef}>
              {ocrText}
              {ocrText == "OCR解析中..." ? (
                <Loading type="bubbles" color="#888888" />
              ) : (
                <div></div>
              )}
            </div>
          </main>
        </ContentWrapper>
      </section>

      <section className={styles.contentContainer}>
        <ContentWrapper>
          {/* グラフの左端に合わせたい */}
          <h3 className={styles.content__title}>Analyzing</h3>
        </ContentWrapper>
        <WideContentWrapper>
          {/* グラフで必要なデータを props に渡す。component で切り出して map で展開する。  */}
          <div className={styles.graphs}>
            <div className={styles.graph}>
              <img
                src="/dummy/graph1.png"
                alt="グラフに差し替える（現在はダミー画像）"
              />
            </div>
            <div className={styles.graph}>
              <img
                src="/dummy/graph2.png"
                alt="グラフに差し替える（現在はダミー画像）"
              />
            </div>
            <div className={styles.graph}>
              <img
                src="/dummy/graph3.png"
                alt="グラフに差し替える（現在はダミー画像）"
              />
            </div>
            <div className={styles.graph}>
              <img
                src="/dummy/graph4.png"
                alt="グラフに差し替える（現在はダミー画像）"
              />
            </div>
            <div className={styles.graph}>
              <img
                src="/dummy/graph5.png"
                alt="グラフに差し替える（現在はダミー画像）"
              />
            </div>
            <div className={styles.graph}>
              <img
                src="/dummy/graph6.png"
                alt="グラフに差し替える（現在はダミー画像）"
              />
            </div>
          </div>
        </WideContentWrapper>
      </section>
    </>
  );
};

export default Home;
