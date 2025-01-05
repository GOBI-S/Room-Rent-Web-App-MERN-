import axios from "axios";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface LocationcomponentProps {
  onChange: (location: string) => void;
}

const Locationcomponent: React.FC<LocationcomponentProps> = ({ onChange }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );

      if (response.data) {
        setSuggestions(response.data);
        setError(null);
      }
    } catch (err) {
      setError("Error fetching location data.");
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
  };
  

  const handleSuggestionClick = (suggestion: any) => {
    setInputValue(suggestion.display_name);
    setSuggestions([]);
    onChange(suggestion.display_name); // Call onChange with the selected location
  };

  return (
    <div style={{ width: "300px", margin: "0 auto" }}>
      <Input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter a location"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}

      {suggestions.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            marginTop: "5px",
            maxHeight: "200px",
            overflowY: "auto",
            position: "absolute",
            width: "300px",
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: "8px",
                cursor: "pointer",
                borderBottom: "1px solid #eee",
              }}
            >
              {suggestion.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Locationcomponent;
