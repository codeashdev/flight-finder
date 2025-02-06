import { useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TripTypeSelector } from "./TripTypeSelector";
import { updatePassengerCount } from "@/utils/updatePassengerCount";
import { PassengerSelector } from "./PassengerSelector";
import { CabinClassSelector } from "./CabinClassSelector";

export const SearchForm = () => {
	const [values, setValues] = useState({
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
		<form className="bg-card rounded-lg mx-auto px-4 pt-2 pb-10 max-w-5xl  mb-4 shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] relative">
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
		</form>
	);
};
