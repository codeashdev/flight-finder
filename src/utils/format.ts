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
		hour: "2-digit",
		minute: "2-digit",
	});

export const formatDuration = (minutes: number) =>
	`${Math.floor(minutes / 60)}h ${minutes % 60}m`;
