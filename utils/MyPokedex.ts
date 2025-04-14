import Pokedex, { Pokemon } from "pokedex-promise-v2";
import { PokemonTypeString } from "./PokemonType";

export class MyPokedex {
  public static P = new Pokedex();

  // See https://pokeapi.co/ for api reference
  public async getPokemonByName(name_) {
    try {
      const pokemon_ = await MyPokedex.P.getPokemonByName(name_);
      return pokemon_;
    } catch (error) {
      throw error;
    }
  }

  public async getAllImages(pokemon: Pokemon) {
    try {
      const imageUrls: string[] = [];

      // Helper function to recursively extract all URLs from the sprites object
      const extractUrls = (obj: any) => {
        if (!obj) return;

        if (typeof obj === "string" && obj.startsWith("http")) {
          imageUrls.push(obj);
        } else if (typeof obj === "object") {
          for (const key in obj) {
            extractUrls(obj[key]);
          }
        }
      };

      // Start extracting from the sprites object
      extractUrls(pokemon.sprites);

      // Return array of all image URLs
      return imageUrls;
    } catch (error) {
      throw error;
    }
  }

  public async getEVYield(pokemon: Pokemon) {
    try {
      const evYield: { [statName: string]: number } = {};
      for (const stat of pokemon.stats) {
        evYield[stat.stat.name] = stat.effort;
      }
      return evYield;
    } catch (error) {
      throw error;
    }
  }

  public async getPokemonTypes(pokemon: Pokemon): Promise<PokemonTypeString[]> {
    try {
      const typeNames_ = pokemon.types.map((typeInfo) => typeInfo.type.name);
      return typeNames_ as PokemonTypeString[];
    } catch (error) {
      throw error;
    }
  }
}
