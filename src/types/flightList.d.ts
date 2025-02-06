type FlightListProps = {
	itineraries: Array<{
		legIds: string[];
		price: {
			raw: number;
			formatted: string;
		};
		farePolicy: {
			isChangeAllowed: boolean;
			isCancellationAllowed: boolean;
			isPartiallyChangeable: boolean;
			isPartiallyRefundable: boolean;
		};
		pricingOptions: Array<{
			agentIds: string[];
			price: {
				updateStatus: string;
				amount: number;
			};
			items: Array<{
				price: {
					updateStatus: string;
					amount: number;
				};
				agentId: string;
				url: string;
			}>;
			pricingOptionId: string;
		}>;
	}>;
	legs: {
		[key: string]: {
			id: string;
			origin: {
				displayCode: string;
				city: string;
				name: string;
			};
			destination: {
				displayCode: string;
				city: string;
				name: string;
			};
			durationInMinutes: number;
			stopCount: number;
			departure: string;
			arrival: string;
			carriers: {
				marketing: Array<{
					id: number;
					alternateId: string;
					logoUrl: string;
					name: string;
				}>;
			};
			segments: Array<{
				flightNumber: string;
			}>;
		};
	};

	cabinClass: string;
};

interface FlightCardProps {
	leg: FlightListProps["legs"][string];
	itinerary: FlightListProps["itineraries"][number];
	isRoundTrip: boolean;
	showingReturnFlight: boolean;
	isOpen: boolean;
	itemValue: string;
	onSelectFlight: (legId: string) => void;
}
