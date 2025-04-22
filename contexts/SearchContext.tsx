"use client";

import { createContext, useContext, useState, useMemo } from "react";
import { PokemonTypeString, pokemonTypes } from "@/utils/PokemonType";
import { usePathname, useRouter } from "next/navigation";

interface SearchContextType {
  searchTerm: string;
  currentTypes: PokemonTypeString[];
  goToPokemon: (name: string) => void;
  goToTypes: (types: PokemonTypeString[]) => void;
  reset: () => void;
}

const SearchContext = createContext<SearchContextType>({
  searchTerm: "",
  currentTypes: [],
  goToPokemon: () => { },
  goToTypes: () => { },
  reset: () => { },
});

export const SearchContextProvider = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();

  const computeStateFromPath = (
    path: string,
  ): { searchTerm: string; currentTypes: PokemonTypeString[] } => {
    if (path.startsWith("/pokemon/")) {
      const slug = decodeURIComponent(path.split("/pokemon/")[1]);
      return { searchTerm: slug, currentTypes: [] };
    } else if (path.startsWith("/types/")) {
      const typeSlug = path.split("/types/")[1];
      if (typeSlug) {
        const typesArray = typeSlug
          .split("+")
          .filter((type) =>
            pokemonTypes.includes(type as PokemonTypeString),
          ) as PokemonTypeString[];
        return { searchTerm: "", currentTypes: typesArray };
      }
    }
    return { searchTerm: "", currentTypes: [] };
  };

  const { searchTerm, currentTypes } = useMemo(
    () => computeStateFromPath(pathName),
    [pathName],
  );

  const goToPokemon = (name: string) => {
    console.log("I'm retrieving a pokemon...");
    if (!name) return;
    router.push(`/pokemon/${encodeURIComponent(name.toLowerCase())}`);
  };

  const reset = () => {
    router.push("/");
  };

  const goToTypes = (types: PokemonTypeString[]) => {
    if (!types.length) return router.push("/");
    router.push(`/types/${types.join("+")}`);
  };
  return (
    <SearchContext.Provider
      value={{ searchTerm, currentTypes, goToPokemon, goToTypes, reset }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
