import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface SearchBarProps {
  onLocationSelect: (location: [number, number]) => void;
  onSearch?: (query: string) => void;
  onConfirmLocation: () => void;
}

export default function SearchBar({
  onLocationSelect,
  onConfirmLocation,
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const handleSearch = async () => {
    // You'll need to implement your search logic here
    // This could be a prop passed from the parent component or something else 
    console.log("Searching for:", searchQuery);

  
    const mockSuggestions = [
      { display_name: "New York", lon: -74.006, lat: 40.7128 },
      { display_name: "London", lon: -0.1276, lat: 51.5074 },
      { display_name: "Tokyo", lon: 139.6917, lat: 35.6892 },
    ];

    setSuggestions(mockSuggestions);
  };

  const handleSelect = (lon: number, lat: number) => {
    onLocationSelect([lon, lat]);
    setSearchQuery("");
    setSuggestions([]);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 -ml-5 z-10 w-96"
      >
        <div className="relative flex">
          <Input
            type="text"
            placeholder="Search for a location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
          <Button onClick={handleSearch} className="ml-2">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute w-full bg-white dark:bg-gray-800 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() =>
                  handleSelect(
                    parseFloat(suggestion.lon),
                    parseFloat(suggestion.lat)
                  )
                }
              >
                {suggestion.display_name}
              </li>
            ))}
          </ul>
        )}
      </motion.div>
      <Button
        onClick={onConfirmLocation}
        className="fixed bottom-6 right-6 z-10 bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        Confirm Location
      </Button>
    </>
  );
}
