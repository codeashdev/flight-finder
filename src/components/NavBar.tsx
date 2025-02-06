import { Plane } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Link } from "react-router";

export const NavBar = () => {
	return (
		<header className="sticky top-0 z-20 flex justify-between items-center py-3 px-6 shadow-md border-b border-gray-600 bg-lightBg dark:bg-darkBg">
			<div className="flex items-center gap-2 text-blue-400">
				<Plane size={30} />
				<Link to="/" className="text-xl font-bold">
					Flight Finder
				</Link>
			</div>
			<ThemeToggle />
		</header>
	);
};
