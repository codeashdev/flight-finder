import Home from "@/pages/home";
import { Route, Routes } from "react-router";

export default function AppRoutes() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
		</Routes>
	);
}
