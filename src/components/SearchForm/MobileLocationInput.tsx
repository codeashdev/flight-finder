import { Search, ChevronLeft, MapPin, Plane } from "lucide-react";
import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { groupAirports } from "@/utils/groupAirports";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export const MobileLocationInput = ({
	value,
	placeholder,
	onChange,
	onClose,
	status,
	fetchStatus,
	airports = [],
	onSelect,
}: MobileLocationInputProps) => {
	const inputRef = useRef<HTMLInputElement>(null);

	// Focus the input when the component mounts
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, []);

	const groupedAirports = groupAirports(airports);
	const firstGroupKey = groupedAirports[0]
		? `${groupedAirports[0].cityName}-${groupedAirports[0].country}`
		: undefined;

	return (
		<div className="fixed inset-0 bg-white dark:bg-[#2f3136] z-20">
			<div className="flex items-center border-b border-b-darkBorder">
				<Button variant="ghost" size="icon" className="ml-2 " onClick={onClose}>
					<ChevronLeft size={24} />
				</Button>
				<div className="relative flex-1 pr-4">
					<Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
					<input
						ref={inputRef}
						type="text"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className="w-full p-4 pl-12 text-black dark:text-white rounded-sm border-none focus:outline-none focus:ring-0 placeholder-gray-400"
						placeholder={placeholder}
					/>
				</div>
			</div>
			<div className="h-[calc(100vh-64px)] overflow-auto">
				{fetchStatus === "fetching" ? (
					<div className="p-4 text-gray-400">Fetching Airports...</div>
				) : status === "error" ? (
					<div className="p-4 text-red-400">Error searching airports</div>
				) : (
					<Accordion type="single" collapsible defaultValue={firstGroupKey}>
						{groupedAirports.map(({ cityName, country, airports }) => {
							const groupKey = `${cityName}-${country}`;

							return (
								<AccordionItem
									key={groupKey}
									value={groupKey}
									className="border-none"
								>
									<AccordionTrigger className="flex items-center justify-between p-4 dark:text-white text-black hover:bg-gray-200 dark:hover:bg-[#383a40] hover:no-underline">
										<div className="flex items-center gap-4">
											<MapPin className="w-6 h-6 text-gray-500" />
											<div>
												<div className="text-lg font-medium text-left">
													{cityName}
												</div>
												<div className="text-sm text-gray-400 text-left">
													{country}
												</div>
											</div>
										</div>
									</AccordionTrigger>
									<AccordionContent className="pl-10">
										{airports.map((airport) => (
											<button
												type="button"
												key={airport.skyId}
												className="w-full text-left p-4 flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-[#383a40]"
												onClick={() => {
													onSelect(airport);
													onClose();
												}}
											>
												<span className="text-sm">
													<Plane className="w-6 h-6 text-gray-500" />
												</span>

												<div>
													<div className="text-lg">
														{airport.presentation.suggestionTitle}
													</div>
													<div className="text-sm text-gray-400">
														{airport.presentation.subtitle}
													</div>
												</div>
											</button>
										))}
									</AccordionContent>
								</AccordionItem>
							);
						})}
					</Accordion>
				)}
			</div>
		</div>
	);
};
