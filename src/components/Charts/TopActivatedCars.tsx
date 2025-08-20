import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const data = [
  {
    name: '소나타',
    운행횟수: 2,
  },
  {
    name: '롤스로이스',
    운행횟수: 5,
  },
  {
    name: '아반테',
    운행횟수: 8,
  },
];

const TopActivatedCars = () => {
  return (
    <div className="w-full h-full [&_*:focus]:outline-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis domain={[0, 12]}/>
          <Tooltip cursor={false} />
          <Legend />
          <Bar dataKey="운행횟수" stackId="a" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>

  );
};

export default TopActivatedCars;
