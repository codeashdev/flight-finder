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

export const SearchForm = () => {
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
						tripType={values.tripType}
						onTripTypeChange={(type) =>
							setValues((prev) => ({ ...prev, tripType: type }))
						}
						pageIndex={"flightsearch"}
					/>
				</div>
			</div>
		</form>
	);
};
