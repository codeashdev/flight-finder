import { ChevronDown, Minus, Plus, User } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const PassengerSelector = ({
	passengers,
	isOpen,
	onOpenChange,
	onUpdate,
}: PassengerSelectorProps) => {
	const getTotalPassengers = () => {
		const { adults, children, infantsInSeat, infantsOnLap } = passengers;
		return adults + children + infantsInSeat + infantsOnLap;
	};

	const passengerTypes = [
		{
			type: "adults" as const,
			label: "Adults",
			subLabel: "Age 12+",
			min: 1,
			max: 9,
		},
		{
			type: "children" as const,
			label: "Children",
			subLabel: "Aged 2-11",
			min: 0,
			max: 8,
		},
		{
			type: "infantsInSeat" as const,
			label: "Infants",
			subLabel: "In seat",
			min: 0,
			max: 8,
		},
		{
			type: "infantsOnLap" as const,
			label: "Infants",
			subLabel: "On lap",
			min: 0,
			max: 8,
		},
	];

	return (
		<Popover open={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger asChild>
				<button
					type="button"
					className={`flex items-center gap-2 ${isOpen ? "bg-gray-100 dark:bg-gray-800 border-b-blue-500 border-b-1" : "bg-transparent"} hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-sm rounded-b-none`}
				>
					<User size={20} />

					<span className="text-sm dark:text-white">
						{getTotalPassengers()}
					</span>
					<ChevronDown
						className={`w-4 h-4 transition-all duration-300 ${isOpen ? "text-blue-500 rotate-180" : "text-gray-400"}`}
					/>
				</button>
			</PopoverTrigger>
			<PopoverContent className="w-60 p-0 border-none" align="start">
				<div className="p-4 space-y-4 bg-lightBg dark:bg-darkCard">
					{passengerTypes.map(({ type, label, subLabel, min, max }) => (
						<div key={type} className="flex items-center justify-between">
							<div>
								<div className="font-medium">{label}</div>
								<div className="text-sm text-gray-500">{subLabel}</div>
							</div>
							<div className="flex items-center gap-3">
								<Button
									variant="minus"
									size="passenger"
									onClick={() => onUpdate(type, false)}
									disabled={passengers[type] <= min}
								>
									<Minus className="w-4 h-4" />
								</Button>
								<span className="w-4 text-center">{passengers[type]}</span>
								<Button
									variant="plus"
									size="passenger"
									onClick={() => onUpdate(type, true)}
									disabled={passengers[type] >= max}
								>
									<Plus className="w-4 h-4" />
								</Button>
							</div>
						</div>
					))}
				</div>
			</PopoverContent>
		</Popover>
	);
};
