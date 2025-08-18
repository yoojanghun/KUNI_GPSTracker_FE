import { useState, useEffect, useRef } from "react";
import { prcInterval } from "precision-timeout-interval";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { type ActiveCarStat, fetchActiveCarStat } from "@/Api/Home/ActiveCarStat";

type ChartData = {
	name: string;
	운행횟수: number;
	day: string;
}

function CarsPerDayChart() {
	const [carsPerDay, setCarsPerDay] = useState<ActiveCarStat | null>(null);
	// carsPerDay = {dayCount: [{day: "2025-07-28", totalCar: 0}, {day: "2025-07-29", totalCar: 0},}
	const prevCarsPerDay = useRef<ActiveCarStat | null>(null);

	useEffect(() => {
		const getStat = () => {
			fetchActiveCarStat()
				.then((carsPerDay) => {
					if(JSON.stringify(prevCarsPerDay.current) !== JSON.stringify(carsPerDay)){
						prevCarsPerDay.current = carsPerDay;
						setCarsPerDay(carsPerDay);
					}
				})
				.catch((error) => console.error(error));
		}
		getStat();
		const intervalCtrl = prcInterval(15_000, getStat);

		return () => {
			intervalCtrl.cancel();
		}
	}, [])

	if(!carsPerDay) return;

	const data: ChartData[] = [
		{ name: "", 운행횟수: 1400, day: "7일전" },
		{ name: "", 운행횟수: 1200, day: "6일전" },
		{ name: "", 운행횟수: 1300, day: "5일전" },
		{ name: "", 운행횟수: 700, 	day: "4일전" },
		{ name: "", 운행횟수: 800, 	day: "3일전" },
		{ name: "", 운행횟수: 0, 		day: "2일전" },
		{ name: "", 운행횟수: 1000, day: "1일전" },
	];

	const dayObjArr = carsPerDay.dayCount;

	for(let i = 0; i < data.length; i++) {
		data[i].name = carsPerDay.dayCount[i].day;
		data[i].운행횟수 = Number(dayObjArr[i].totalCar);
	}

	return (
	<div className="w-[100%] h-[100%]">
		<ResponsiveContainer>
			<LineChart data={data}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="day"/>
			<YAxis type="number" domain={[0, 600]}/>
			<Tooltip />
			<Line type="monotone" dataKey="운행횟수" stroke="#8884d8" />
			</LineChart>
		</ResponsiveContainer>
	</div>
	);
}

export default CarsPerDayChart