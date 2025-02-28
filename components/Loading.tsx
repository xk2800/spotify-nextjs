import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex gap-4">
      <LoaderCircle className="animate-spin size-6" />
      <div className="flex">Loading content from Spotify. Pls
        <div className="animate-spin">WAIT!</div>
      </div>
    </div>
  );
}

export default Loading;