import { useLocation } from "react-router";

import { NavBar } from "@/components/NavBar";

const FlightListPage = () => {
	const location = useLocation();

	const { error: navigationError } = location.state || {};

	if (navigationError) {
		return (
			<>
				<NavBar />
				<div className="container mx-auto px-4 py-8">
					<div className="p-4 bg-red-100 text-red-700 rounded-lg mt-4">
						{navigationError}
					</div>
					<div className="flex justify-center">
						<button
							type="button"
							onClick={() => window.history.back()}
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
						>
							Go Back
						</button>
					</div>
				</div>
			</>
		);
	}
	return (
		<>
			<NavBar />
			<div className="container mx-auto px-4 py-8">Flight List</div>
		</>
	);
};
export default FlightListPage;
