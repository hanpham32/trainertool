"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { PokemonTypeString } from "@/utils/PokemonType";
import { MyPokedex } from "@/utils/MyPokedex";
import SearchBar from "@/components/SearchBar";
import PokeMMOSwitch from "@/components/PokeMMOSwitch";
import { useSearch } from "@/contexts/SearchContext";
import { Pokemon } from "pokedex-promise-v2";
import { PokemonCarousel } from "@/components/PokemonCarousel";
import EffortBadge from "@/components/EffortBadge";
import { RotateCcw, Type } from "lucide-react";
import TypeEffectivenessDisplay from "@/components/TypeEffectivenessDisplay";
import { pokemonTypes } from "@/utils/PokemonType";

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
  const { searchTerm, currentTypes, goToTypes, reset } = useSearch();
  const [pokemonJson, setPokemonJson] = useState<Pokemon>(null);
  const [pokemonImages, setPokemonImages] = useState<string[]>([]);
  const [evYields, setEvYields] = useState(null);
  const [pokemonDataTypes, setPokemonDataTypes] = useState<PokemonTypeString[]>([]);
  const isOnPokemonPage = !!searchTerm;
  const activeTypes = isOnPokemonPage ? pokemonDataTypes : currentTypes;


  useEffect(() => {
    async function searchPokemon(name: string) {
      if (!name) {
        setPokemonJson(null);
        setPokemonImages([]);
        setEvYields(null);
        setPokemonDataTypes([]);
        return;
      }
      try {
        const pokemon = await myPokedex.getPokemonByName(name);
        if (!pokemon) return;
        const [imageUrls, types, yields] = await Promise.all([
          myPokedex.getAllImages(pokemon),
          myPokedex.getPokemonTypes(pokemon),
          myPokedex.getEVYield(pokemon),
        ]);
        setPokemonJson(pokemon);
        setPokemonImages(imageUrls);
        setEvYields(yields);
        setPokemonDataTypes(types);
      } catch (error) {
        setPokemonJson(null);
        setPokemonImages([]);
        setEvYields(null);
        setPokemonDataTypes([]);
      }
    }
    searchPokemon(searchTerm);
  }, [searchTerm]);

  const getNewTypeSelection = (currentTypes, clickedType): PokemonTypeString[] => {
    if (currentTypes.includes(clickedType)) {
      return currentTypes.filter((t: PokemonTypeString) => t !== clickedType);
    } else if (currentTypes.length < 2) {
      return [...currentTypes, clickedType];
    } else {
      return [currentTypes[1], clickedType];
    }
  };

  const handleTypeSelection = (type: PokemonTypeString) => {
    if (isOnPokemonPage) {
      // clear pokemon ui
      setPokemonJson(null);
      setPokemonImages([]);
      setEvYields(null);
      setPokemonDataTypes([]);
      goToTypes([type]);
    } else {
      let newTypes: PokemonTypeString[];
      if (currentTypes.includes(type)) {
        newTypes = currentTypes.filter(t => t !== type);
      } else if (currentTypes.length < 2){
        newTypes = [...currentTypes, type];
      }
      goToTypes(newTypes);
    }
  };

  const handleReset = () => {
    setPokemonImages([]);
    setPokemonJson(null);
    setEvYields(null);
    setPokemonDataTypes([]);
    reset();
  };

  return (
    <div className="container mx-auto p-4">
      <div
        className={`${pokemonImages.length > 0 ? "lg:flex" : "flex flex-col items-center"}`}
      >
        <div
          className={`${pokemonImages.length > 0 ? "w-full md:w-1/2" : "w-full"} flex flex-col items-center`}
        >
          <div className="flex items-center">
            <SearchBar />
            <RotateCcw
              className="mx-4 hover:cursor-pointer"
              onClick={handleReset}
            />
          </div>

          {pokemonImages.length > 0 && <div className="h-5"></div>}

          {/* Pokemon information section */}
          {pokemonImages.length > 0 ? (
            <PokemonCarousel imageUrls={pokemonImages} />
          ) : (
            searchTerm && <p>No images found</p>
          )}

          {pokemonJson && (
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-6">
                {pokemonJson.name.charAt(0).toUpperCase() +
                  pokemonJson.name.slice(1)}
              </h1>
            </div>
          )}

          {evYields && (
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              <h1 className="w-full text-2xl font-bold text-center">
                EV Yields:
              </h1>
              <div className="flex flex-wrap justify-center gap-2">
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
            </div>
          )}
        </div>

        <div
          className={`${pokemonImages.length > 0 ? "w-full md:w-1/2" : "w-full max-w-2xl"} md:pr-4`}
        >
          {/* Pokemon types section */}
          <h1 className="text-3xl charizardfont-bold mb-3 text-center">Pokemon Type</h1>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 p-2">
            {pokemonTypes.map((type) => (
              <div
                key={type}
                className={`m-1 flex flex-col items-center p-0 rounded-lg transition-all duration-200 ${activeTypes.includes(type)
                  ? "bg-gray-200"
                  : "hover:bg-gray-50"
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
          {!isOnPokemonPage && currentTypes.length > 0 && (
            <TypeEffectivenessDisplay selectedTypes={currentTypes as PokemonTypeString[]} />
          )}
          {isOnPokemonPage && pokemonDataTypes.length > 0 && (
            <TypeEffectivenessDisplay selectedTypes={pokemonDataTypes as PokemonTypeString[]} />
          )}
        </div>
      </div>
    </div>
  );
}
