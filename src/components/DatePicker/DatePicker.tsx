import * as React from "react";
import { format } from "date-fns";
import { Calendar, DateRange } from "react-date-range";
import type { Range, RangeKeyDict } from "react-date-range";
import {
	Calendar as CalendarIcon,
	ArrowRightLeft,
	MoveRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./date-range.css";

export function DatePickerWithRange({
	fromDate,
	toDate,
	showReturnDate = true,
	onSelect,
	tripType,
	onTripTypeChange,
	pageIndex,
}: DatePickerWithRangeProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const isBigScreen = useMediaQuery("(min-width: 1024px)");
	const isSmallScreen = useMediaQuery("(max-width: 1024px)");
	const isMobile = useMediaQuery("(max-width: 640px)");

	const [dateRange, setDateRange] = React.useState<Range>({
		startDate: fromDate || undefined,
		endDate: showReturnDate ? toDate || undefined : undefined,
		key: "selection",
	});

	const handleRangeSelect = (ranges: RangeKeyDict) => {
		const selection = ranges.selection;
		setDateRange(selection);
		onSelect(
			selection.startDate,
			showReturnDate ? selection.endDate : undefined,
		);
	};

	const handleSingleSelect = (date: Date) => {
		setDateRange({
			startDate: date,
			endDate: undefined,
			key: "selection",
		});
		onSelect(date, undefined);
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
	};

	const handleTriggerClick = () => {
		setIsOpen(true);
	};

	return (
		<div className="w-full">
			<Popover open={isOpen} onOpenChange={handleOpenChange}>
				<div
					className={cn(
						isMobile ? "gap-0" : "gap-2",
						"flex w-full",
						!showReturnDate && "hidden",
					)}
				>
					<PopoverTrigger asChild>
						<Button
							variant="datePicker"
							className={cn(
								!isMobile && "border-gray-300 border dark:border-none",
								"py-6",
								!dateRange.startDate && "text-muted-foreground",
							)}
							onClick={() => handleTriggerClick()}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{dateRange.startDate ? (
								format(dateRange.startDate, "LLL dd, y")
							) : (
								<span>Departure date</span>
							)}
						</Button>
					</PopoverTrigger>
					{isMobile && (
						<Separator
							orientation="vertical"
							className="h-[3.1rem] bg-gray-300 dark:bg-darkBorder"
						/>
					)}
					<PopoverTrigger asChild>
						<Button
							variant="datePicker"
							className={cn(
								!isMobile && "border-gray-300 border dark:border-none",
								"py-6",
								!dateRange.endDate && "text-muted-foreground",
							)}
							onClick={() => handleTriggerClick()}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{dateRange.endDate ? (
								format(dateRange.endDate, "LLL dd, y")
							) : (
								<span>Return date</span>
							)}
						</Button>
					</PopoverTrigger>
				</div>

				{/* Single button for one-way trips */}
				{!showReturnDate && (
					<PopoverTrigger asChild>
						<Button
							variant="datePicker"
							className={cn(
								!isMobile && "border-gray-300 border dark:border-none",
								"py-6",
								!dateRange.startDate && "text-muted-foreground",
							)}
							onClick={() => handleTriggerClick()}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{dateRange.startDate ? (
								format(dateRange.startDate, "LLL dd, y")
							) : (
								<span>Select date</span>
							)}
						</Button>
					</PopoverTrigger>
				)}

				<PopoverContent
					className={cn(
						"w-auto mx-auto p-0",
						pageIndex === "flightlist" && {
							[isBigScreen ? "absolute -bottom-170 right-10" : ""]: true,
							[isSmallScreen && tripType === "round-trip"
								? "absolute -bottom-150 right-20"
								: ""]: true,
							[isSmallScreen && tripType === "one-way"
								? "absolute -bottom-170 right-20"
								: ""]: true,
							[isMobile && tripType === "round-trip"
								? "absolute -bottom-140 -right-40"
								: ""]: true,
							[isMobile && tripType === "one-way"
								? "absolute -bottom-130 -right-80"
								: ""]: true,
						},
						pageIndex === "flightsearch" && {
							[isBigScreen ? "absolute -bottom-80 right-10" : ""]: true,
							[isSmallScreen && tripType === "round-trip"
								? "absolute -bottom-70 right-20"
								: ""]: true,
							[isSmallScreen && tripType === "one-way"
								? "absolute -bottom-70 -right-20"
								: ""]: true,
							[isMobile && tripType === "round-trip"
								? "absolute -bottom-60 -right-40"
								: ""]: true,
							[isMobile && tripType === "one-way"
								? "absolute -bottom-60 -right-80"
								: ""]: true,
						},
					)}
					align="start"
				>
					<div className="flex items-center bg-card justify-between p-3 border-b">
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									"rounded-full px-3 py-1 text-sm",
									tripType === "round-trip" &&
										"bg-primary text-primary-foreground",
								)}
								onClick={() => onTripTypeChange("round-trip")}
							>
								<ArrowRightLeft size={16} className="mr-2" />
								Round trip
							</Button>
							<Button
								variant="ghost"
								size="sm"
								className={cn(
									"rounded-full px-3 py-1 text-sm",
									tripType === "one-way" &&
										"bg-primary text-primary-foreground",
								)}
								onClick={() => onTripTypeChange("one-way")}
							>
								<MoveRight size={16} className="mr-2" />
								One way
							</Button>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="text-gray-600 dark:text-gray-300"
							onClick={() => {
								setDateRange({
									startDate: undefined,
									endDate: undefined,
									key: "selection",
								});
								onSelect(undefined, undefined);
							}}
						>
							Reset
						</Button>
					</div>
					{showReturnDate ? (
						<>
							<DateRange
								ranges={[dateRange]}
								onChange={handleRangeSelect}
								months={isSmallScreen ? 1 : 2}
								direction={isSmallScreen ? "vertical" : "horizontal"}
								minDate={new Date()}
								showMonthAndYearPickers={false}
								weekdayDisplayFormat="EEEEE"
								monthDisplayFormat="MMM yyyy"
								color="#0ea5e9"
								startDatePlaceholder="Departure"
								endDatePlaceholder="Return"
							/>
						</>
					) : (
						<>
							<Calendar
								date={dateRange.startDate}
								onChange={handleSingleSelect}
								minDate={new Date()}
								months={isSmallScreen ? 1 : 2}
								direction={isSmallScreen ? "vertical" : "horizontal"}
								showMonthAndYearPickers={false}
								weekdayDisplayFormat="EEEEE"
								monthDisplayFormat="MMM yyyy"
								color="#0ea5e9"
								showDateDisplay={false}
							/>
						</>
					)}
					<div className="flex items-center bg-card justify-between p-3 border-t">
						<p className="text-sm text-gray-500">
							Prices shown on the calendar are based on single-person rates from
							the API
						</p>
						<Button
							variant="ghost"
							size="sm"
							className="rounded-full px-6 py-1 text-sm bg-primary text-primary-foreground hover:bg-primary/90 hover:text-white hover:dark:text-black hover:dark:bg-primary/90"
							onClick={() => setIsOpen(false)}
						>
							Done
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
