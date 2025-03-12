import Image from "next/image";

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
  if (!timeMachineData || !timeMachineData.items) {
    return <p>No data available</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Your Time Machine</h1>
      <p className="mb-6">Total items available: {timeMachineData.total}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {timeMachineData.items.map((artist) => (
          <div
            key={artist.id}
            className="p-4 border rounded shadow hover:shadow-md transition-shadow duration-200"
          >
            {artist.images && artist.images[0] && (
              <Image
                src={artist.images[0].url}
                alt={artist.name}
                className="w-full object-cover rounded mb-2"
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
    </div>
  );
}

export default TimeMachine;