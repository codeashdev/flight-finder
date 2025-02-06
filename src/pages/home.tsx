import { NavBar } from "@/components/NavBar";
import { SearchForm } from "@/components/SearchForm";
import { useTheme } from "@/context/ThemeContext";
import { searchFlights } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const Home = () => {
	const navigate = useNavigate();
	const [searchParams, setSearchParams] = useState<FlightSearchParams | null>(
		null,
	);

	const { data, isLoading } = useQuery({
		queryKey: ["flights", searchParams],
		queryFn: () => {
			if (!searchParams) throw new Error("Search parameters not set");
			return searchFlights(searchParams);
		},
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		enabled: !!searchParams,
		retry: 3,
		gcTime: 1000 * 60 * 5,
		staleTime: 1000 * 60 * 2,
	});
	// Navigate to the flights page with the search params
	useEffect(() => {
		if (data?.data) {
			// Check if itineraries exist and is an array with items
			if (
				!data.data.itineraries ||
				!Array.isArray(data.data.itineraries) ||
				data.data.itineraries.length === 0
			) {
				navigate("/flights", {
					state: {
						error: `No flights available for ${searchParams?.cabinClass?.replace("_", " ")} cabin class. Please try a different cabin class or date.`,
						searchParams,
						queryKey: ["flights", searchParams],
					},
				});
				return;
			}

			navigate("/flights", {
				state: {
					searchParams,
					queryKey: ["flights", searchParams],
					itineraries: data.data.itineraries.map((itinerary) => ({
						legIds: itinerary.legs.map((leg) => leg.id),
						price: {
							raw: itinerary.price.raw,
							formatted: itinerary.price.formatted,
						},
						farePolicy: itinerary.farePolicy,
						pricingOptions: itinerary.pricingOptions,
					})),
					legs: Object.fromEntries(
						data.data.itineraries.flatMap((itinerary) =>
							itinerary.legs.map((leg) => [leg.id, leg]),
						),
					),
				},
			});
		}
	}, [data, navigate, searchParams]);

	const handleSearch = (params: FlightSearchParams) => {
		setSearchParams(params);
	};

	const darkImage =
		"https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg";
	const lightImage =
		"https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg";
	const { theme } = useTheme();

	const getBackgroundImage = () => {
		if (theme === "dark") return darkImage;
		if (theme === "light") return lightImage;
		// For system theme, check system preference
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? darkImage
			: lightImage;
	};

	return (
		<div className="min-h-screen">
			<NavBar />
			<main className="container mx-auto pb-20 min-h-[850px]">
				<div
					className="h-[23vw] max-h-[300px] min-h-[140px] mx-auto bg-cover bg-no-repeat bg-center relative mb-8"
					style={{
						backgroundImage: `url(${getBackgroundImage()})`,
					}}
				>
					<h1 className="text-4xl sm:text-5xl text-center absolute bottom-0 left-1/2 -translate-x-1/2">
						Flights
					</h1>
				</div>
				<div className="relative z-10">
					<SearchForm onSubmit={handleSearch} isLoading={isLoading} />
				</div>
			</main>
		</div>
	);
};
export default Home;
