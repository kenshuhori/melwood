import { Chart } from "react-google-charts";

export const ColumnChart = (props) => {
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
