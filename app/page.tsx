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

export default function Home() {
  const myPokedex = new MyPokedex();
  const { searchTerm, setSearchTerm } = useSearch();
  const [selectedTypes, setSelectedTypes] = useState<PokemonTypeString[]>([]);
  const pokemonTypeInfo = PokemonType.getInstance();
  const [pokemonJson, setPokemonJson] = useState<Pokemon>(null);

  useEffect(() => {
    async function searchPokemon(searchTerm) {
      if (searchTerm) {
        try {
          const response = await myPokedex.getPokemonByName(searchTerm);
          setPokemonJson(response);
          console.log(response);
        } catch (error) {
          console.error("Failed to fetch Pokemon:", error);
        }
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

  const toggleTypeSelection = (type: PokemonTypeString) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter((t) => t !== type));
    } else if (selectedTypes.length < 2) {
      setSelectedTypes([...selectedTypes, type]);
    } else {
      setSelectedTypes([selectedTypes[1], type]);
    }
  };

  // TODO handles manual selection of types
  const handleManualTypeSelection = (type: PokemonTypeString) => {
    if (searchTerm) {
      setSearchTerm("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <SearchBar />
      {pokemonJson && (
        <div>
          <Image
            src={pokemonJson.sprites.other["official-artwork"].front_default}
            alt={`${pokemonJson.name} photo`}
            height={200}
            width={200}
          />
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Pokemon Type Icons</h1>
      <div className="w-1/2 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
        {pokemonTypes.map((type) => (
          <div
            key={type}
            className={`flex flex-col items-center p-0 rounded-lg transition-all duration-200 ${
              selectedTypes.includes(type) ? "bg-blue-100" : "hover:bg-gray-50"
            }`}
            onClick={() => toggleTypeSelection(type)}
          >
            <Image
              src={`/icons/${type}.svg`}
              alt={`${type} type`}
              width={54}
              height={54}
              className="transform transition-transform hover:scale-105 cursor-pointer"
            />
            <span className="mt-2">{type}</span>
          </div>
        ))}
      </div>
      {selectedTypes && (
        <div>
          <h1 className="text-3xl font-bold mb-6">Weakness</h1>
          <div className="flex">
            {(() => {
              const weaknesses = new Set<PokemonTypeString>();

              selectedTypes.forEach((type) => {
                pokemonTypeInfo.getWeaknesses(type).forEach((weakness) => {
                  weaknesses.add(weakness);
                });
              });

              return Array.from(weaknesses).map((t) => (
                <div key={t} className="flex flex-col items-center mr-2">
                  <Image
                    src={`/icons/${t}.svg`}
                    alt={`${t} type`}
                    width={54}
                    height={54}
                  />
                  <span className="mt-2">{t}</span>
                </div>
              ));
            })()}
          </div>
          <h1 className="text-3xl font-bold mb-6">Resistance</h1>
          <div className="flex">
            {(() => {
              const resistances = new Set<PokemonTypeString>();

              selectedTypes.forEach((type) => {
                pokemonTypeInfo.getResistances(type).forEach((resistance) => {
                  resistances.add(resistance);
                });
              });

              return Array.from(resistances).map((t) => (
                <div key={t} className="flex flex-col items-center mr-2">
                  <Image
                    src={`/icons/${t}.svg`}
                    alt={`${t} type`}
                    width={54}
                    height={54}
                  />
                  <span className="mt-2">{t}</span>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
