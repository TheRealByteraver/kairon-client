import { ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

const WeekChart: React.FC<{
  data: { xAxisValue: number; yAxisValue: number }[];
}> = ({ data }) => {
  if (!data) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height="100%" debounce={1}>
      <LineChart data={data}>
        <XAxis xAxisId={0} type="number" dataKey="xAxisValue" hide={true} />
        <YAxis yAxisId={0} hide={true} />

        <Line
          type="monotone"
          dataKey="yAxisValue"
          stroke="#F02020"
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default WeekChart;
