import usePaginatedData from "@/hooks/usePaginatedData";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "./Loading";
import TimeRangeSelector from "./TimeRangeSelector";
import DataViewer from "./DataViewer";
import DataPagination from "./DataPagination";
import TimeMachine from "./TimeMachine";
import { Artist } from "@/types/types";

/**
 * TimeMachineContent Component
 * 
 * This component renders a user's artist listening history across different time periods.
 * It uses URL parameters to control the time range, and provides pagination functionality
 * for viewing additional artists beyond the initial load.
 * 
 * The component integrates several other components:
 * - TimeRangeSelector: For switching between different time periods
 * - DataViewer: For rendering the artist data
 * - TimeMachine: For displaying the artist information in a specific format
 * - DataPagination: For loading additional artists
 * 
 * @returns {JSX.Element} The rendered time machine content
**/
export default function TimeMachineContent() {
  // Get the duration parameter from URL or default to 'medium_term'
  const searchParams = useSearchParams();
  const duration = searchParams.get('Duration') || 'medium_term';
  const router = useRouter();

  // Define the available time ranges for the selector
  const timeRanges = [
    { id: 'short_term', label: 'Last 4 Weeks' },
    { id: 'medium_term', label: 'Last 6 Months' },
    { id: 'long_term', label: 'All Time' }
  ];

  /**
   * Fetches artist data from the API based on time range and offset
   * 
   * @param {Object} params - The parameters for the fetch request
   * @param {string} params.key - The time range key (short_term, medium_term, long_term)
   * @param {number} params.offset - The pagination offset
   * @returns {Promise<Object>} The fetched artist data
   * @throws {Error} If the API request fails
  **/
  const fetchArtistData = async ({ key, offset }: { key: string, offset: number }) => {
    const res = await fetch(`/api/timeMachine?time_range=${key}&offset=${offset}`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Something went wrong');
    }

    return await res.json();
  };

  // Use the custom pagination hook to manage data fetching and state
  const {
    data: timeMachineData,
    loading,
    loadingMore,
    error,
    hasMore,
    currentKey,
    changeKey,
    loadMore,
    initialLoad
  } = usePaginatedData<Artist>({
    fetchData: fetchArtistData,
    initialKey: duration,
    maxItems: 50
  });

  /**
   * Updates the URL and fetches new data when time range changes
   * 
   * @param {string} newTimeRange - The new time range value
  **/
  const handleTimeRangeChange = (newTimeRange: string) => {
    router.push(`time-machine?Duration=${newTimeRange}`, { scroll: false });
    changeKey(newTimeRange);
  };

  // Show loading state during initial data fetch
  if (loading && initialLoad) return <Loading />;

  // Show error message if data fetching failed
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="pt-6">
      <h1 className="text-2xl font-bold mb-6">Your Time Machine</h1>

      {/* Time range selection controls */}
      <TimeRangeSelector
        currentRange={currentKey}
        ranges={timeRanges}
        onChange={handleTimeRangeChange}
      />

      {/* Loading indicator for non-initial data refreshes */}
      {loading && !initialLoad && (
        <div className="text-center py-4">
          <p>Loading latest data...</p>
        </div>
      )}

      {/* Data display component */}
      <DataViewer
        data={timeMachineData ? {
          ...timeMachineData,
          total: timeMachineData.total || 0,
          next: timeMachineData.next || null,
          previous: timeMachineData.previous || null
        } : null}
        renderItems={(items) => (
          <TimeMachine timeMachineData={{
            ...timeMachineData,
            items,
            total: timeMachineData?.total || 0
          }} />
        )}
      />

      {/* Pagination controls */}
      <DataPagination
        items={timeMachineData?.items || []}
        total={timeMachineData?.total || 0}
        loading={loadingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </div>
  );
}