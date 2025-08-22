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
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { type TopActivatedCar, fetchTopActivatedCars } from '@/Api/Home/TopActivatedCars';
import { useMemo } from 'react';

function TopActivatedCarsChart() {

  const { ref, inView } = useInView({ threshold: 0 });

  const { data, isLoading, isFetching, error } = useQuery<TopActivatedCar[]>({
    queryKey: ["topActivatedCars"],
    queryFn: fetchTopActivatedCars,
    enabled: inView,
    staleTime: 15_000,
    refetchInterval: inView ? 15_000 : false,
    placeholderData: (prev) => prev
  })

  const maxCarNum = useMemo<number>(() => {
    if(!data) return 0;
    let maxNum = 0;
    data.forEach(car => {
      if(car.driveCount > maxNum) {
        maxNum = car.driveCount;
      }
    });
    if(maxNum % 4 === 0) {
      return maxNum;
    }
    else {
      maxNum += 4 - (maxNum % 4);
      return maxNum;
    }
  }, [data]);

  return (
    <div ref={ref} className="w-full h-full [&_*:focus]:outline-none">
      {error && <div>에러: {(error as Error).message}</div>}
      {!data && (isLoading || isFetching) && <div>로딩중...</div>}
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
            <XAxis dataKey="vehicleNumber" />
            <YAxis domain={[0, Math.max(12, maxCarNum)]}
              tickFormatter={(num) => (Number(num) === 0 ? "" : String(num))}
            />
            <Tooltip cursor={false} />
            <Legend />
            <Bar dataKey="driveCount" stackId="a" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
    </div>

  );
};

export default TopActivatedCarsChart;

// const data = [
//   {
//     vehicleNumber: '소나타',
//     driveCount: 2,
//   },
//   {
//     vehicleNumber: '롤스로이스',
//     driveCount: 5,
//   },
//   {
//     vehicleNumber: '아반테',
//     driveCount: 8,
//   },
// ];