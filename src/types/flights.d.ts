type Airport = {
	skyId: string;
	entityId: string;
	presentation: {
		title: string;
		suggestionTitle: string;
		subtitle: string;
	};
	navigation: {
		entityId: string;
		entityType: string;
		localizedName: string;
		relevantFlightParams: {
			skyId: string;
			entityId: string;
			flightPlaceType: string;
		};
	};
};

type PriceCalendarResponse = {
	status: boolean;
	timestamp: number;
	data: {
		flights: {
			noPriceLabel: string;
			groups: Array<{
				id: "low" | "medium" | "high";
				label: string;
			}>;
			days: Array<{
				day: string;
				group: "low" | "medium" | "high";
				price: number;
			}>;
			currency: string;
		};
		priceForReturnFlight: {
			price: number;
			currency: string;
		};
	};
};
