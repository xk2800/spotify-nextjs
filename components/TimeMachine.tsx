import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface TimeMachineData {
  total: number;
  items: Array<{
    id: string;
    name: string;
    images?: Array<{
      url: string;
    }>;
    genres?: string[];
  }>;
}

const TimeMachine = ({ timeMachineData }: { timeMachineData: TimeMachineData }) => {
  const searchParams = useSearchParams()
  const duration = searchParams.get('Duration') || 'medium_term'

  if (!timeMachineData || !timeMachineData.items) {
    return <p>No data available</p>;
  }

  const timingMap: Record<string, string> = {
    short_term: 'last 4 weeks ago',
    medium_term: 'last 6 months ago',
    long_term: 'all time',
  };

  const timing = timingMap[duration] || 'Unknown';

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-0">
        {/* <h1 className="text-2xl font-bold mb-4">Your Time Machine</h1> */}
        <p className="mb-6 hidden">Total items available: {timeMachineData.total}</p>
        <CardTitle className="text-md">
          <p className="mb-6 ">
            {duration === 'long_term'
              ? `You're currently looking at your ${timing} top artist`
              : `You're currently looking at your top artist from the ${timing}`}
          </p>
        </CardTitle>
      </CardHeader>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> */}
      <CardContent className="p-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {timeMachineData.items.map((artist) => (
            <div
              key={artist.id}
              className="rounded transition-shadow duration-200"
            >
              {artist.images && artist.images[0] && (
                <Image
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-full mb-2 h-48 object-contain rounded-lg bg-gray-400/10"
                  width={300}
                  height={300}
                />
              )}
              <h3 className="font-medium text-lg">{artist.name}</h3>
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