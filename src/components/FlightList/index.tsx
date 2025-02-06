import { Accordion } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { FlightCard } from "./FlightCard";
import { LoadMoreButton } from "./LoadMoreButton";
import { Spinner } from "@/components/ui/Spinner";
import { FlightSortControls } from "./FlightSortControls";

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
	const [sortType, setSortType] = useState<SortType>("best");
	const [sortOption, setSortOption] = useState<SortOption>("top");
	const isRoundTrip = itineraries[0]?.legIds.length > 1;

	const cheapestPrice = itineraries.reduce(
		(min, itinerary) => (itinerary.price.raw < min.price.raw ? itinerary : min),
		itineraries[0],
	);

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
