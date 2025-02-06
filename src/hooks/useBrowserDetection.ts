import { useState, useEffect } from "react";

type BrowserName = "chrome" | "firefox" | "safari" | "edge" | "opera" | "other";

export const useBrowserDetection = (browserToCheck: BrowserName) => {
	const [isDetectedBrowser, setIsDetectedBrowser] = useState(false);

	useEffect(() => {
		const userAgent = navigator.userAgent.toLowerCase();

		const browserChecks: Record<BrowserName, boolean> = {
			chrome: /chrome/.test(userAgent) && !/edg/.test(userAgent),
			firefox: /firefox/.test(userAgent),
			safari: /safari/.test(userAgent) && !/chrome/.test(userAgent),
			edge: /edg/.test(userAgent),
			opera: /opera|opr/.test(userAgent),
			other: false,
		};

		setIsDetectedBrowser(browserChecks[browserToCheck] || false);
	}, [browserToCheck]);

	return isDetectedBrowser;
};
