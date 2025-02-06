export const swapLocations = ({
	selectedOrigin,
	selectedDestination,
	handleOriginSelect,
	handleDestinationSelect,
	setShowOriginDropdown,
	setShowDestinationDropdown,
}: SwapLocationsProps) => {
	if (!selectedOrigin || !selectedDestination) return;

	// Store current values
	const tempOrigin = {
		skyId: selectedOrigin.skyId,
		entityId: selectedOrigin.entityId,
		displayName: selectedOrigin.displayName,
		subtitle: selectedOrigin.subtitle,
	};
	const tempDest = {
		skyId: selectedDestination.skyId,
		entityId: selectedDestination.entityId,
		displayName: selectedDestination.displayName,
		subtitle: selectedDestination.subtitle,
	};

	// Update the selections with the original airport data
	handleOriginSelect({
		skyId: tempDest.skyId,
		entityId: tempDest.entityId,
		presentation: {
			title: tempDest.displayName.replace(/ \([A-Z]+\)$/, ""), // Remove the skyId from the title
			subtitle: tempDest.subtitle,
			suggestionTitle: "",
		},
		navigation: {
			entityId: tempDest.entityId,
			entityType: "AIRPORT",
			localizedName: tempDest.displayName,
			relevantFlightParams: {
				skyId: tempDest.skyId,
				entityId: tempDest.entityId,
				flightPlaceType: "AIRPORT",
			},
		},
	});

	handleDestinationSelect({
		skyId: tempOrigin.skyId,
		entityId: tempOrigin.entityId,
		presentation: {
			title: tempOrigin.displayName.replace(/ \([A-Z]+\)$/, ""), // Remove the skyId from the title
			subtitle: tempOrigin.subtitle,
			suggestionTitle: "",
		},
		navigation: {
			entityId: tempOrigin.entityId,
			entityType: "AIRPORT",
			localizedName: tempOrigin.displayName,
			relevantFlightParams: {
				skyId: tempOrigin.skyId,
				entityId: tempOrigin.entityId,
				flightPlaceType: "AIRPORT",
			},
		},
	});

	// Close dropdowns
	setShowOriginDropdown(false);
	setShowDestinationDropdown(false);
};
