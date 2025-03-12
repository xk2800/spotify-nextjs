'use client'

import Loading from "@/components/Loading";
import TimeMachine from "@/components/TimeMachine";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface Artist {
  id: string;
  name: string;
  images?: Array<{ url: string }>;
  genres?: string[];
  // Add other properties as needed
}

interface TimeMachineData {
  items: Artist[];
  total: number;
  next: string | null;
  previous: string | null;
}

// Keep track of already loaded data across renders
interface CachedData {
  [timeRange: string]: {
    data: TimeMachineData | null;
    items: Artist[];
    offset: number;
    hasMore: boolean;
  }
}

const TimeMachinePage = () => {
  const searchParams = useSearchParams()
  const duration = searchParams.get('Duration') || 'medium_term'
  const router = useRouter()

  // Cache reference to store data for each time range
  const dataCache = useRef<CachedData>({})

  const [timeMachineData, setTimeMachineData] = useState<TimeMachineData | null>(null)
  const [allItems, setAllItems] = useState<Artist[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [initialLoad, setInitialLoad] = useState(true)

  // First-time component load
  useEffect(() => {
    if (initialLoad) {
      fetchTimeMachine(true)
      setInitialLoad(false)
    }
  }, [])

  // Handle duration changes
  useEffect(() => {
    if (!initialLoad) {
      // Check if we already have cached data for this duration
      if (dataCache.current[duration]) {
        // Use cached data instead of loading
        const cachedTimeRange = dataCache.current[duration]
        setTimeMachineData(cachedTimeRange.data)
        setAllItems(cachedTimeRange.items)
        setOffset(cachedTimeRange.offset)
        setHasMore(cachedTimeRange.hasMore)
        setError(null)
      } else {
        // No cached data, need to fetch new data but don't show full-page loader
        fetchTimeMachine(false)
      }
    }
  }, [duration, initialLoad])

  const fetchTimeMachine = async (showFullLoader: boolean) => {
    try {
      if (showFullLoader) {
        setLoading(true)
      }

      // Only reset data if we don't have cached data
      if (!dataCache.current[duration]) {
        // Pass time_range parameter correctly to the API
        const res = await fetch(`/api/timeMachine?time_range=${duration}&offset=0`)

        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Something went wrong')
        }

        const data = await res.json()

        const newItems = data.items
        const newHasMore = newItems.length < data.total && newItems.length < 50

        // Update state
        setTimeMachineData(data)
        setAllItems(newItems)
        setOffset(0)
        setHasMore(newHasMore)

        // Cache the data
        dataCache.current[duration] = {
          data,
          items: newItems,
          offset: 0,
          hasMore: newHasMore
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error occurred')
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    if (loadingMore || !hasMore || !timeMachineData) return

    try {
      setLoadingMore(true)
      const nextOffset = offset + 10

      // Don't load more if we've reached the maximum of 50
      if (allItems.length >= 50) {
        setHasMore(false)
        return
      }

      // Pass time_range parameter correctly to the API
      const res = await fetch(`/api/timeMachine?time_range=${duration}&offset=${nextOffset}`)

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Something went wrong')
      }

      const data = await res.json()
      const newItems = [...allItems, ...data.items]
      const newHasMore = newItems.length < 50 && newItems.length < data.total

      setTimeMachineData(data)
      setAllItems(newItems)
      setOffset(nextOffset)
      setHasMore(newHasMore)

      // Update the cache
      dataCache.current[duration] = {
        data,
        items: newItems,
        offset: nextOffset,
        hasMore: newHasMore
      }

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error loading more items')
    } finally {
      setLoadingMore(false)
    }
  }

  const handleTimeRangeChange = (newTimeRange: string) => {
    router.push(`time-machine?Duration=${newTimeRange}`, {
      scroll: false
    })
  }

  if (loading && initialLoad) return <Loading />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Time Machine</h1>

      <div className="flex gap-2 mb-8">
        <Badge
          className={`px-4 py-2 cursor-pointer ${duration === 'short_term' ? 'bg-primary font-bold' : 'bg-gray-600 hover:bg-secondary text-white hover:text-black'}`}
          onClick={() => handleTimeRangeChange('short_term')}
        >
          Last 4 Weeks
        </Badge>
        <Badge
          className={`px-4 py-2 cursor-pointer ${duration === 'medium_term' ? 'bg-primary font-bold' : 'bg-gray-600 hover:bg-secondary text-white hover:text-black'}`}
          onClick={() => handleTimeRangeChange('medium_term')}
        >
          Last 6 Months
        </Badge>
        <Badge
          className={`px-4 py-2 cursor-pointer ${duration === 'long_term' ? 'bg-primary font-bold' : 'bg-gray-600 hover:bg-secondary text-white hover:text-black'}`}
          onClick={() => handleTimeRangeChange('long_term')}
        >
          All Time
        </Badge>
      </div>

      {loading && !initialLoad && (
        <div className="text-center py-4">
          <p>Loading latest data...</p>
        </div>
      )}

      {!loading && timeMachineData ? (
        <TimeMachine timeMachineData={{ ...timeMachineData, items: allItems }} />
      ) : !loading && !timeMachineData ? (
        <p>No data available</p>
      ) : null}

      {!hasMore && allItems.length >= 50 && (
        <p className="text-center mt-4 text-gray-500">
          Maximum items loaded (50)
        </p>
      )}

      {!hasMore && allItems.length < 50 && allItems.length > 0 && (
        <p className="text-center mt-4 text-gray-500">
          No more items to load
        </p>
      )}

      {allItems.length > 0 && (
        <div className="text-center mt-2 text-sm text-gray-500">
          Showing {allItems.length} of {timeMachineData?.total || 0} items
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button
            onClick={loadMore}
            disabled={loadingMore}
          // className="px-4 py-2"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default TimeMachinePage;