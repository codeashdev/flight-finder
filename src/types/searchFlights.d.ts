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
