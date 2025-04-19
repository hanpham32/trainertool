"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PokemonTypeString } from "@/utils/PokemonType";
import { PokemonType } from "@/utils/PokemonType";
import { MyPokedex } from "@/utils/MyPokedex";
import SearchBar from "@/components/SearchBar";
import PokeMMOSwitch from "@/components/PokeMMOSwitch";
import { useSearch } from "@/contexts/SearchContext";
import { Pokemon } from "pokedex-promise-v2";
import { PokemonCarousel } from "@/components/PokemonCarousel";
import EffortBadge from "@/components/EffortBadge";
import { RotateCcw } from "lucide-react";
import TypeEffectivenessDisplay from "@/components/TypeEffectivenessDisplay";

const statNameMap = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Attack",
  "special-defense": "Sp. Defense",
  speed: "Speed",
};

export default function Home() {
  const myPokedex = new MyPokedex();
  const { searchTerm, setSearchTerm } = useSearch();
  const [currentTypes, setSelectedTypes] = useState<PokemonTypeString[]>([]);
  const pokemonTypeInfo = PokemonType.getInstance();
  const [pokemonJson, setPokemonJson] = useState<Pokemon>(null);
  const [pokemonImages, setPokemonImages] = useState<string[]>([]);
  const [evYields, setEvYields] = useState(null);

  useEffect(() => {
    async function searchPokemon(name) {
      if (!name) return;
      try {
        const pokemon = await myPokedex.getPokemonByName(name);
        if (!pokemon) {
          resetPokemonData();
          return;
        }
        const [imageUrls, types, yields] = await Promise.all([
          myPokedex.getAllImages(pokemon),
          myPokedex.getPokemonTypes(pokemon),
          myPokedex.getEVYield(pokemon),
        ]);

        setSelectedTypes(types);
        setEvYields(yields);
        setPokemonImages(imageUrls);
        setPokemonJson(pokemon);
      } catch (error) {
        console.error("Failed to fetch Pokemon:", error);
        setPokemonImages([]);
        setPokemonJson(null);
        setSelectedTypes([]);
      }
    }
    searchPokemon(searchTerm);
  }, [searchTerm]);

  const pokemonTypes: PokemonTypeString[] = [
    "bug",
    "dark",
    "dragon",
    "electric",
    "fairy",
    "fighting",
    "fire",
    "flying",
    "ghost",
    "grass",
    "ground",
    "ice",
    "normal",
    "poison",
    "psychic",
    "rock",
    "steel",
    "water",
  ];

  const getNewTypeSelection = (currentTypes, clickedType) => {
    if (currentTypes.includes(clickedType)) {
      return currentTypes.filter((t) => t !== clickedType);
    } else if (currentTypes.length < 2) {
      return [...currentTypes, clickedType];
    } else {
      return [currentTypes[1], clickedType];
    }
  };

  // TODO handles manual selection of types
  const handleTypeSelection = (type: PokemonTypeString) => {
    if (searchTerm) {
      setSearchTerm("");
      setPokemonJson(null);
    }
    setSelectedTypes(getNewTypeSelection(currentTypes, type));
  };

  const resetPokemonData = () => {
    setPokemonImages([]);
    setPokemonJson(null);
    setEvYields(null);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    resetPokemonData();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center">
        <SearchBar />
        <RotateCcw
          className="mx-4 hover:cursor-pointer"
          onClick={handleReset}
        />
      </div>
      {pokemonImages.length > 0 ? (
        <PokemonCarousel imageUrls={pokemonImages} />
      ) : (
        searchTerm && <p>No images found</p>
      )}
      {pokemonJson && (
        <div>
          <h1 className="text-3xl font-bold mb-6">{pokemonJson.name}</h1>
        </div>
      )}
      {evYields && (
        <div className="flex flex-wrap gap-2 mt-3">
          <h1 className="w-full text-3xl font-bold">EV Yields:</h1>
          {Object.entries(evYields).map(([statName, effortValue]) => {
            if ((effortValue as number) >= 1) {
              return (
                <EffortBadge
                  key={statName}
                  type={statNameMap[statName]}
                  value={effortValue as number}
                />
              );
            }
            return null;
          })}
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Pokemon Type Icons</h1>
      <div className="w-1/2 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 p-2">
        {pokemonTypes.map((type) => (
          <div
            key={type}
            className={`m-1 flex flex-col items-center p-0 rounded-lg transition-all duration-200 ${
              currentTypes.includes(type) ? "bg-gray-200" : "hover:bg-gray-50"
            }`}
            onClick={() => handleTypeSelection(type)}
          >
            <Image
              src={`/icons/${type}.svg`}
              alt={`${type} type`}
              width={54}
              height={54}
              className="transform transition-transform hover:scale-105 cursor-pointer mt-1"
            />
            <span className="mt-2">{type}</span>
          </div>
        ))}
      </div>
      {currentTypes.length > 0 && (
        <TypeEffectivenessDisplay selectedTypes={currentTypes} />
      )}
    </div>
  );
}
