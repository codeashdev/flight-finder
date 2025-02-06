import { useState, useEffect } from "react";
import { useAirportSearch } from "@/hooks/useAirportSearch";
import { ArrowRightLeft } from "lucide-react";
import { swapLocations } from "@/utils/swapLocations";
import { format } from "date-fns";
import { usePriceCalendar } from "@/hooks/usePriceCalendar";
import { updatePassengerCount } from "@/utils/updatePassengerCount";

import { TripTypeSelector } from "../SearchForm/TripTypeSelector";
import { PassengerSelector } from "../SearchForm/PassengerSelector";
import { CabinClassSelector } from "../SearchForm/CabinClassSelector";
import { LocationInput } from "../SearchForm/LocationInput";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/DatePicker/DatePicker";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const FlightListSearchForm = ({
	initialValues,
	onSearch,
	isLoading,
}: FlightListSearchFormProps) => {
	const [isPassengerOpen, setIsPassengerOpen] = useState(false);
	const [isTripTypeOpen, setIsTripTypeOpen] = useState(false);
	const [isCabinClassOpen, setIsCabinClassOpen] = useState(false);
	const [isCalendarOpen, setIsCalendarOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 640px)");
	const [values, setValues] = useState({
		date: initialValues.date || "",
		returnDate: initialValues.returnDate || "",
		tripType: (initialValues.returnDate ? "round-trip" : "one-way") as TripType,
		cabinClass: initialValues.cabinClass || "economy",
		passengers: {
			adults: initialValues.adults || 1,
			children: initialValues.childrens || 0,
			infantsInSeat: initialValues.infantsInSeat || 0,
			infantsOnLap: initialValues.infantsOnLap || 0,
		} as PassengerCounts,
	});

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
	} = useAirportSearch(initialValues.originSkyId);

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
	} = useAirportSearch(initialValues.destinationSkyId);

	// Update values when initialValues change
	useEffect(() => {
		setValues({
			date: initialValues.date || "",
			returnDate: initialValues.returnDate || "",
			tripType: (initialValues.returnDate
				? "round-trip"
				: "one-way") as TripType,
			cabinClass: initialValues.cabinClass || "economy",
			passengers: {
				adults: initialValues.adults || 1,
				children: initialValues.childrens || 0,
				infantsInSeat: initialValues.infantsInSeat || 0,
				infantsOnLap: initialValues.infantsOnLap || 0,
			},
		});
	}, [initialValues]);

	const { data: priceData } = usePriceCalendar({
		originSkyId: selectedOrigin?.skyId,
		destinationSkyId: selectedDestination?.skyId,
		fromDate: values.date ? new Date(values.date) : undefined,
		isCalendarOpen,
		page: "flightList",
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedOrigin || !selectedDestination) {
			return;
		}

		const searchParams: FlightSearchParams = {
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
			currency: initialValues.currency || "USD",
			cabinClass: values.cabinClass,
			countryCode: initialValues.countryCode || "US",
		};

		onSearch(searchParams);
	};

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
			className={cn("bg-  pb-6 max-w-4xl mx-auto mb-12 relative")}
		>
			<div
				className={`flex items-center mb-4 ${
					isMobile ? "justify-center gap-3" : "gap-4"
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
				<div className="flex items-center mr-2 w-full">
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

					<Button
						type="button"
						onClick={handleSwapLocations}
						disabled={!selectedOrigin || !selectedDestination}
						className="w-8 h-8 flex items-center justify-center relative rounded-full bg-transparent hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
					>
						<ArrowRightLeft className="text-black dark:text-white" size={14} />
					</Button>

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
						fromDate={values.date ? new Date(values.date) : undefined}
						toDate={values.returnDate ? new Date(values.returnDate) : undefined}
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
						pageIndex={"flightlist"}
					/>
				</div>
			</div>

			<div className="absolute left-1/2 -bottom-4 -translate-x-1/2 translate-y-1/2">
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
					{isLoading ? "Searching..." : "Update search"}
				</button>
			</div>
		</form>
	);
};
