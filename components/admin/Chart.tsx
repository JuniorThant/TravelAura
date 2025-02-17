'use client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

type ChartPropsType = {
  data: {
    date: string;
    total: number;
  }[];
  isMonthly: boolean;  // Pass isMonthly to determine which chart to render
};

function Chart({ data, isMonthly }: ChartPropsType) {
  return (
    <section className='mt-24'>
      <h1 className='text-4xl font-semibold text-center'>
        {isMonthly ? 'Monthly Bookings' : 'Daily Bookings'}
      </h1>
      <ResponsiveContainer width='100%' height={300}>
        {isMonthly ? (
          <BarChart data={data} margin={{ top: 50 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey='total' fill='#F97215' barSize={75} />
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ top: 50 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line dataKey='total' fill='#F97215' stroke="#82ca9d" />
          </LineChart>
        )}
      </ResponsiveContainer>
    </section>
  );
}

export default Chart;
