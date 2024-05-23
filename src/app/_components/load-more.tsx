import type { FunctionComponent } from "react";

interface LoadMoreProps {
  onLoadMore: () => void;
  disabled: boolean;
  fetching: boolean;
}

export const LoadMore: FunctionComponent<LoadMoreProps> = ({
  onLoadMore,
  disabled,
  fetching,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-xl font-bold">List of users</h2>
      <button
        className="rounded-md bg-gray-900 p-2 font-semibold text-white disabled:bg-gray-500 disabled:text-gray-400"
        onClick={onLoadMore}
        disabled={disabled}
      >
        {fetching ? "Loading more..." : "Load more"}
      </button>
    </div>
  );
};
