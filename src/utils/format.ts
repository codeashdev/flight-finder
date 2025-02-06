export const formatPrice = (price: number, currency = "USD") => {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(price);
};

export const formatTime = (isoString: string) =>
	new Date(isoString).toLocaleTimeString([], {
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});

export const formatDuration = (minutes: number) => {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (minutes === 0) return "0m";
	if (remainingMinutes === 0) return `${hours}h`;
	if (hours === 0) return `${remainingMinutes}m`;
	return `${hours}h ${remainingMinutes}m`;
};
