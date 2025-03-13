import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TimeMachineData } from "@/types/types";

/**
 * TimeMachine Component
 * 
 * This component displays a grid of artists based on the user's listening history.
 * It shows different time periods (4 weeks, 6 months, all time) based on the URL parameter.
 * Each artist is displayed with their image, name, and top genres.
 * 
 * @param {Object} props - Component props
 * @param {TimeMachineData} props.timeMachineData - The artist data to display
 * 
 * @returns {JSX.Element} A card containing the artist grid or a "No data" message
**/
const TimeMachine = ({ timeMachineData }: { timeMachineData: TimeMachineData }) => {
  // Get the duration parameter from URL or default to 'medium_term'
  const searchParams = useSearchParams()
  const duration = searchParams.get('Duration') || 'medium_term'

  // Return a message if no data is available
  if (!timeMachineData || !timeMachineData.items) {
    return <p>No data available</p>;
  }

  // Map API time range values to user-friendly text
  const timingMap: Record<string, string> = {
    short_term: 'last 4 weeks ago',
    medium_term: 'last 6 months ago',
    long_term: 'all time',
  };

  // Get the appropriate timing text based on the current duration
  const timing = timingMap[duration] || 'Unknown';

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        {/* Commented out title - likely handled by parent component */}
        {/* <h1 className="text-2xl font-bold mb-4">Your Time Machine</h1> */}

        {/* Hidden total items count */}
        <p className="mb-6 hidden">Total items available: {timeMachineData.total}</p>

        {/* Description of the current view */}
        <CardTitle className="text-md">
          <p className="mb-6 ">
            {duration === 'long_term'
              ? `You're currently looking at your ${timing} top artist`
              : `You're currently looking at your top artist from the ${timing}`}
          </p>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Responsive grid layout: 2 columns on mobile, 4 columns on medium screens and above */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeMachineData.items.map((artist) => (
            <div
              key={artist.id}
              className="rounded transition-shadow duration-200"
            >
              {/* Artist image with fallback handling */}
              {artist.images && artist.images[0] && (
                <Image
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-full mb-2 h-48 object-contain rounded-lg bg-gray-400/10"
                  width={300}
                  height={300}
                />
              )}

              {/* Artist name */}
              <h3 className="font-medium text-lg">{artist.name}</h3>

              {/* Artist genres (limited to first 3) */}
              {artist.genres && artist.genres.length > 0 && (
                <p className="text-sm text-gray-600">
                  {artist.genres.slice(0, 3).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default TimeMachine;