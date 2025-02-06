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
