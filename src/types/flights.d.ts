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

type FlightSearchParams = {
	originSkyId: string;
	destinationSkyId: string;
	originEntityId: string;
	destinationEntityId: string;
	date: string;
	returnDate?: string;
	cabinClass?: "economy" | "premium_economy" | "business" | "first";
	adults?: number;
	childrens?: number;
	infantsInSeat?: number;
	infantsOnLap?: number;
	sortBy?:
		| "best"
		| "price_high"
		| "fastest"
		| "outbound_take_off_time"
		| "outbound_landing_time"
		| "return_take_off_time"
		| "return_landing_time";
	limit?: number;
	carriersIds?: string;
	currency?: string;
	countryCode?: string;
};

type FlightResponse = {
	status: boolean;
	message: string;
	data: {
		context: {
			status: string;
			sessionId: string;
			count: number;
		};
		itineraries: Array<{
			id: string;
			legs: Leg[];
			price: {
				raw: number;
				formatted: string;
			};
			pricingOptionId: string;
			isSelfTransfer: boolean;
			isProtectedSelfTransfer: boolean;
			farePolicy: {
				isChangeAllowed: boolean;
				isPartiallyChangeable: boolean;
				isCancellationAllowed: boolean;
				isPartiallyRefundable: boolean;
			};
			fareAttributes: Record<string, unknown>;
			isMashUp: boolean;
			hasFlexibleOptions: boolean;
			score: number;
			pricingOptions: PricingOption[];
		}>;
	};
};

type SearchFormProps = {
	onSubmit: (params: FlightSearchParams) => void;
	isLoading?: boolean;
};
