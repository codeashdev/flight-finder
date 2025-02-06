import { ArrowRightLeft, ChevronDown, MoveRight, Check } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export const TripTypeSelector = ({
	tripType,
	isOpen,
	onOpenChange,
	onChange,
}: TripTypeSelectorProps) => (
	<Popover open={isOpen} onOpenChange={onOpenChange}>
		<PopoverTrigger asChild>
			<button
				type="button"
				className={`w-40 flex items-center gap-2  ${
					isOpen
						? "bg-gray-100 dark:bg-gray-800 border-b-blue-500 border-b-1"
						: "bg-transparent"
				} hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-sm rounded-b-none`}
			>
				{tripType === "round-trip" ? (
					<ArrowRightLeft size={20} className="text-gray-400" />
				) : (
					<MoveRight size={20} className="text-gray-400" />
				)}
				<span className="text-sm dark:text-white">
					{tripType === "round-trip" ? "Round trip" : "One way"}
				</span>
				<ChevronDown
					className={`w-4 h-4 transition-all duration-300 ${isOpen ? "text-blue-500 rotate-180" : "text-gray-400"}`}
				/>
			</button>
		</PopoverTrigger>
		<PopoverContent className="w-40 p-0 border-none" align="start">
			<div className="bg-lightBg dark:bg-darkCard">
				{["round-trip", "one-way"].map((type) => (
					<button
						key={type}
						type="button"
						className={`w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center ${
							tripType === type ? "bg-gray-300 dark:bg-gray-800" : ""
						}`}
						onClick={() => {
							onChange(type as TripType);
							onOpenChange(false);
						}}
					>
						{tripType === type && <Check className="w-4 h-4 text-blue-500" />}

						<span className="ml-auto">
							{type === "round-trip" ? "Round trip" : "One way"}
						</span>
					</button>
				))}
			</div>
		</PopoverContent>
	</Popover>
);
