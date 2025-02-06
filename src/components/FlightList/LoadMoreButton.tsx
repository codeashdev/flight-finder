import { ChevronDown } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";

interface LoadMoreButtonProps {
	isLoading: boolean;
	displayCount: number;
	maxCount: number;
	onLoadMore: () => void;
}

export const LoadMoreButton = ({
	isLoading,
	displayCount,
	maxCount,
	onLoadMore,
}: LoadMoreButtonProps) => {
	if (maxCount <= 10) return null;

	const isShowingAll = displayCount >= maxCount;
	const remainingFlights = maxCount - displayCount;

	return (
		<div className="flex justify-center mt-8">
			<button
				type="button"
				onClick={onLoadMore}
				className="flex items-center gap-2 py-4 px-6 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] transition-colors rounded-sm"
			>
				{isLoading ? (
					<>
						<Spinner />
						Loading more flights...
					</>
				) : (
					<>
						<ChevronDown
							className={`w-5 h-5 transition-transform duration-200 ${isShowingAll ? "rotate-180" : ""}`}
							aria-hidden="true"
						/>
						{isShowingAll
							? "Show less flights"
							: `Show  more flights (${remainingFlights} Total)`}
					</>
				)}
			</button>
		</div>
	);
};
