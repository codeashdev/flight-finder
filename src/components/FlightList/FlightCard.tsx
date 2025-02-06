import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { formatTime, formatDuration } from "@/utils/format";

export const FlightCard = ({
	leg,
	itinerary,
	isRoundTrip,
	showingReturnFlight,
	isOpen,
	itemValue,
	onSelectFlight,
	cabinClass,
}: FlightCardProps & { cabinClass: string }) => {
	const isBigScreen = useMediaQuery("(min-width: 1024px)");
	const isSmallScreen = useMediaQuery("(max-width: 440px)");
	return (
		<AccordionItem
			value={itemValue}
			className="bg-white dark:bg-darkBg dark:hover:bg-[#2a2a2a] hover:bg-gray-100 transition-colors rounded-t-sm border-b-1 border-gray-300 dark:border-darkBorder"
		>
			<AccordionTrigger
				className={` [&[data-state=open]>svg]:rotate-180 hover:no-underline w-full ${
					isSmallScreen ? "p-0 pr-4 py-4" : "p-4"
				}`}
			>
				<div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
					<div className="flex items-center gap-4 space-x-4">
						<img
							src={leg.carriers.marketing[0].logoUrl}
							alt={`${leg.carriers.marketing[0].name} logo`}
							className="w-8 h-8"
						/>
						<div>
							<div className=" text-md">
								{isOpen ? (
									<h3 className="text-lg mb-4">
										{showingReturnFlight ? "Return" : "Departure"} ·{" "}
										{new Date(leg.departure).toLocaleDateString("en-US", {
											weekday: "short",
											month: "short",
											day: "numeric",
										})}
									</h3>
								) : (
									`${formatTime(leg.departure)} - ${formatTime(leg.arrival)}`
								)}
							</div>
							{!isOpen && (
								<div className="text-gray-400 text-xs">
									{leg.carriers.marketing[0].name}
								</div>
							)}
						</div>
					</div>

					<div
						className={`flex items-center  ${
							isSmallScreen ? "gap-0" : "gap-6"
						}`}
					>
						<div className="text-center min-w-[100px]">
							<div className="">{formatDuration(leg.durationInMinutes)}</div>
							<div className="text-gray-400 text-sm">
								{leg.origin.displayCode}-{leg.destination.displayCode}
							</div>
						</div>
						{isRoundTrip && !showingReturnFlight && isOpen && (
							<div
								className={`bg-[#263238]  hover:cursor-pointer text-white px-6 py-2 rounded-sm ${
									!isBigScreen ? "hidden" : ""
								}`}
								onClick={(e) => {
									e.preventDefault();
									onSelectFlight(leg.id);
								}}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") {
										e.preventDefault();
										onSelectFlight(leg.id);
									}
								}}
							>
								Select flight
							</div>
						)}

						<div className="text-center min-w-[80px]">
							<div className="">
								{leg.stopCount === 0
									? "Nonstop"
									: `${leg.stopCount} stop${leg.stopCount > 1 ? "s" : ""}`}
							</div>
						</div>

						<div className="flex flex-col items-center gap-1 min-w-[140px]">
							<div className="text-[#4caf50] text-xl font-medium">
								{itinerary.price.formatted}
							</div>
							<div className="text-gray-400 text-xs">
								{isRoundTrip ? "round trip" : "one way"}
							</div>
						</div>
					</div>
				</div>
			</AccordionTrigger>

			<AccordionContent className="border-t border-darkBorder pl-4 sm:pl-14">
				<div className="p-6">
					<div
						className={`flex items-start gap-8 ${
							isSmallScreen ? "flex-col" : "flex-row"
						}`}
					>
						<div className="flex-1">
							<div className="flex items-center gap-4">
								<div className="flex flex-col items-center gap-1">
									<div className="w-3 h-3 bg-transparent border border-gray-500 rounded-full" />
									<div className="w-0.5 h-2 text-gray-500" />

									<div className="w-1 h-1 bg-gray-500 rounded-full" />

									<div className="w-1 h-1 bg-gray-500 rounded-full" />
									<div className="w-1 h-1 bg-gray-500 rounded-full" />
									<div className="w-1 h-1 bg-gray-500 rounded-full" />
									<div className="w-0.5 h-2 text-gray-600" />
									<div className="w-3 h-3 bg-transparent border border-gray-500 rounded-full" />
								</div>
								<div className="flex-1 space-y-4 py-1">
									<div>
										<div className=" text-md">
											{formatTime(leg.departure)} · {leg.origin.name} Airport
											<span className="text-sm">
												{" "}
												({leg.origin.displayCode})
											</span>
										</div>
									</div>
									<div className="text-gray-400">
										Travel time: {formatDuration(leg.durationInMinutes)}
									</div>
									<div>
										<div className=" text-md">
											{formatTime(leg.arrival)} · {leg.destination.name} Airport
											<span className="text-sm">
												{" "}
												({leg.destination.displayCode})
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="flex-1">
							<div className="space-y-4">
								<div className="text-gray-400">
									{leg.carriers.marketing[0].name} ·{" "}
									{cabinClass
										.split("_")
										.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
										.join(" ")}{" "}
									· {leg.segments[0].flightNumber}
								</div>
								<div className="text-gray-400 text-sm">
									{itinerary.farePolicy.isChangeAllowed
										? "Changes allowed"
										: "No changes allowed"}{" "}
									·{" "}
									{itinerary.farePolicy.isCancellationAllowed
										? "Cancellation allowed"
										: "No cancellation"}
								</div>
							</div>
							{isRoundTrip && !showingReturnFlight && (
								<div
									className={`bg-[#263238]  cursor-pointer text-white my-4 px-4 py-2 w-40 text-center rounded-sm ${
										isBigScreen ? "hidden" : ""
									}`}
									onClick={(e) => {
										e.preventDefault();
										onSelectFlight(leg.id);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											onSelectFlight(leg.id);
										}
									}}
								>
									Select flight
								</div>
							)}
						</div>
					</div>
				</div>
			</AccordionContent>
		</AccordionItem>
	);
};
