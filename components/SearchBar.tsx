"use client"
import { useSearch } from "@/contexts/SearchContext";
import { Input } from "./ui/input";
import { useEffect, useState, useRef } from "react";

export default function SearchBar() {
  const [pokemonNames, setPokemonNames] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const {searchTerm, setSearchTerm} = useSearch();  // the finalized search term
  const [currentSearchTerm, setCurrentSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const suggestionRef = useRef(null);

  // handles fetch pokemon from JSON file
  useEffect(() => {
    const fetchPokemonNames = async () => {
      try {
        const response = await fetch('/data/pokemon-names.json');
        if (!response.ok) {
          throw new Error("Failed to fetch pokemon names");
        }
        const data = await response.json();
        const names = data.pokemon_names || [];
        setPokemonNames(names);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    fetchPokemonNames();
  }, []);

  // handles closing suggestion dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // TODO filters suggestion based on input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentSearchTerm(value);
    if (value.trim()) {
      const filteredSuggestions = pokemonNames
        .filter(name => name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  // TODO helper function to capitalize first character
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // TODO handles select a suggestion
  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
  }

  // TODO handles key navigation in suggestions
  const handleKeyDown = (e) => {
    const { key } = e;
    if (key === 'Escape') {
      setShowSuggestions(false);
    }
    if (key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  }

  // handles search when user hits "Enter" or Search icon
  const handleSearch = () => {
    if (currentSearchTerm.trim()) {
      setSearchTerm(currentSearchTerm.trim());
      setShowSuggestions(false);
    }
  }

  return (
    <div className="relative w-1/3 my-4">
      <div className="flex items-center p-2 bg-white rounded-lg shadow">
        <Input
          type="text"
          placeholder={isLoading ? "loading ..." : "search for a pokemon"}
          className="flex-1 text-gray-900 bg-transparent border-none focus:ring-0 mr-2"
          value={currentSearchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => currentSearchTerm.trim() && suggestions.length > 0 && setShowSuggestions(true)}
          disabled={isLoading}
        />
        <div onClick={handleSearch} className="cursor-pointer">
          <SearchIcon className="text-gray-500" />
        </div>
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div ref={suggestionRef} className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-900"
              >
                {capitalizeFirstLetter(suggestion)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
