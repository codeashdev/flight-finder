import { useQuery } from "@tanstack/react-query";
import { getPriceCalendar } from "@/services/api";

export function usePriceCalendar(params: {
	originSkyId?: string;
	destinationSkyId?: string;
	fromDate?: Date;
	currency?: string;
	isCalendarOpen?: boolean;
	page: "flightList" | "searchForm";
}) {
	const {
		originSkyId,
		destinationSkyId,
		fromDate,
		currency,
		isCalendarOpen,
		page,
	} = params;
	return useQuery({
		queryKey: [
			"priceCalendar",
			originSkyId,
			destinationSkyId,
			fromDate?.toISOString(),
			currency,
		],
		queryFn: () => {
			if (!originSkyId || !destinationSkyId || !fromDate) {
				throw new Error("Missing required parameters");
			}
			return getPriceCalendar({
				originSkyId,
				destinationSkyId,
				fromDate,
				currency,
			});
		},
		enabled:
			page === "searchForm"
				? Boolean(originSkyId && destinationSkyId && fromDate && isCalendarOpen)
				: Boolean(originSkyId && destinationSkyId && fromDate),
		gcTime: 30 * 60 * 1000,
		staleTime: 5 * 60 * 1000,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
	});
}
