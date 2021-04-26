import { Chart } from "react-google-charts";

export const PiChart = (props) => {
  const title = props.title;
  const data = props.data;

  return (
    <Chart
      width={'330px'}
      height={'200px'}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={data}
      options={{
          title: title,
          // Just add this option
          is3D: true,
      }}
      rootProps={{ 'data-testid': '2' }}
    />
  );
};
