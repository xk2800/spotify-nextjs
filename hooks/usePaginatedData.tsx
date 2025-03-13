import { CachedData, DataItem, PaginatedData, UsePaginatedDataProps } from "@/types/types";
import { useEffect, useRef, useState } from "react";



// Custom hook for paginated data fetching and caching
export default function usePaginatedData<T extends DataItem>({
  fetchData,
  initialKey,
  maxItems = 50
}: UsePaginatedDataProps<T>) {
  const [currentKey, setCurrentKey] = useState(initialKey);
  const [data, setData] = useState<PaginatedData<T> | null>(null);
  const [allItems, setAllItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);

  // Cache reference
  const dataCache = useRef<CachedData<T>>({});

  // Load initial data
  useEffect(() => {
    if (initialLoad) {
      loadData(true);
      setInitialLoad(false);
    }
  }, []);

  // Handle key changes
  useEffect(() => {
    if (!initialLoad) {
      if (dataCache.current[currentKey]) {
        // Use cached data
        const cachedData = dataCache.current[currentKey];
        setData(cachedData.data);
        setAllItems(cachedData.items);
        setOffset(cachedData.offset);
        setHasMore(cachedData.hasMore);
        setError(null);
      } else {
        // Fetch new data
        loadData(false);
      }
    }
  }, [currentKey, initialLoad]);

  const loadData = async (showFullLoader: boolean) => {
    try {
      if (showFullLoader) {
        setLoading(true);
      }

      // Only fetch if we don't have cache
      if (!dataCache.current[currentKey]) {
        const responseData = await fetchData({ key: currentKey, offset: 0 });

        const newItems = responseData.items;
        const newHasMore = newItems.length < responseData.total && newItems.length < maxItems;

        // Update state
        setData(responseData);
        setAllItems(newItems);
        setOffset(0);
        setHasMore(newHasMore);

        // Cache the data
        dataCache.current[currentKey] = {
          data: responseData,
          items: newItems,
          offset: 0,
          hasMore: newHasMore
        };
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore || !data) return;

    try {
      setLoadingMore(true);
      const nextOffset = offset + 10;

      // Don't load more if we've reached the maximum
      if (allItems.length >= maxItems) {
        setHasMore(false);
        return;
      }

      const responseData = await fetchData({ key: currentKey, offset: nextOffset });

      const newItems = [...allItems, ...responseData.items];
      const newHasMore = newItems.length < maxItems && newItems.length < responseData.total;

      setData(responseData);
      setAllItems(newItems);
      setOffset(nextOffset);
      setHasMore(newHasMore);

      // Update the cache
      dataCache.current[currentKey] = {
        data: responseData,
        items: newItems,
        offset: nextOffset,
        hasMore: newHasMore
      };
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error loading more items');
    } finally {
      setLoadingMore(false);
    }
  };

  const changeKey = (newKey: string) => {
    setCurrentKey(newKey);
  };

  return {
    data: { ...data, items: allItems },
    loading,
    loadingMore,
    error,
    hasMore,
    offset,
    currentKey,
    changeKey,
    loadMore,
    initialLoad
  };
}