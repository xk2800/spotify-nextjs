import { TimeRangeSelectorProps } from "@/types/types";
import { Badge } from "./ui/badge";

/**
 * TimeRangeSelector Component
 * 
 * A component that renders a set of interactive badges for selecting different time ranges.
 * The currently selected range is highlighted with different styling.
 * 
 * @param {TimeRangeSelectorProps} props - Component props
 * @param {string} props.currentRange - The currently selected range ID
 * @param {Array<{id: string, label: string}>} props.ranges - Array of available time ranges
 * @param {(rangeId: string) => void} props.onChange - Callback function when a range is selected
 * 
 * @returns {JSX.Element} A flex container with selectable badge elements
**/
const TimeRangeSelector = ({ currentRange, ranges, onChange }: TimeRangeSelectorProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-8">
      {ranges.map(range => (
        <Badge
          key={range.id}
          className={`px-4 py-2 cursor-pointer ${currentRange === range.id
            ? 'bg-primary font-bold' // Styling for the active/selected range
            : 'bg-gray-600 hover:bg-secondary hover:ring-2 hover:ring-primary text-white hover:text-black' // Styling for inactive ranges
            }`}
          onClick={() => onChange(range.id)}
        >
          {range.label}
        </Badge>
      ))}
    </div>
  );
};

export default TimeRangeSelector;