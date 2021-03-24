import { Chart } from "react-google-charts";

export const ColumnChart = (props) => {
  const title = props.title;
  const data = props.data;

  return (
    <Chart
      maxWidth={400}
      maxHeight={300}
      chartType="ColumnChart"
      loader={<div>グラフ描画中...</div>}
      data={[
        [title, "前年度", "今年度"],
        ["", data[0], data[1]],
      ]}
      options={{
        title: title,
        chartArea: { width: "50%" },
        hAxis: {
          title: "",
          minValue: 0,
        },
        vAxis: {
          title: title,
          minValue: 0,
        },
        bar: { width: "30%" },
      }}
      legendToggle
    />
  );
};
