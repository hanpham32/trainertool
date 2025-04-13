import Pokedex from 'pokedex-promise-v2';

export class MyPokedex {
  public static P = new Pokedex();

  // See https://pokeapi.co/ for api reference
  public async getPokemonByName(name_) {
    try {
      const pokemon_ = await MyPokedex.P.getPokemonByName(name_);
      console.log(pokemon_)
      return pokemon_
    } catch (error) {
      throw error
    }
  }
  
  public async getPokemonTypes(id_) {
    try {
      const pokemon_ = await MyPokedex.P.getPokemonByName(id_);
      const typeNames_ = pokemon_.types.map(typeInfo => typeInfo.type.name)
      console.log("The pokemon type is:", typeNames_)
      return typeNames_
    } catch (error) {
      throw error
    }
  }

  public async getPokemonCharacteristics(id_) {
    try {
      const pokemon_ = await MyPokedex.P.getCharacteristicById(id_);
      return pokemon_
    } catch (error) {
      throw error;
    }
  }
}
