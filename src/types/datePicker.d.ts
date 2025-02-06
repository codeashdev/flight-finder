type FlightPrice = {
	day: string;
	price: number;
	group: "low" | "medium" | "high";
};

type DatePickerWithRangeProps = {
	fromDate?: Date;
	toDate?: Date;
	showReturnDate?: boolean;
	onSelect: (from: Date | undefined, to: Date | undefined) => void;
	prices?: FlightPrice[];
	currency?: string;
	onOpenChange?: (open: boolean) => void;
	tripType: TripType;
	onTripTypeChange: (type: TripType) => void;
	pageIndex: "flightlist" | "flightsearch";
};
