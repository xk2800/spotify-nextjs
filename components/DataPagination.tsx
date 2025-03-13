import { DataItem, DataPaginatorProps } from "@/types/types";
import { Button } from "./ui/button";

/**
 * DataPagination Component
 * 
 * This component handles pagination for data lists with a "Load More" pattern.
 * It displays the current state of the data loading and provides a button to load additional items.
 * 
 * @template T - The type of data items being paginated (must extend DataItem)
 * 
 * @param {DataPaginatorProps<T>} props - Component props
 * @param {T[]} props.items - Current array of loaded items
 * @param {number} props.total - Total number of items available from the data source
 * @param {boolean} props.loading - Whether additional items are currently being loaded
 * @param {boolean} props.hasMore - Whether more items can be loaded
 * @param {() => void} props.onLoadMore - Function to trigger loading more items
 * 
 * @returns {JSX.Element} Rendered pagination component
**/
const DataPagination = <T extends DataItem>({
  items,
  total,
  loading,
  hasMore,
  onLoadMore
}: DataPaginatorProps<T>) => {
  return (
    <div className="mt-6">
      {/* Maximum items reached message - shown when we've loaded the maximum allowed items (50) */}
      {!hasMore && items.length >= 50 && (
        <p className="text-center mt-4 text-gray-500">
          Maximum items loaded (50)
        </p>
      )}

      {/* All items loaded message - shown when we've loaded all available items (less than max) */}
      {!hasMore && items.length < 50 && items.length > 0 && (
        <p className="text-center mt-4 text-gray-500">
          No more items to load
        </p>
      )}

      {/* Items count indicator - shows how many items are currently displayed */}
      {items.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-6">
          Showing {items.length} of {total || 0} items
        </div>
      )}

      {/* Load more button - only shown when more items can be loaded */}
      {hasMore && (
        <div className="flex justify-center mt-2">
          <Button
            onClick={onLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default DataPagination;