import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

const WeekChart: React.FC<{ data: ApiDataPoint[] }> = ({ data }) => {

  const prepareChartData = (data: ApiDataPoint[]): ChartDataPoint[] => {
    const initialValue = data[0];
    const xMin = initialValue[0];

    // find the lowest value (the lowest price) in the dataset
    const yMin = data.reduce(
      (prev: ApiDataPoint, cur: ApiDataPoint) =>
        prev[1] < cur[1] ? prev : cur,
      initialValue
    )[1];

    return data.map((dataPoint) => ({
      xAxisValue: dataPoint[0] - xMin,
      value: dataPoint[1] - yMin,
    }));
  };

  if (!data) {
    return null;
    // return <div>loading...</div>;
  }

  // const chartData = prepareChartData(data);
  // const delta = chartData[chartData.length - 1].value - chartData[0].value;
  // const graphColor = delta >= 0 ? "#20F020" : "#F02020";

  return (
    <ResponsiveContainer width="100%" height="100%" debounce={1}>
      <LineChart data={prepareChartData(data)}>
        <XAxis
          xAxisId={0}
          type="number"
          dataKey="xAxisValue"
          domain={[0, 24 * 3600 * 7 * 1000]}
          hide={true}
        />
        <YAxis
          yAxisId={0}
          hide={true}
        />

        <Line
          type="monotone"
          dataKey="value"
          // stroke={graphColor}
          stroke="#F02020"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeekChart;
