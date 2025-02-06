import axios from "axios";
import { addMonths, format } from "date-fns";

const API_BASE_URL = "https://sky-scrapper.p.rapidapi.com/api";
const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

const apiClient = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"x-rapidapi-key": API_KEY,
		"x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
	},
});

export const searchAirports = async (query: string): Promise<Airport[]> => {
	if (query.length < 2) return [];

	try {
		const response = await apiClient.get("/v1/flights/searchAirport", {
			params: {
				query,
				locale: "en-US",
			},
		});

		if (response.data?.status && response.data?.data) {
			if (Array.isArray(response.data.data)) {
				return response.data.data;
			}
			if (typeof response.data.data === "object") {
				return [response.data.data];
			}
		}

		return [];
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Airport search axios error:", {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
				config: {
					url: error.config?.url,
					params: error.config?.params,
					headers: error.config?.headers,
				},
			});
		} else {
			console.error("Airport search error:", error);
		}
		return [];
	}
};

export const getPriceCalendar = async (params: {
	originSkyId: string;
	destinationSkyId: string;
	fromDate: Date;
	currency?: string;
}): Promise<PriceCalendarResponse> => {
	const { originSkyId, destinationSkyId, fromDate, currency = "USD" } = params;

	const requestParams = {
		originSkyId,
		destinationSkyId,
		fromDate: format(fromDate, "yyyy-MM-dd"),
		toDate: format(addMonths(fromDate, 6), "yyyy-MM-dd"),
		currency,
	};

	try {
		const response = await apiClient.get<PriceCalendarResponse>(
			"/v1/flights/getPriceCalendar",
			{
				params: requestParams,
			},
		);

		if (!response.data.status) {
			throw new Error("Failed to fetch price calendar");
		}
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Price calendar fetch error:", {
				message: error.message,
				status: error.response?.status,
				data: error.response?.data,
				config: {
					url: error.config?.url,
					params: error.config?.params,
				},
			});
		} else {
			console.error("Price calendar error:", error);
		}
		throw error;
	}
};

export const searchFlights = async (
	params: FlightSearchParams,
): Promise<FlightResponse> => {
	const searchParams: Record<string, string | undefined> = {
		originSkyId: params.originSkyId,
		destinationSkyId: params.destinationSkyId,
		originEntityId: params.originEntityId,
		destinationEntityId: params.destinationEntityId,
		date: params.date,
		returnDate: params.returnDate,
		cabinClass: params.cabinClass || "economy",
		adults: params.adults?.toString() || "1",
		childrens: params.childrens?.toString(),
		infants:
			params.infantsInSeat || params.infantsOnLap
				? ((params.infantsInSeat || 0) + (params.infantsOnLap || 0)).toString()
				: undefined,
		sortBy: params.sortBy || "best",
		limit: "2",
		carriersIds: params.carriersIds?.toString(),
		currency: params.currency || "USD",

		market: "en-US",
	};

	// Remove undefined parameters and ensure all values are strings
	const cleanParams = Object.fromEntries(
		Object.entries(searchParams)
			.filter(([_, value]) => value !== undefined)
			.map(([key, value]) => [key, value as string]),
	);

	const response = await apiClient.get("/v2/flights/searchFlightsWebComplete", {
		params: cleanParams,
	});

	if (!response.data.status) {
		throw new Error(response.data.message || "Failed to fetch flights");
	}

	return response.data;
};
