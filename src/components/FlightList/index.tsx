import { format } from "date-fns";

import { Accordion } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { FlightCard } from "./FlightCard";
import { LoadMoreButton } from "./LoadMoreButton";
import { Spinner } from "@/components/ui/Spinner";
import { FlightSortControls } from "./FlightSortControls";
import { usePriceCalendar } from "@/hooks/usePriceCalendar";
import { ChartColumn, Table2, X } from "lucide-react";
import { PriceTable } from "./PriceTable";
import { PriceGraph } from "./PriceGraph";

export const FlightList = ({
	itineraries,
	legs,
	cabinClass,
}: FlightListProps & { cabinClass: string }) => {
	const [selectedOutboundLegId, setSelectedOutboundLegId] = useState<
		string | null
	>(null);
	const [openItem, setOpenItem] = useState<string | undefined>();
	const [isLoading, setIsLoading] = useState(false);
	const [displayCount, setDisplayCount] = useState(10);
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [showChart, setShowChart] = useState(false);
	const [showTable, setShowTable] = useState(false);
	const [sortType, setSortType] = useState<SortType>("best");
	const [sortOption, setSortOption] = useState<SortOption>("top");
	const isRoundTrip = itineraries[0]?.legIds.length > 1;

	const cheapestPrice = itineraries.reduce(
		(min, itinerary) => (itinerary.price.raw < min.price.raw ? itinerary : min),
		itineraries[0],
	);

	// Get the first flight's date and airports for price calendar
	const firstFlight = itineraries[0]?.legIds[0]
		? legs[itineraries[0].legIds[0]]
		: null;

	const { data: priceData } = usePriceCalendar({
		originSkyId: firstFlight?.origin.displayCode,
		destinationSkyId: firstFlight?.destination.displayCode,
		fromDate: firstFlight ? new Date(firstFlight.departure) : undefined,
		page: "flightList",
	});

	// Handles the browser's back button functionality and updates the browser history based on the selectedOutboundLegId
	useEffect(() => {
		if (selectedOutboundLegId) {
			window.history.pushState({ selectedOutboundLegId }, "");
		}

		const handlePopState = (event: PopStateEvent) => {
			if (!event.state?.selectedOutboundLegId) {
				setSelectedOutboundLegId(null);
				setOpenItem(undefined);
			}
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [selectedOutboundLegId]);

	if (!itineraries?.length) {
		return null;
	}

	const handleDateSelect = (date: Date) => {
		setShowTable(false);

		// Sort itineraries to bring flights matching the selected date to the top
		const selectedDateStr = format(date, "yyyy-MM-dd");
		const sortedByDate = [...itineraries].sort((a, b) => {
			const legA = legs[a.legIds[0]];
			const legB = legs[b.legIds[0]];
			const dateA = format(new Date(legA.departure), "yyyy-MM-dd");
			const dateB = format(new Date(legB.departure), "yyyy-MM-dd");

			// If date matches exactly, put it at the top
			if (dateA === selectedDateStr && dateB !== selectedDateStr) return -1;
			if (dateB === selectedDateStr && dateA !== selectedDateStr) return 1;

			// Otherwise sort by proximity to selected date
			const diffA = Math.abs(new Date(dateA).getTime() - date.getTime());
			const diffB = Math.abs(new Date(dateB).getTime() - date.getTime());
			return diffA - diffB;
		});

		// Update the itineraries list with the sorted results
		itineraries.splice(0, itineraries.length, ...sortedByDate);

		// Reset the display count to show the top results
		setDisplayCount(10);
	};

	const handleSelectFlight = async (legId: string) => {
		setIsLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 300));
		setSelectedOutboundLegId(legId);
		setIsLoading(false);
		setOpenItem(undefined);
	};

	const handleLoadMore = async () => {
		setIsLoadingMore(true);
		await new Promise((resolve) => setTimeout(resolve, 500));

		if (displayCount >= itineraries.length) {
			// If we're showing all flights, go back to showing first 10
			setDisplayCount(10);
		} else {
			// Show 10 more flights
			setDisplayCount((prev) => Math.min(prev + 10, itineraries.length));
		}
		setIsLoadingMore(false);
	};
	const getHeadingText = () => {
		const prefix =
			(sortType === "best" && sortOption === "top") ||
			(sortType === "cheapest" && sortOption === "top")
				? "Top"
				: "All";
		if (!isRoundTrip) {
			return `${prefix} flights`;
		}

		return !selectedOutboundLegId
			? `${prefix} departing flights`
			: `${prefix} Return flights`;
	};

	const sortedItineraries = [...itineraries]
		.slice(0, displayCount)
		.sort((a, b) => {
			const legA = legs[a.legIds[0]];
			const legB = legs[b.legIds[0]];

			switch (sortOption) {
				case "price":
					return a.price.raw - b.price.raw;
				case "departure":
					return (
						new Date(legA.departure).getTime() -
						new Date(legB.departure).getTime()
					);
				case "arrival":
					return (
						new Date(legA.arrival).getTime() - new Date(legB.arrival).getTime()
					);
				case "duration":
					return legA.durationInMinutes - legB.durationInMinutes;
				default:
					if (sortType === "cheapest") {
						return a.price.raw - b.price.raw;
					}
					return 0;
			}
		});

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
			<div className="flex sm:justify-end justify-center mb-4 gap-2">
				{!showChart && (
					<button
						type="button"
						onClick={() => setShowTable(!showTable)}
						className="text-sm px-4 py-2 rounded-md bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
					>
						{showTable ? (
							<div className="flex items-center">
								<X className="inline-block mr-2" /> Price Grid
							</div>
						) : (
							<div className="flex items-center">
								<Table2 className="inline-block mr-2" /> Price Grid
							</div>
						)}
					</button>
				)}
				{!showTable && (
					<button
						type="button"
						onClick={() => setShowChart(!showChart)}
						className="text-sm px-4 py-2 rounded-md bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
					>
						{showChart ? (
							<div className="flex items-center">
								<X className="inline-block mr-2" /> Price Graph
							</div>
						) : (
							<div className="flex items-center">
								<ChartColumn className="inline-block mr-2" /> Price Graph
							</div>
						)}
					</button>
				)}
			</div>
			{showTable && (
				<PriceTable
					prices={priceData?.data.flights.days}
					fromDate={firstFlight ? new Date(firstFlight.departure) : undefined}
					toDate={
						firstFlight?.arrival ? new Date(firstFlight.arrival) : undefined
					}
					onDateSelect={handleDateSelect}
				/>
			)}
			{showChart && <PriceGraph prices={priceData?.data.flights.days} />}
			<FlightSortControls
				sortType={sortType}
				setSortType={setSortType}
				sortOption={sortOption}
				setSortOption={setSortOption}
				cheapestPrice={cheapestPrice}
				heading={getHeadingText()}
			/>
			{isLoading ? (
				<div className="flex items-center justify-center py-12">
					<div className="flex items-center gap-3">
						<Spinner />
						<div className="text-white">Loading return flights...</div>
					</div>
				</div>
			) : (
				<>
					<Accordion
						type="single"
						collapsible
						className="mt-6 border border-gray-300 dark:border-darkBorder rounded-sm"
						value={openItem}
						onValueChange={setOpenItem}
					>
						{sortedItineraries.map((itinerary, index) => {
							const isRoundTrip = itinerary.legIds.length > 1;
							const showingReturnFlight = selectedOutboundLegId !== null;
							const leg =
								legs[
									showingReturnFlight && isRoundTrip
										? itinerary.legIds[1]
										: itinerary.legIds[0]
								];
							const itemValue = `${itinerary.legIds.join("-")}-${leg.departure}-${leg.arrival}-${itinerary.price.raw}-${index}`;
							const isOpen = openItem === itemValue;

							return (
								<FlightCard
									key={itemValue}
									leg={leg}
									itinerary={itinerary}
									isRoundTrip={isRoundTrip}
									showingReturnFlight={showingReturnFlight}
									isOpen={isOpen}
									itemValue={itemValue}
									onSelectFlight={handleSelectFlight}
									cabinClass={cabinClass}
								/>
							);
						})}
					</Accordion>

					<LoadMoreButton
						isLoading={isLoadingMore}
						displayCount={displayCount}
						maxCount={itineraries.length}
						onLoadMore={handleLoadMore}
					/>
				</>
			)}
		</div>
	);
};
