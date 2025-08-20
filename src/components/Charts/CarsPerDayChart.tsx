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

function CarsPerDayChart() {
	const { ref, inView } = useInView({ threshold: 0 });

	const { data, isLoading, isFetching, error } = useQuery<ActiveCarStat>({ 
		queryKey: ["activeCarStat"], 
		queryFn: fetchActiveCarStat, 
		enabled: inView, 							// 보일 때만 최초 fetch 
		refetchInterval: inView ? 15000 : false, 	// 보이는 동안만 폴링 
		placeholderData: (prev) => prev, 
	});

	const chartData: ChartData[] = useMemo(() => { 
		if (!data) return []; 
		return data.dayCount.slice(-7).map((d, idx) => ({ 
			name: d.day, 
			day: `${7 - idx}일 전`, 
			운행횟수: Number(d.totalCar), 
		})); 
	}, [data]);

	// [&_*:focus]: &(현재요소) _(아래) *(모든요소) :focus(focus될 때)
	return ( 
		<div ref={ref} className="w-full h-full [&_*:focus]:outline-none"> 
			{error && <div>에러: {(error as Error).message}</div>} 
			{!data && (isLoading || isFetching) && <div>로딩 중…</div>} 
			{chartData.length > 0 && ( 
				<ResponsiveContainer> 
					<LineChart data={chartData}> 
						<CartesianGrid strokeDasharray="3 3" /> 
						<XAxis dataKey="day" /> 
						<YAxis type="number" domain={[0, 600]} /> 
						<Tooltip /> 
						<Line type="monotone" dataKey="운행횟수" stroke="#8884d8" /> 
					</LineChart> 
				</ResponsiveContainer> )} 
		</div> 
	);
}

export default CarsPerDayChart