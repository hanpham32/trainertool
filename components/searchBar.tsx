"use client"
import { Input } from "./ui/input";
import { useEffect, useState, useRef } from "react";

export default function SearchBar() {
  const [pokemonNames, setPokemonNames] = useState([]);
  const suggestionRef = useRef(null);
  const [showSugesstions, setShowSuggestions] = useState(false);

  // handles fetch pokemon from JSON file
  useEffect(() => {
    const fetchPokemonNames = async () => {
      try {
        const response = await fetch('../data/pokemon-names.json');
        if (!response.ok) {
          throw new Error("Failed to fetch pokemon names");
        }
        const data = await response.json();
        const names = data.pokemon_names || [];
        setPokemonNames(names);
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

  // TODO helper function to capitalize first character

  // TODO handles select a suggestion

  // TODO handles key navigation in suggestions

  return (
    <div className="flex items-center p-2 bg-white dark:bg-gray-800 rounded-lg shadow w-1/3">
      <Input
        type="text"
        placeholder="Pokemon name..."
        className="flex-1 text-gray-900 dark:text-white bg-transparent border-none focus:ring-0 mr-2"
      />
      <SearchIcon className="text-gray-500 dark:text-gray-400" />
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
