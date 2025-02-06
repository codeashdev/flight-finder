import { Search, MapPin, Plane } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useBrowserDetection } from "@/hooks/useBrowserDetection";
import { groupAirports } from "@/utils/groupAirports";
import { useMediaQuery } from "@/hooks/useMediaQuery";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { MobileLocationInput } from "./MobileLocationInput";

export const LocationInput = ({
	value,
	placeholder,
	onChange,
	onFocus,
	showDropdown,
	setShowDropdown,
	dropdownRef,
	status,
	fetchStatus,
	airports,
	onSelect,
	inputType,
}: LocationInputProps) => {
	const [inputTop, setInputTop] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);
	const overlayRef = useRef<HTMLDivElement>(null);
	const overlayInputRef = useRef<HTMLInputElement>(null);
	const isChrome = useBrowserDetection("chrome");
	const isMobile = useMediaQuery("(max-width: 640px)");
	const isSmallScreen = useMediaQuery("(max-width: 768px)");

	// Handles closing the dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				overlayRef.current &&
				!overlayRef.current.contains(event.target as Node) &&
				!inputRef.current?.contains(event.target as Node)
			) {
				setShowDropdown(false);
			}
		};

		if (showDropdown) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showDropdown, setShowDropdown]);

	// Adjusts the dropdown position based on the input's position
	useEffect(() => {
		if (showDropdown && inputRef.current) {
			setInputTop(inputRef.current.getBoundingClientRect().top);
		}
	}, [showDropdown]);

	// Adjusts the dropdown position on window scroll
	useEffect(() => {
		const handleScroll = () => {
			if (showDropdown && inputRef.current) {
				setInputTop(inputRef.current.getBoundingClientRect().top);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [showDropdown]);

	const groupedAirports = groupAirports(airports || []);
	const firstGroupKey = groupedAirports[0]
		? `${groupedAirports[0].cityName}-${groupedAirports[0].country}`
		: undefined;

	return (
		<div className="relative flex-1">
			<input
				ref={inputRef}
				type="text"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onFocus={onFocus}
				className={`w-full p-3 dark:bg-[#2f3136] text-black dark:text-white rounded-sm ${
					isMobile
						? "border dark:border-darkBorder border-gray-300"
						: "border dark:border-none border-gray-300"
				} focus:outline-none focus:ring-1 focus:ring-[#4c4f57] placeholder-gray-400`}
				placeholder={placeholder}
			/>

			{!isSmallScreen && showDropdown && (
				<div className="fixed inset-0 z-40">
					<div
						ref={overlayRef}
						className={`fixed ${
							inputType === "origin"
								? "translate-x-[-0.5rem] translate-y-[-0.2rem]"
								: isChrome
									? "translate-x-[-0.2rem] translate-y-[-0.3rem]"
									: "translate-x-[-1rem] translate-y-[-0.3rem]"
						}`}
						style={{
							top: `${inputTop}px`,
							left: `${inputRef.current?.getBoundingClientRect().left ?? 0}px`,
						}}
					>
						<div className="relative max-w-[600px]">
							<div
								ref={dropdownRef}
								className="relative bg-white dark:bg-[#2f3136] shadow-2xl w-[28rem]"
							>
								<div className="relative flex items-center border-b border-b-darkBorder">
									<Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
									<input
										ref={overlayInputRef}
										type="text"
										value={value}
										onChange={(e) => onChange(e.target.value)}
										className="w-full p-4 pl-12 text-black dark:text-white rounded-sm border-gray-300 border dark:border-none focus:outline-none focus:ring-1 focus:ring-[#4c4f57] placeholder-gray-400"
										placeholder={placeholder}
									/>
								</div>

								<div className="max-h-[500px] overflow-y-auto">
									{fetchStatus === "fetching" ? (
										<div className="p-4 text-gray-400">
											Fetching Airports...
										</div>
									) : status === "error" ? (
										<div className="p-4 text-red-400">
											Error searching airports
										</div>
									) : (
										<Accordion
											type="single"
											collapsible
											defaultValue={firstGroupKey}
										>
											{groupedAirports.map(
												({ cityName, country, airports }) => {
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
															<AccordionContent>
																{airports.map((airport) => (
																	<button
																		type="button"
																		key={airport.skyId}
																		className="w-full text-left p-4 flex items-center gap-4 hover:bg-gray-200 dark:hover:bg-[#383a40]"
																		onClick={() => {
																			onSelect(airport);
																			setShowDropdown(false);
																		}}
																	>
																		<span className="text-sm">
																			{airport.navigation.entityType ===
																			"CITY" ? (
																				<MapPin className="w-6 h-6 text-gray-500" />
																			) : (
																				<Plane className="w-6 h-6 text-gray-500" />
																			)}
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
												},
											)}
										</Accordion>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
			{isSmallScreen && showDropdown && (
				<MobileLocationInput
					value={value}
					placeholder={placeholder}
					onChange={onChange}
					onClose={() => setShowDropdown(false)}
					status={status}
					fetchStatus={fetchStatus}
					airports={airports}
					onSelect={onSelect}
					inputType={inputType}
				/>
			)}
		</div>
	);
};
