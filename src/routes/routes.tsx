import FlightListPage from "@/pages/FlightListPage";
import Home from "@/pages/home";
import { Route, Routes } from "react-router";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/flights" element={<FlightListPage />} />
		</Routes>
	);
}
