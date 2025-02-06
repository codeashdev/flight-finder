"use client";

import * as React from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/utils/format";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, isSameMonth } from "date-fns";

type ChartProps = {
	prices:
		| {
				day: string;
				group: "low" | "medium" | "high";
				price: number;
		  }[]
		| undefined;
};

export function PriceGraph({ prices }: ChartProps) {
	const [currentMonth, setCurrentMonth] = React.useState(() =>
		prices?.length ? new Date(prices[0].day) : new Date(),
	);

	const chartData = React.useMemo(() => {
		if (!prices) return [];

		// Filters data for current month
		return prices
			.filter((item) => isSameMonth(new Date(item.day), currentMonth))
			.map((item) => ({
				date: item.day,
				price: item.price,
				group: item.group,
			}));
	}, [prices, currentMonth]);

	// Gets available months from the data
	const availableMonths = React.useMemo(() => {
		if (!prices) return [];
		const months = new Set(
			prices.map((item) => format(new Date(item.day), "yyyy-MM")),
		);
		return Array.from(months).sort();
	}, [prices]);

	const currentMonthIndex = availableMonths.indexOf(
		format(currentMonth, "yyyy-MM"),
	);
	const hasNextMonth = currentMonthIndex < availableMonths.length - 1;
	const hasPrevMonth = currentMonthIndex > 0;

	const handleNextMonth = () => {
		if (hasNextMonth) {
			const nextMonth = new Date(availableMonths[currentMonthIndex + 1]);
			setCurrentMonth(nextMonth);
		}
	};

	const handlePrevMonth = () => {
		if (hasPrevMonth) {
			const prevMonth = new Date(availableMonths[currentMonthIndex - 1]);
			setCurrentMonth(prevMonth);
		}
	};

	const getBarColor = (group: "low" | "medium" | "high") => {
		switch (group) {
			case "low":
				return "#4caf50";
			case "medium":
				return "#ffc107";
			case "high":
				return "#ef5350";
			default:
				return "#4caf50";
		}
	};

	if (!prices?.length) {
		return null;
	}

	return (
		<Card className="bg-transparent border border-gray-200 dark:border-darkBorder">
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5">
					<div className="flex items-center justify-between">
						<CardTitle>Price Trends</CardTitle>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={handlePrevMonth}
								disabled={!hasPrevMonth}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="min-w-[120px] text-center">
								{format(currentMonth, "MMMM yyyy")}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={handleNextMonth}
								disabled={!hasNextMonth}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
					<CardDescription>
						Price variations for {format(currentMonth, "MMMM yyyy")}
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="px-2 sm:p-6">
				<div className="w-full h-[300px] min-w-[300px]">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={chartData}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid strokeDasharray={0} vertical={false} />
							<XAxis
								dataKey="date"
								tickFormatter={(value) => {
									const date = new Date(value);
									return date.toLocaleDateString("en-US", {
										month: "short",
										day: "numeric",
									});
								}}
							/>
							<YAxis
								tickFormatter={(value) => formatPrice(value, "USD")}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip
								formatter={(value: number) => formatPrice(value, "USD")}
								labelFormatter={(label: string) => {
									const date = new Date(label);
									return date.toLocaleDateString("en-US", {
										weekday: "short",
										month: "short",
										day: "numeric",
										year: "numeric",
									});
								}}
								labelStyle={{ color: "gray" }}
								itemStyle={{ color: "black" }}
							/>
							<Bar dataKey="price">
								{chartData.map((entry) => (
									<Cell
										key={`cell-${entry.date}`}
										fill={getBarColor(entry.group)}
									/>
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
