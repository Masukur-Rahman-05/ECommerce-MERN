import React, { useMemo } from 'react';
import { TrendingUp } from 'lucide-react';
import { PieChart, Pie, Label, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Chart = () => {
  const chartData = [
    { browser: "chrome", visitors: 275, fill: "#4285F4" },  // Chrome blue
    { browser: "safari", visitors: 200, fill: "#000000" },  // Safari black
    { browser: "firefox", visitors: 287, fill: "#FF9500" }, // Firefox orange
    { browser: "edge", visitors: 173, fill: "#0078D7" },    // Edge blue
    { browser: "other", visitors: 190, fill: "#808080" }    // Grey for others
  ];

  const totalVisitors = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, []);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black p-2 shadow-lg rounded-lg  text-white">
          <p className="capitalize font-medium ">{`${payload[0].payload.browser}`}</p>
          <p className="text-white">{`Visitors: ${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Browser Usage Statistics</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-0">
        <div className="mx-auto aspect-square max-h-64">
          <PieChart width={300} height={300}>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              strokeWidth={10}
            >
              <Label
                content={({ viewBox }) => (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-current text-2xl font-bold"
                    >
                      {totalVisitors.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy + 24}
                      className="fill-current text-sm"
                    >
                      Visitors
                    </tspan>
                  </text>
                )}
              />
            </Pie>
          </PieChart>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2 text-sm my-10">
        <div className="flex items-center gap-2 font-medium">
          <span>Trending up by 5.2% this month</span>
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-gray-500">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default Chart;