import { NavBar } from "@/components/NavBar";
import { SearchForm } from "@/components/SearchForm";
import { useTheme } from "@/context/ThemeContext";

export default function Home() {
	const darkImage =
		"https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_dark_theme_4.svg";
	const lightImage =
		"https://www.gstatic.com/travel-frontend/animation/hero/flights_nc_4.svg";
	const { theme } = useTheme();

	const getBackgroundImage = () => {
		if (theme === "dark") return darkImage;
		if (theme === "light") return lightImage;
		// For system theme, check system preference
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? darkImage
			: lightImage;
	};

	return (
		<div className="min-h-screen">
			<NavBar />
			<main className="container mx-auto pb-20 min-h-[850px]">
				<div
					className="h-[23vw] max-h-[300px] min-h-[140px] mx-auto bg-cover bg-no-repeat bg-center relative mb-8"
					style={{
						backgroundImage: `url(${getBackgroundImage()})`,
					}}
				>
					<h1 className="text-4xl sm:text-5xl text-center absolute bottom-0 left-1/2 -translate-x-1/2">
						Flights
					</h1>
				</div>
				<div className="relative z-10">
					<SearchForm />
				</div>
			</main>
		</div>
	);
}
