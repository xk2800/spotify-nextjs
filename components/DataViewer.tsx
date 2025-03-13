import { DataItem, DataViewerProps } from "@/types/types";

/**
 * DataViewer Component
 * 
 * A generic component that handles rendering collections of data items.
 * This component delegates the actual rendering logic to a render prop function,
 * allowing for maximum flexibility in how data is displayed.
 * 
 * @template T - The type of data items to be rendered (must extend DataItem)
 * 
 * @param {DataViewerProps<T>} props - Component props
 * @param {object} props.data - The data object containing items to render
 * @param {T[]} props.data.items - Array of items to be rendered
 * @param {(items: T[]) => JSX.Element} props.renderItems - Function that defines how to render the items
 * 
 * @returns {JSX.Element} Either the rendered items or a "No data available" message
**/
const DataViewer = <T extends DataItem>({
  data,
  renderItems
}: DataViewerProps<T>) => {
  // Show fallback message if no data is provided
  if (!data) return <p>No data available</p>;

  // Use the provided renderItems function to render the data items
  return renderItems(data.items);
};

export default DataViewer;