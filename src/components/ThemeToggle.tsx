import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/context/ThemeContext";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeToggle = () => {
	const { setTheme } = useTheme();

	const handleLightTheme = () => setTheme("light");
	const handleDarkTheme = () => setTheme("dark");
	const handleSystemTheme = () => setTheme("system");

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div className="w-10 h-10 rounded-full  flex items-center justify-center dark:hover:bg-gray-700 hover:bg-gray-300 transition-colors">
					<Moon className="h-[1.2rem] w-[3.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-gray-800" />
					<Sun className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-yellow-300" />
					<span className="sr-only">Toggle theme</span>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={handleLightTheme}>Light</DropdownMenuItem>
				<DropdownMenuItem onClick={handleDarkTheme}>Dark</DropdownMenuItem>
				<DropdownMenuItem onClick={handleSystemTheme}>System</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
