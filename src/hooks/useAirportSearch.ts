import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchAirports } from "@/services/api";
import debounce from "lodash/debounce";

export const useAirportSearch = (initialSkyId = "") => {
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedTerm, setDebouncedTerm] = useState("");
	const [showDropdown, setShowDropdown] = useState(false);
	const [selected, setSelected] = useState<AirportSelection | null>(null);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const queryClient = useQueryClient();
	const initializedRef = useRef(false);

	// Initialize with airport data if initialSkyId is provided
	useEffect(() => {
		const initializeAirport = async () => {
			if (initialSkyId && !initializedRef.current) {
				try {
					const airports = await searchAirports(initialSkyId);
					const airport = airports.find((a) => a.skyId === initialSkyId);
					if (airport) {
						const selection = {
							skyId: airport.skyId,
							entityId: airport.entityId,
							displayName: `${airport.presentation.title} (${airport.skyId})`,
							subtitle: airport.presentation.subtitle,
						};
						setSelected(selection);
						setSearchTerm(selection.displayName);
						initializedRef.current = true;
					}
				} catch (error) {
					console.error("Error initializing airport:", error);
				}
			}
		};

		initializeAirport();
	}, [initialSkyId]);

	// Reset initialization when initialSkyId changes
	useEffect(() => {
		if (initialSkyId) {
			initializedRef.current = false;
		}
	}, [initialSkyId]);

	// Debounced function using useCallback to maintain reference
	const debouncedSetTerm = useCallback(
		debounce((value: string) => {
			setDebouncedTerm(value);
		}, 100),
		[],
	);

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			debouncedSetTerm.cancel();
		};
	}, [debouncedSetTerm]);

	// Updates the debounced search term to trigger new airport searches
	useEffect(() => {
		debouncedSetTerm(searchTerm);
	}, [searchTerm, debouncedSetTerm]);

	// Sets up an event listener to handle clicks outside the dropdown
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setShowDropdown(false);
				// If no airport is selected and we have a previous selection, restore it
				if (!selected && searchTerm !== "") {
					setSearchTerm("");
				} else if (selected) {
					setSearchTerm(selected.displayName);
				}
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [selected, searchTerm]);

	const {
		data: airports,
		status,
		fetchStatus,
	} = useQuery({
		queryKey: ["airports", debouncedTerm],
		queryFn: () => searchAirports(debouncedTerm),
		enabled: debouncedTerm.length >= 2,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		retry: 3,
		gcTime: 1000 * 60 * 5, // 5 minutes
		staleTime: 1000 * 60 * 2, // 2 minutes
	});

	const handleInputChange = (value: string) => {
		setSearchTerm(value);

		if (value === "") {
			setSelected(null);
			setShowDropdown(false);
			return;
		}
		// Only clear selection if the input value doesn't match the selected airport
		if (selected && value !== selected.displayName) {
			setSelected(null);
		}
		setShowDropdown(true);
		if (value.length >= 2) {
			const cachedData = queryClient.getQueryData(["airports", value]);
			if (!cachedData) {
				queryClient.invalidateQueries({ queryKey: ["airports", value] });
			}
		}
	};

	const handleSelect = (airport: Airport) => {
		if (!airport?.presentation?.title) {
			console.warn("Invalid airport data:", airport);
			return;
		}
		const selection = {
			skyId: airport.skyId,
			entityId: airport.entityId,
			displayName: `${airport.presentation.title} (${airport.skyId})`,
			subtitle: airport.presentation.subtitle,
		};

		setSearchTerm(selection.displayName);
		setSelected(selection);
		setShowDropdown(false);
	};

	return {
		searchTerm,
		selected,
		showDropdown,
		airports,
		status,
		fetchStatus,
		handleInputChange,
		handleSelect,
		setShowDropdown,
		dropdownRef,
	};
};
