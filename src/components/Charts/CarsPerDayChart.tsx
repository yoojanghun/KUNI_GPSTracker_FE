import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { 
	type ActiveCarStat, 
	fetchActiveCarStat 
} from "@/Api/Home/ActiveCarStat";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

type ChartData = {
	name: string;
	운행횟수: number;
	day: string;
}
// data 변경 → (react-query가 상태 갱신) → 리렌더 발생 
// → 그 렌더에서 useMemo가 maxNum을 재계산 → 변경된 domain으로 차트가 갱신
function CarsPerDayChart() {
	const { ref, inView } = useInView({ threshold: 0 });

	const { data, isLoading, isFetching, error } = useQuery<ActiveCarStat>({ 
		queryKey: ["activeCarStat"], 
		queryFn: fetchActiveCarStat, 
		enabled: inView, 							// 보일 때만 최초 fetch 
		staleTime: 15_000,
		refetchInterval: inView ? 15_000 : false, 	// 보이는 동안만 폴링 
		placeholderData: (prev) => prev, 
	});

	// 컴포넌트가 리렌더링 될 때, useMemo에서
	// 의존성 배열 동일 => 이전에 계산 값을 재사용(계산 스킵)
	// 의존성 배열 다름 => 함수를 실행하여 다시 계산
	const carsPerDay = useMemo<ChartData[]>(() => { 
		if (!data) return []; 
		return data.dayCount.slice(-7).map((d, idx) => ({ 
			name: d.day, 
			day: `${7 - idx}일전`, 
			운행횟수: Number(d.totalCar), 
		})); 
	}, [data]);

	const maxCarNum = useMemo<number>(() => {
		if(!data) return 0;
		let maxNum = 0;
		data.dayCount.slice(-7).forEach(d => {
			if(Number(d.totalCar) > maxNum) {
				maxNum = Number(d.totalCar);
			} 
		})
		if(maxNum % 4 === 0) {
			return maxNum;
		}
		else {
			maxNum += 4 - (maxNum % 4);
			return maxNum;
		}
	}, [data])

	// [&_*:focus]: &(현재요소) _(아래) *(모든요소) :focus(focus될 때) 를 의마한다.
	return ( 
		<div ref={ref} className="w-full h-full [&_*:focus]:outline-none"> 
			{error && <div>에러: {(error as Error).message}</div>} 
			{!data && (isLoading || isFetching) && <div>로딩중...</div>} 
			{carsPerDay.length > 0 && ( 
				<ResponsiveContainer> 
					<LineChart data={carsPerDay}> 
						<CartesianGrid strokeDasharray="3 3" /> 
						<XAxis dataKey="day" /> 
						<YAxis type="number" 
							domain={[0, Math.max(12, maxCarNum)]} 
							tickFormatter={(num) => (Number(num) === 0 ? "" : String(num))}
						/> 
						<Tooltip /> 
						<Line type="monotone" dataKey="운행횟수" stroke="#8884d8" /> 
					</LineChart> 
				</ResponsiveContainer> )} 
		</div> 
	);
}

export default CarsPerDayChart

