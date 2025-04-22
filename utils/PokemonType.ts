export const pokemonTypes: PokemonTypeString[] = [
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

export type PokemonTypeString =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "grass"
  | "ground"
  | "ice"
  | "normal"
  | "poison"
  | "psychic"
  | "rock"
  | "steel"
  | "water";

interface TypeEffectiveness {
  weaknesses: PokemonTypeString[];
  resistances: PokemonTypeString[];
  immunities: PokemonTypeString[];
}

const typeChart: Record<PokemonTypeString, TypeEffectiveness> = {
  normal: {
    weaknesses: ["fighting"],
    resistances: [],
    immunities: ["ghost"],
  },
  fire: {
    weaknesses: ["water", "ground", "rock"],
    resistances: ["fire", "grass", "ice", "bug", "steel", "fairy"],
    immunities: [],
  },
  water: {
    weaknesses: ["electric", "grass"],
    resistances: ["fire", "water", "ice", "steel"],
    immunities: [],
  },
  electric: {
    weaknesses: ["ground"],
    resistances: ["electric", "flying", "steel"],
    immunities: [],
  },
  grass: {
    weaknesses: ["fire", "ice", "poison", "flying", "bug"],
    resistances: ["water", "electric", "grass", "ground"],
    immunities: [],
  },
  ice: {
    weaknesses: ["fire", "fighting", "rock", "steel"],
    resistances: ["ice"],
    immunities: [],
  },
  fighting: {
    weaknesses: ["flying", "psychic", "fairy"],
    resistances: ["bug", "rock", "dark"],
    immunities: [],
  },
  poison: {
    weaknesses: ["ground", "psychic"],
    resistances: ["grass", "fighting", "poison", "bug", "fairy"],
    immunities: [],
  },
  ground: {
    weaknesses: ["water", "grass", "ice"],
    resistances: ["poison", "rock"],
    immunities: ["electric"],
  },
  flying: {
    weaknesses: ["electric", "ice", "rock"],
    resistances: ["grass", "fighting", "bug"],
    immunities: ["ground"],
  },
  psychic: {
    weaknesses: ["bug", "ghost", "dark"],
    resistances: ["fighting", "psychic"],
    immunities: [],
  },
  bug: {
    weaknesses: ["fire", "flying", "rock"],
    resistances: ["grass", "fighting", "ground"],
    immunities: [],
  },
  rock: {
    weaknesses: ["water", "grass", "fighting", "ground", "steel"],
    resistances: ["normal", "fire", "poison", "flying"],
    immunities: [],
  },
  ghost: {
    weaknesses: ["ghost", "dark"],
    resistances: ["poison", "bug"],
    immunities: ["normal", "fighting"],
  },
  dragon: {
    weaknesses: ["ice", "dragon", "fairy"],
    resistances: ["fire", "water", "electric", "grass"],
    immunities: [],
  },
  dark: {
    weaknesses: ["fighting", "bug", "fairy"],
    resistances: ["ghost", "dark"],
    immunities: ["psychic"],
  },
  steel: {
    weaknesses: ["fire", "fighting", "ground"],
    resistances: [
      "normal",
      "grass",
      "ice",
      "flying",
      "psychic",
      "bug",
      "rock",
      "dragon",
      "steel",
      "fairy",
    ],
    immunities: ["poison"],
  },
  fairy: {
    weaknesses: ["poison", "steel"],
    resistances: ["fighting", "bug", "dark"],
    immunities: ["dragon"],
  },
};

export class PokemonType {
  private static instance: PokemonType;
  private typeData: Record<PokemonTypeString, TypeEffectiveness>;

  private constructor() {
    this.typeData = typeChart;
  }

  public static getInstance(): PokemonType {
    if (!PokemonType.instance) {
      PokemonType.instance = new PokemonType();
    }
    return PokemonType.instance;
  }

  public getWeaknesses(type: PokemonTypeString): PokemonTypeString[] {
    return this.typeData[type].weaknesses;
  }

  public getResistances(type: PokemonTypeString): PokemonTypeString[] {
    return this.typeData[type].resistances;
  }

  public getImmunities(type: PokemonTypeString): PokemonTypeString[] {
    return this.typeData[type].immunities;
  }

  public getEffectiveness(
    types: PokemonTypeString[],
  ): Record<PokemonTypeString, number> {
    const result: Record<PokemonTypeString, number> = {
      normal: 1,
      fire: 1,
      water: 1,
      electric: 1,
      grass: 1,
      ice: 1,
      fighting: 1,
      poison: 1,
      ground: 1,
      flying: 1,
      psychic: 1,
      bug: 1,
      rock: 1,
      ghost: 1,
      dragon: 1,
      dark: 1,
      steel: 1,
      fairy: 1,
    };

    for (const defenderType of types) {
      const matchups = typeChart[defenderType];

      for (const weakType of matchups.weaknesses) {
        result[weakType] *= 2
      }
      for (const resistType of matchups.resistances) {
        result[resistType] *= 0.5
      }
      for (const immuneType of matchups.immunities) {
        result[immuneType] *= 0
      }
    }

    return result;
  }
}
