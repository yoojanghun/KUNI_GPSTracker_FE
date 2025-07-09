import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { name: 0, 운행횟수: 1400 },
    { name: 1, 운행횟수: 1200 },
    { name: 2, 운행횟수: 1300 },
    { name: 3, 운행횟수: 700 },
    { name: 4, 운행횟수: 800 },
    { name: 5, 운행횟수: 0 },
    { name: 6, 운행횟수: 1000 },
];

export default function SimpleLineChart() {
    return (
    <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
            <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[0, 1600]}/>
            <Tooltip />
            <Line type="monotone" dataKey="운행횟수" stroke="#8884d8" />
        </LineChart>
        </ResponsiveContainer>
    </div>
    );
}