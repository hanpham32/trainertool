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
