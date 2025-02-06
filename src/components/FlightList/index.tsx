import { Accordion } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { FlightCard } from "./FlightCard";
import { LoadMoreButton } from "./LoadMoreButton";
import { Spinner } from "@/components/ui/Spinner";

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

	return (
		<div className="space-y-6 max-w-4xl mx-auto">
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
						{itineraries.map((itinerary, index) => {
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
