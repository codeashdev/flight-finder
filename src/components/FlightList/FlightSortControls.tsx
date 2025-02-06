import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

export const FlightSortControls = ({
	sortType,
	setSortType,
	sortOption,
	setSortOption,
	cheapestPrice,
	heading,
}: FlightSortProps & { heading: string }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className="flex flex-col mb-6">
			<div className="flex mb-4">
				<button
					type="button"
					className={`flex-1 py-1 sm:py-3 px-8 text-lg  rounded-md rounded-r-none cursor-pointer ${
						sortType === "best"
							? "bg-blue-500/10 border border-blue-500/40"
							: "bg-transparent border border-gray-300 dark:border-darkBorder"
					} transition-colors`}
					onClick={() => setSortType("best")}
				>
					Best
				</button>
				<button
					type="button"
					className={`flex-1 py-1 sm:py-3 px-8 text-lg flex items-center justify-center gap-2  rounded-md rounded-l-none cursor-pointer ${
						sortType === "cheapest"
							? "bg-blue-500/10 border border-blue-500/40"
							: "bg-transparent border border-gray-300 dark:border-darkBorder"
					} transition-colors`}
					onClick={() => setSortType("cheapest")}
				>
					<div className="flex sm:flex-row flex-col gap-x-2 items-center justify-center">
						<span className="text-sm sm:text-base">Cheapest</span>
						<div className="space-x-2">
							<span className="text-xs ">from</span>

							<span className="text-[#4caf50] text-sm sm:text-base">
								{cheapestPrice?.price.formatted}
							</span>
						</div>
					</div>
				</button>
			</div>
			<div className="flex items-center justify-between">
				<h2 className="text-base sm:text-xl dark:text-white text-black">
					{heading}
				</h2>
				<div className="relative" ref={dropdownRef}>
					<button
						type="button"
						className={`flex items-center gap-2 dark:text-white text-black py-2 px-4 transition-colors rounded-sm ${
							isDropdownOpen
								? "dark:bg-[#2a2a2a] bg-gray-100"
								: "dark:hover:bg-[#2a2a2a] hover:bg-gray-100"
						}`}
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					>
						<div className="flex items-center">
							<span>
								Sorted by {sortOption.replace(/^\w/, (c) => c.toUpperCase())}{" "}
								flights
							</span>
							<ChevronDown
								className={`w-4 h-4 transition-transform duration-200 ${
									isDropdownOpen ? "rotate-180" : ""
								}`}
							/>
						</div>
					</button>
					{isDropdownOpen && (
						<div className="absolute right-0 mt-0 w-48 bg-card border border-gray-300 dark:border-darkBorder rounded-sm shadow-lg z-10">
							<div className="py-1">
								{[
									{ value: "top", label: "Top flights" },
									{ value: "price", label: "Price" },
									{ value: "departure", label: "Departure time" },
									{ value: "arrival", label: "Arrival time" },
									{ value: "duration", label: "Duration" },
								].map((option) => (
									<button
										key={option.value}
										type="button"
										className={`w-full text-left px-4 py-2 text-sm ${
											sortOption === option.value
												? "bg-[#2a2a2a] text-white"
												: "dark:text-white text-black hover:text-white hover:bg-[#2a2a2a]"
										}`}
										onClick={() => {
											setSortOption(option.value as SortOption);
											setIsDropdownOpen(false);
										}}
									>
										{option.label}
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
