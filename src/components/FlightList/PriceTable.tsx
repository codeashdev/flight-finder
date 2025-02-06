import * as React from "react";
import { format, addDays } from "date-fns";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/utils/format";
import { cn } from "@/lib/utils";

type PriceTableProps = {
	prices:
		| {
				day: string;
				group: "low" | "medium" | "high";
				price: number;
		  }[]
		| undefined;
	fromDate?: Date;
	toDate?: Date;
	onDateSelect?: (date: Date) => void;
};

const DAYS_PER_ROW = 7; // Number of days to show in each row
const NUMBER_OF_ROWS = 6; // Number of rows to show
const TOTAL_DAYS = DAYS_PER_ROW * NUMBER_OF_ROWS; // Total number of days visible

export function PriceTable({
	prices,
	fromDate,
	toDate,
	onDateSelect,
}: PriceTableProps) {
	const [startDate, setStartDate] = React.useState(() => new Date());
	const [hoveredCell, setHoveredCell] = React.useState<{
		row: number;
		col: number;
	} | null>(null);

	const allDays = React.useMemo(() => {
		const result = [];
		for (let i = 0; i < TOTAL_DAYS; i++) {
			result.push(addDays(startDate, i));
		}
		return result;
	}, [startDate]);

	const rows = React.useMemo(() => {
		const result = [];
		for (let i = 0; i < NUMBER_OF_ROWS; i++) {
			result.push(allDays.slice(i * DAYS_PER_ROW, (i + 1) * DAYS_PER_ROW));
		}
		return result;
	}, [allDays]);

	const priceMap = React.useMemo(() => {
		if (!prices) return new Map();
		return new Map(
			prices.map((price) => [
				format(new Date(price.day), "yyyy-MM-dd"),
				{
					price: price.price,
					group: price.group,
				},
			]),
		);
	}, [prices]);

	const handlePrevDays = () => {
		const newStartDate = addDays(startDate, -TOTAL_DAYS);
		// Only update if the new start date is not before today
		if (newStartDate >= new Date()) {
			setStartDate(newStartDate);
		}
	};

	const handleNextDays = () => {
		setStartDate((prev) => addDays(prev, TOTAL_DAYS));
	};

	const isColumnHighlighted = (rowIndex: number, colIndex: number) => {
		if (!hoveredCell) return false;
		return hoveredCell.col === colIndex && rowIndex <= hoveredCell.row;
	};

	const isRowHighlighted = (rowIndex: number, colIndex: number) => {
		if (!hoveredCell) return false;
		return hoveredCell.row === rowIndex && colIndex <= hoveredCell.col;
	};

	const isSelectedDate = (date: Date) => {
		if (!fromDate && !toDate) return false;
		const dateStr = format(date, "yyyy-MM-dd");
		const fromDateStr = fromDate ? format(fromDate, "yyyy-MM-dd") : null;
		const toDateStr = toDate ? format(toDate, "yyyy-MM-dd") : null;
		return dateStr === fromDateStr || dateStr === toDateStr;
	};

	const isCheapestForSelectedDate = (
		date: Date,
		price: number,
		rowDates: Date[],
	) => {
		if (!isSelectedDate(date) || !prices) return false;

		// Get all prices for this week
		const weekStart = format(rowDates[0], "yyyy-MM-dd");
		const weekEnd = format(rowDates[rowDates.length - 1], "yyyy-MM-dd");

		const weekPrices = prices.filter((p) => {
			const priceDate = format(new Date(p.day), "yyyy-MM-dd");
			return priceDate >= weekStart && priceDate <= weekEnd;
		});

		if (weekPrices.length === 0) return false;

		// Find the minimum price for the week
		const minPrice = Math.min(...weekPrices.map((p) => p.price));
		return price === minPrice;
	};

	const handleCellClick = (day: Date) => {
		if (onDateSelect) {
			onDateSelect(day);
		}
	};

	if (!prices?.length) {
		return null;
	}

	return (
		<Card className="bg-transparent border border-gray-300 dark:border-darkBorder">
			<CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
				<div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 ">
					<div className="flex items-center justify-between">
						<CardTitle>Price Grid</CardTitle>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="icon"
								onClick={handlePrevDays}
								disabled={startDate <= new Date()}
								data-testid="prev-button"
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="min-w-[120px] text-center">
								{format(startDate, "MMM d")} -{" "}
								{format(allDays[allDays.length - 1], "MMM d, yyyy")}
							</span>
							<Button
								variant="outline"
								size="icon"
								onClick={handleNextDays}
								data-testid="next-button"
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-0 ">
				<div className="overflow-x-auto">
					<Table>
						<TableHeader>
							<TableRow className="border border-gray-300 dark:border-darkBorder">
								<TableHead className="text-center min-w-[100px] font-bold">
									Date
								</TableHead>
								{rows[0].map((day, colIndex) => (
									<TableHead
										key={format(day, "yyyy-MM-dd")}
										className={cn(
											"text-center min-w-[100px] transition-colors",
											isSelectedDate(day) && "text-blue-500 font-bold",
											isColumnHighlighted(-1, colIndex) &&
												"bg-gray-100 dark:bg-gray-800",
										)}
									>
										<div className="flex flex-col items-center">
											<span>{format(day, "EEE")}</span>
											<span>{format(day, "MMM d")}</span>
										</div>
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody className="border border-gray-300 dark:border-darkBorder">
							{rows.map((weekDays, rowIndex) => (
								<TableRow
									key={format(weekDays[0], "yyyy-MM-dd")}
									className="border border-gray-300 dark:border-darkBorder"
								>
									<TableCell
										className={cn(
											"font-medium text-center transition-colors",
											isRowHighlighted(rowIndex, -1) &&
												"bg-gray-100 dark:bg-gray-800",
										)}
									>
										{format(weekDays[0], "MMM d")} -{" "}
										{format(weekDays[weekDays.length - 1], "MMM d")}
									</TableCell>
									{weekDays.map((day, colIndex) => {
										const dateStr = format(day, "yyyy-MM-dd");
										const priceData = priceMap.get(dateStr);
										return (
											<TableCell
												key={dateStr}
												className={cn(
													"text-center p-4 transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700",
													isSelectedDate(day) &&
														"bg-blue-50 dark:bg-blue-900/10",
													(isColumnHighlighted(rowIndex, colIndex) ||
														isRowHighlighted(rowIndex, colIndex)) &&
														"bg-gray-100 dark:bg-gray-800",
												)}
												onMouseEnter={() =>
													setHoveredCell({ row: rowIndex, col: colIndex })
												}
												onMouseLeave={() => setHoveredCell(null)}
												onClick={() => handleCellClick(day)}
											>
												{priceData && (
													<div
														className={cn(
															"font-medium",
															priceData.group === "low"
																? "text-green-500"
																: priceData.group === "medium"
																	? "text-yellow-500"
																	: "text-red-500",
															isCheapestForSelectedDate(
																day,
																priceData.price,
																weekDays,
															) && "ring-2 ring-blue-500 rounded-sm px-1",
														)}
													>
														{formatPrice(priceData.price, "USD")}
													</div>
												)}
											</TableCell>
										);
									})}
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
			</CardContent>
		</Card>
	);
}
