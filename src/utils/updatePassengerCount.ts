export const updatePassengerCount = (
	prevPassengers: PassengerCounts,
	type: keyof PassengerCounts,
	increment: boolean,
): PassengerCounts => {
	const newCount = increment
		? prevPassengers[type] + 1
		: prevPassengers[type] - 1;

	let finalCount = newCount;
	if (type === "adults") {
		finalCount = Math.max(1, Math.min(newCount, 9)); // At least 1, max 9 adults
	} else {
		finalCount = Math.max(0, Math.min(newCount, 8)); // Max 8 for other types
	}

	return {
		...prevPassengers,
		[type]: finalCount,
	};
};
