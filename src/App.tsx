import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ThemeProvider } from "./context/ThemeContext";
import AppRoutes from "./routes/routes";
import { BrowserRouter } from "react-router";

function App() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
				refetchOnMount: false,
				refetchOnReconnect: false,
				retry: 1,
			},
		},
	});

	return (
		<>
			<ThemeProvider>
				<BrowserRouter>
					<QueryClientProvider client={queryClient}>
						<AppRoutes />
					</QueryClientProvider>
				</BrowserRouter>
			</ThemeProvider>
		</>
	);
}

export default App;
