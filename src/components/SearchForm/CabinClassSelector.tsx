import { ChevronDown, Check } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export const CabinClassSelector = ({
	cabinClass,
	isOpen,
	onOpenChange,
	onChange,
}: CabinClassSelectorProps) => (
	<Popover open={isOpen} onOpenChange={onOpenChange}>
		<PopoverTrigger asChild>
			<button
				type="button"
				className={`flex items-center gap-2 ${isOpen ? "bg-gray-100 dark:bg-gray-800 border-b-blue-500 border-b-1" : "bg-transparent"} hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-sm rounded-b-none`}
			>
				<span className="text-sm dark:text-white capitalize">
					{cabinClass.replace("_", " ")}
				</span>
				<ChevronDown
					className={`w-4 h-4 transition-all duration-300 ${isOpen ? "text-blue-500 rotate-180" : "text-gray-400"}`}
				/>
			</button>
		</PopoverTrigger>
		<PopoverContent className="w-48 p-0 border-none" align="start">
			<div className="bg-lightBg dark:bg-darkCard">
				{["economy", "premium_economy", "business", "first"].map((option) => (
					<button
						key={option}
						type="button"
						className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 capitalize flex items-center justify-between ${
							cabinClass === option ? "bg-gray-100 dark:bg-gray-800" : ""
						}`}
						onClick={() => {
							onChange(option);
							onOpenChange(false);
						}}
					>
						{cabinClass === option && (
							<Check className="w-4 h-4 text-blue-500" />
						)}
						<span className="ml-auto">{option.replace("_", " ")}</span>
					</button>
				))}
			</div>
		</PopoverContent>
	</Popover>
);
