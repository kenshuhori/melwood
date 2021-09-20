import Head from "next/head";
import { useState, useEffect } from "react";
import { useRef } from "react";
import styles from "src/styles/Home.module.scss";
import { PiChart } from "src/components/PiChart";
import { Header } from "src/components/Header";
import { ContentWrapper } from "src/components/ContentWrapper";
import { Link as Scroll } from 'react-scroll';
import ReactLoading from "react-loading";
import axios from "axios";

const Home = () => {
  const [file, setFile] = useState();
  const [nowAnalyzing, setNowAnalyzing] = useState();
  const [previewImage, setPreviewImage] = useState();
  const [irObj, setIrObj] = useState();
  const chartRef = useRef();
  const ocrTextRef = useRef();
  const Loading = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={100} width={200} />
  );
  const isFileSet = file ? true : false;

  const assetRatio = irObj && [
    ["Asset", "Amount per TotalAsset"],
    ["流動資産合計", irObj["流動資産合計"]],
    ["固定資産合計", irObj["固定資産合計"]],
  ];

  const liabilityRatio = irObj && [
    ["Liability", "Amount per TotalLiability"],
    ["流動負債合計", irObj["流動負債合計"]],
    ["固定負債合計", irObj["固定資産合計"]],
  ];

  const BsRatio = irObj && [
    ["Total", "Amount per BS"],
    ["負債合計", irObj["負債合計"]],
    ["純資産合計", irObj["純資産合計"]],
    ["資産合計", irObj["資産合計"]],
  ];

  const BsDetailRatio = irObj && [
    ["Total", "Amount per BS"],
    ["流動負債合計", irObj["流動負債合計"]],
    ["固定負債合計", irObj["固定負債合計"]],
    ["純資産合計", irObj["純資産合計"]],
    ["固定資産合計", irObj["固定資産合計"]],
    ["流動資産合計", irObj["流動資産合計"]],
  ];

  const postRequest = async () => {
    if (!isFileSet) return;
    setNowAnalyzing(true);
    const formData = new FormData();
    formData.append("myImage", file);

    axios({
      method: "POST",
      url: "http://localhost:4000",
      data: formData,
      config: {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    })
    .then((res) => {
      console.log("ファイル送信成功！！！");

      // 決算データのオブジェクトを受け取って、setStateする
      console.log(res.data);
      setNowAnalyzing(false);
      setIrObj(res.data);
    })
    .catch((err) => {
      setNowAnalyzing(false);
      console.log(err);
    });
  };

  const changeImage = (e) => {
    setFile(e.target.files[0]);
    setPreviewImage(window.URL.createObjectURL(e.target.files[0]));
    // 一度画像を選択した状態で、 「再度ファイルを選択する」をクリック→キャンセルするとエラーが起きる。
  };

  return (
    <>
      <Head>
        <title>Fundamentals Web App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className={styles.homeContainer}>
        <ContentWrapper>
          <Header />
          <h1 className={styles.title}>Fundamentals</h1>
          <p className={styles.description}>
            決算書のPDFファイルをアップロードするだけで、投資研究に必要なデータをご提供します。
          <br />
            何十ものウェブサイト、ニュースレター、雑誌を何時間もかけて読む必要はありません。
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
                name="myImage"
                id="fileButton"
                onChange={(e) => changeImage(e)}
              />
              <label className={styles.fileButtonLabel} htmlFor="fileButton">
                ファイルを選択する
              </label>
              {isFileSet ? (
                <Scroll
                  className={styles.analysisButton}
                  onClick={() => postRequest()}
                  disabled={!isFileSet}
                  to="irResult" smooth={true}
                >
                  画像解析
                </Scroll>
              ) : (
                <button
                  className={styles.analysisButton}
                  disabled={true}
                >
                  画像解析
                </button>
              )}
            </div>
          </main>
        </ContentWrapper>
      </section>

      <section id="irResult" className={styles.contentContainer}>
        {irObj && (
          <div>
            <ContentWrapper>
              {/* グラフの左端に合わせたい */}
              <h3 className={styles.content__title}>Analyzing</h3>
            </ContentWrapper>
            <div className={styles.graphs}>
              <div className={styles.graph}>
                {irObj && <PiChart title="資産の部" data={assetRatio} />}
              </div>
              <div className={styles.graph}>
                {irObj && <PiChart title="負債の部" data={liabilityRatio} />}
              </div>
              <div className={styles.graph}>
                {irObj && <PiChart title="貸借対照表" data={BsRatio} />}
              </div>
              <div className={styles.graph}>
                {irObj && (
                  <PiChart title="貸借対照表（詳細）" data={BsDetailRatio} />
                )}
              </div>
            </div>
          </div>
        )}
        {nowAnalyzing && (
          <div>
            <ContentWrapper>
              {/* グラフの左端に合わせたい */}
              <h3 className={styles.content__title}>Analyzing</h3>
            </ContentWrapper>
            <div className={styles.ocrResult}>
              <Loading type="bubbles" color="#888888" />
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default Home;
