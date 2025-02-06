type PassengerCounts = {
	adults: number;
	children: number;
	infantsInSeat: number;
	infantsOnLap: number;
};

type TripType = "round-trip" | "one-way";

type TripTypeSelectorProps = {
	tripType: TripType;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onChange: (type: TripType) => void;
};

type PassengerSelectorProps = {
	passengers: PassengerCounts;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onUpdate: (type: keyof PassengerCounts, increment: boolean) => void;
};

type CabinClassSelectorProps = {
	cabinClass: string;
	isOpen: boolean;
	onOpenChange: (open: boolean) => void;
	onChange: (value: string) => void;
};

type AirportSelection = {
	skyId: string;
	entityId: string;
	displayName: string;
	subtitle: string;
};

type SwapLocationsProps = {
	selectedOrigin: AirportSelection;
	selectedDestination: AirportSelection;
	handleOriginSelect: (airport: Airport) => void;
	handleDestinationSelect: (airport: Airport) => void;
	setShowOriginDropdown: (show: boolean) => void;
	setShowDestinationDropdown: (show: boolean) => void;
};

type LocationInputProps = {
	value: string;
	placeholder: string;
	onChange: (value: string) => void;
	onFocus: () => void;
	showDropdown: boolean;
	setShowDropdown: (show: boolean) => void;
	dropdownRef: React.RefObject<HTMLDivElement>;
	status: "idle" | "pending" | "error" | "success";
	fetchStatus: "idle" | "fetching";
	airports: Airport[] | undefined;
	onSelect: (airport: Airport) => void;
	inputType: "origin" | "destination";
};

type GroupedAirports = {
	cityName: string;
	country: string;
	cityId: string;
	citySkyId?: string;
	airports: Airport[];
};

type MobileLocationInputProps = {
	value: string;
	placeholder: string;
	onChange: (value: string) => void;
	onClose: () => void;
	status: "idle" | "pending" | "error" | "success";
	fetchStatus: "idle" | "fetching";
	airports: Airport[] | undefined;
	onSelect: (airport: Airport) => void;
	inputType: "origin" | "destination";
};
