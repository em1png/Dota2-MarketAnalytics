import { BarChart as BarChartOrigin, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const currentDate = new Date();

const getWeek = (weekIndex: number) => {
  const newDate = new Date(currentDate.getTime() - ((weekIndex) * 7 * 24 * 60 * 60 * 1000));
  return newDate;
}

const getDate = (label: number) => {
  const newDate = new Date();
  newDate.setDate(currentDate.getDate() - label);
  return `${newDate.getDate()}.${newDate.getMonth() + 1}.${newDate.getFullYear()}`
}

const CustomTooltip = ({ active, payload, label, isPeriodByDays }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white text-black text-sm rounded-lg p-3">
        <p className="label">{
          isPeriodByDays ? getDate(label) : getWeek(label).toLocaleString().split(',')[0]}
        </p>
        <p className='font-semibold text-base'>· {Math.round(payload[0].value)}</p>
      </div>
    );
  }
}

type BarChartPropsType = {
  data: [Date | null, number, number][] | number[];
  color: string;
  arrayIndex: number;
  isPeriodByDays: boolean;
}
const BarChart: React.FC<BarChartPropsType> = ({ data, color, arrayIndex, isPeriodByDays = true }) => {
  return (
    <div className='pt-5'>
      <BarChartOrigin width={window.innerWidth * 0.9} height={300} data={data}>
        <YAxis stroke="#b4b4b4" />
        <XAxis stroke="#b4b4b4" />
        <Tooltip content={<CustomTooltip isPeriodByDays={isPeriodByDays} />} trigger='click' />
        <CartesianGrid strokeDasharray="3 3" stroke='#555555' />
        <Bar dataKey={v => arrayIndex ? v[arrayIndex]: v} fill={color} barSize={50} />
      </BarChartOrigin>
    </div>
  )
}

export default BarChart