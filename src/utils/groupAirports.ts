export const groupAirports = (
	airports: Airport[] | undefined,
): GroupedAirports[] => {
	if (!airports) return [];

	const groups = new Map<string, GroupedAirports>();

	for (const airport of airports) {
		const firstWord = airport.presentation.title.split(" ")[0];
		const country = airport.presentation.subtitle;
		const cityId = airport.navigation.entityId;
		const groupKey = `${firstWord}-${country}`;

		if (!groups.has(groupKey)) {
			groups.set(groupKey, {
				cityName: firstWord,
				country,
				cityId,
				airports: [],
			});
		}

		if (airport.navigation.entityType === "CITY") {
			const group = groups.get(groupKey);
			if (group) {
				group.citySkyId = airport.skyId;
			}
		} else {
			groups.get(groupKey)?.airports.push(airport);
		}
	}

	return Array.from(groups.values()).sort((a, b) =>
		a.cityName.localeCompare(b.cityName),
	);
};
