import { useLocation, useNavigate } from "react-router";

import { NavBar } from "@/components/NavBar";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchFlights } from "@/services/api";
import { Spinner } from "@/components/ui/Spinner";
import { FlightList } from "@/components/FlightList";

const FlightListPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const currentSearchParams = location.state?.searchParams || null;
	const { error: navigationError } = location.state || {};

	// Update URL state when search params change
	useEffect(() => {
		if (currentSearchParams) {
			navigate("/flights", {
				state: {
					searchParams: currentSearchParams,
				},
				replace: true,
			});
		}
	}, [currentSearchParams, navigate]);

	const { data, isLoading, error } = useQuery({
		queryKey: ["flights", currentSearchParams],
		queryFn: async () => {
			if (!currentSearchParams) throw new Error("Search parameters not set");
			const response = await searchFlights(currentSearchParams);
			return response;
		},
		enabled: !!currentSearchParams,
		gcTime: 30 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});

	if (!currentSearchParams) {
		return (
			<>
				<NavBar />
				<div className="container mx-auto px-4 py-8">
					<div className="text-white text-center">
						No search parameters found. Please start a new search.
					</div>
				</div>
			</>
		);
	}

	if (navigationError) {
		return (
			<>
				<NavBar />
				<div className="container mx-auto px-4 py-8">
					<div className="p-4 bg-red-100 text-red-700 rounded-lg mt-4">
						{navigationError}
					</div>
					<div className="flex justify-center">
						<button
							type="button"
							onClick={() => window.history.back()}
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
						>
							Go Back
						</button>
					</div>
				</div>
			</>
		);
	}
	return (
		<>
			<NavBar />
			<div className="container mx-auto px-4 py-8">
				{isLoading ? (
					<div className="text-white text-center flex flex-row items-center gap-2 justify-center">
						<Spinner />
						Searching for flights...
					</div>
				) : error ? (
					<div className="p-4 bg-red-100 text-red-700 rounded-lg mt-4">
						{error instanceof Error ? error.message : "An error occurred"}
					</div>
				) : !data?.data?.itineraries?.length ? (
					<div className="text-white text-center">No flights found</div>
				) : (
					<FlightList
						itineraries={data.data.itineraries.map((itinerary) => ({
							legIds: itinerary.legs.map((leg) => leg.id),
							price: {
								raw: itinerary.price.raw,
								formatted: itinerary.price.formatted,
							},
							farePolicy: itinerary.farePolicy,
							pricingOptions: itinerary.pricingOptions,
						}))}
						legs={Object.fromEntries(
							data.data.itineraries.flatMap((itinerary) =>
								itinerary.legs.map((leg) => [leg.id, leg]),
							),
						)}
						cabinClass={currentSearchParams.cabinClass || "economy"}
					/>
				)}
			</div>
		</>
	);
};
export default FlightListPage;
