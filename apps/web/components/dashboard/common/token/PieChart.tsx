import { CovalentItem } from '@lib/types/interfaces';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

type PieChartCompProps = {
  tokenList: CovalentItem[];
};

function formatData(tokenList: CovalentItem[]) {
  const data: {}[] = [];

  tokenList.forEach(
    (token) =>
      token.quote > 0.1 &&
      data.push({
        name: token.contract_name,
        value: Math.floor(Number(token.quote) * 100) / 100,
      }),
  );

  return data;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

function PieChartComp({ tokenList }: PieChartCompProps) {
  const chartData = formatData(tokenList);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart width={600} height={600}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          isAnimationActive={false}
          fill="#8884d8"
          dataKey="value"
          innerRadius="50%"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default PieChartComp;
