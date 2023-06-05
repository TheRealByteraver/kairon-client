import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

const WeekChart: React.FC<{ data: {xAxisValue: number, yAxisValue: number}[] }> = ({ data }) => {

  // const chartData = prepareChartData(data);
  // const delta = chartData[chartData.length - 1].value - chartData[0].value;
  // const graphColor = delta >= 0 ? "#20F020" : "#F02020";

  if (!data) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%" debounce={1}>
      <LineChart data={data}>
        <XAxis
          xAxisId={0}
          type="number"
          dataKey="xAxisValue"
          // domain={[0, 24 * 3600 * 7 * 1000]}
          hide={true}
        />
        <YAxis yAxisId={0} hide={true} />

        <Line
          type="monotone"
          dataKey="yAxisValue"
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
