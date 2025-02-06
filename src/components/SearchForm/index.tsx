import { useState } from "react";
import { format } from "date-fns";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TripTypeSelector } from "./TripTypeSelector";
import { updatePassengerCount } from "@/utils/updatePassengerCount";
import { PassengerSelector } from "./PassengerSelector";
import { CabinClassSelector } from "./CabinClassSelector";
import { Button } from "../ui/button";
import { useAirportSearch } from "@/hooks/useAirportSearch";
import { swapLocations } from "@/utils/swapLocations";
import { ArrowRightLeft } from "lucide-react";
import { LocationInput } from "./LocationInput";
import { DatePickerWithRange } from "../DatePicker/DatePicker";
import { cn } from "@/lib/utils";
import { usePriceCalendar } from "@/hooks/usePriceCalendar";

export const SearchForm = ({ onSubmit, isLoading }: SearchFormProps) => {
	const [values, setValues] = useState({
		date: "",
		returnDate: "",
		tripType: "round-trip" as TripType,
		cabinClass: "economy" as const,
		passengers: {
			adults: 1,
			children: 0,
			infantsInSeat: 0,
			infantsOnLap: 0,
		} as PassengerCounts,
	});
	const [isPassengerOpen, setIsPassengerOpen] = useState(false);
	const [isTripTypeOpen, setIsTripTypeOpen] = useState(false);
	const [isCabinClassOpen, setIsCabinClassOpen] = useState(false);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 640px)");

	// Origin airport search
	const {
		searchTerm: originTerm,
		selected: selectedOrigin,
		showDropdown: showOriginDropdown,
		airports: originAirports,
		status,
		fetchStatus,
		handleInputChange: handleOriginChange,
		handleSelect: handleOriginSelect,
		setShowDropdown: setShowOriginDropdown,
		dropdownRef: originDropdownRef,
	} = useAirportSearch();

	// Destination airport search
	const {
		searchTerm: destinationTerm,
		selected: selectedDestination,
		showDropdown: showDestinationDropdown,
		airports: destinationAirports,
		status: destinationStatus,
		fetchStatus: destinationFetchStatus,
		handleInputChange: handleDestinationChange,
		handleSelect: handleDestinationSelect,
		setShowDropdown: setShowDestinationDropdown,
		dropdownRef: destinationDropdownRef,
	} = useAirportSearch();

	// Fetch price data for the date range
	const { data: priceData } = usePriceCalendar({
		originSkyId: selectedOrigin?.skyId,
		destinationSkyId: selectedDestination?.skyId,
		fromDate: values.date ? new Date(values.date) : undefined,
		isCalendarOpen,
		page: "searchForm",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedOrigin || !selectedDestination) {
			alert("Please select airports from the dropdown");
			return;
		}

		onSubmit({
			originSkyId: selectedOrigin.skyId,
			destinationSkyId: selectedDestination.skyId,
			originEntityId: selectedOrigin.entityId,
			destinationEntityId: selectedDestination.entityId,
			date: values.date,
			returnDate:
				values.tripType === "round-trip" ? values.returnDate : undefined,
			adults: values.passengers.adults,
			childrens: values.passengers.children,
			infantsInSeat: values.passengers.infantsInSeat,
			infantsOnLap: values.passengers.infantsOnLap,
			currency: "USD",
			cabinClass: values.cabinClass,
			countryCode: "US",
		});
	};

	// Swap locations between origin and destination
	const handleSwapLocations = () => {
		if (!selectedOrigin || !selectedDestination) return;

		swapLocations({
			selectedOrigin,
			selectedDestination,
			handleOriginSelect,
			handleDestinationSelect,
			setShowOriginDropdown,
			setShowDestinationDropdown,
		});
	};

	// Update passenger count
	const handlePassengerUpdate = (
		type: keyof PassengerCounts,
		increment: boolean,
	) => {
		setValues((prev) => ({
			...prev,
			passengers: updatePassengerCount(prev.passengers, type, increment),
		}));
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`bg-card rounded-lg px-4 pt-2 pb-10 max-w-5xl z-0 mb-4 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative ${
				isMobile ? "mx-4" : "mx-auto"
			}`}
		>
			<div
				className={`flex items-center mb-4 ${
					isMobile ? "justify-center gap-0" : "gap-4"
				}`}
			>
				<div className="flex items-center gap-2">
					<TripTypeSelector
						tripType={values.tripType}
						isOpen={isTripTypeOpen}
						onOpenChange={setIsTripTypeOpen}
						onChange={(type) => setValues({ ...values, tripType: type })}
					/>
				</div>

				<div className="flex items-center gap-2">
					<PassengerSelector
						passengers={values.passengers}
						isOpen={isPassengerOpen}
						onOpenChange={setIsPassengerOpen}
						onUpdate={handlePassengerUpdate}
					/>
				</div>

				<div className="flex items-center gap-2">
					<CabinClassSelector
						cabinClass={values.cabinClass}
						isOpen={isCabinClassOpen}
						onOpenChange={setIsCabinClassOpen}
						onChange={(value) =>
							setValues({
								...values,
								cabinClass: value as typeof values.cabinClass,
							})
						}
					/>
				</div>
			</div>

			<div
				className={`${isMobile ? "flex flex-col gap-y-2" : "flex items-center"} gap-0`}
			>
				<div className="flex items-center  mr-2 w-full">
					{/* Origin Location Input */}
					<LocationInput
						value={selectedOrigin?.displayName || originTerm}
						placeholder="Where from?"
						onChange={handleOriginChange}
						onFocus={() => setShowOriginDropdown(true)}
						setShowDropdown={setShowOriginDropdown}
						showDropdown={showOriginDropdown}
						dropdownRef={originDropdownRef as React.RefObject<HTMLDivElement>}
						status={status}
						fetchStatus={fetchStatus as "fetching" | "idle"}
						airports={originAirports}
						onSelect={handleOriginSelect}
						inputType="origin"
					/>

					{/* Swap Locations Button */}
					<Button
						type="button"
						onClick={handleSwapLocations}
						disabled={!selectedOrigin || !selectedDestination}
						className="w-8 h-8 flex items-center justify-center relative rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
					>
						<ArrowRightLeft className="text-black dark:text-white" size={14} />
					</Button>

					{/* Destination Location Input */}
					<LocationInput
						value={selectedDestination?.displayName || destinationTerm}
						placeholder="Where to?"
						onChange={handleDestinationChange}
						onFocus={() => setShowDestinationDropdown(true)}
						setShowDropdown={setShowDestinationDropdown}
						showDropdown={showDestinationDropdown}
						dropdownRef={
							destinationDropdownRef as React.RefObject<HTMLDivElement>
						}
						status={destinationStatus}
						fetchStatus={destinationFetchStatus as "fetching" | "idle"}
						airports={destinationAirports}
						onSelect={handleDestinationSelect}
						inputType="destination"
					/>
				</div>
				<div
					className={cn(
						"flex gap-2 flex-1",
						isMobile &&
							"border-1 border-gray-300 dark:border-darkBorder rounded-sm",
					)}
				>
					<DatePickerWithRange
						showReturnDate={values.tripType === "round-trip"}
						onSelect={(from, to) => {
							setValues((prev) => ({
								...prev,
								date: from ? format(from, "yyyy-MM-dd") : "",
								returnDate: to ? format(to, "yyyy-MM-dd") : "",
							}));
						}}
						prices={priceData?.data.flights.days}
						currency={priceData?.data.flights.currency}
						onOpenChange={setIsCalendarOpen}
						tripType={values.tripType}
						onTripTypeChange={(type) =>
							setValues((prev) => ({ ...prev, tripType: type }))
						}
						pageIndex={"flightsearch"}
					/>
				</div>
			</div>
			<div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2">
				<button
					type="submit"
					disabled={
						isLoading ||
						!selectedOrigin ||
						!selectedDestination ||
						!values.date ||
						(values.tripType === "round-trip" && !values.returnDate)
					}
					className="h-12 px-8 bg-[#4b8dff] text-white rounded-full hover:bg-[#3b7ae8] transition-colors disabled:bg-[#2f3136] disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
				>
					{isLoading ? "Searching..." : "Explore"}
				</button>
			</div>
		</form>
	);
};
