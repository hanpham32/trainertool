import React from "react";
import Image from "next/image";
import { PokemonTypeString } from "@/utils/PokemonType";
import { PokemonType } from "@/utils/PokemonType";

// Type definitions for props and effectiveness results
type TypeWithMultiplier = {
  type: string;
  multiplier: number;
};

type TypeEffectivenessDisplayProps = {
  selectedTypes: PokemonTypeString[];
};

const TypeEffectivenessDisplay = ({
  selectedTypes,
}: TypeEffectivenessDisplayProps) => {
  const pokemonTypeInfo = PokemonType.getInstance();

  const calculateEffectiveness = (types: PokemonTypeString[]) => {
    const effectiveness = pokemonTypeInfo.getEffectiveness(types);

    const result = {
      weaknesses: [] as TypeWithMultiplier[],
      resistances: [] as TypeWithMultiplier[],
      immunes: [] as TypeWithMultiplier[],
    };

    for (const type in effectiveness) {
      const multiplier = effectiveness[type];

      if (multiplier > 1) {
        result.weaknesses.push({ type, multiplier });
      } else if (multiplier < 1 && multiplier > 0) {
        result.resistances.push({ type, multiplier });
      } else if (multiplier === 0) {
        result.immunes.push({ type, multiplier });
      }
    }

    // Sort weaknesses by multiplier (highest first)
    result.weaknesses.sort((a, b) => b.multiplier - a.multiplier);

    return result;
  };

  const { weaknesses, resistances, immunes } =
    calculateEffectiveness(selectedTypes);

  const TypeIcon = ({ typeInfo }: { typeInfo: TypeWithMultiplier }) => (
    <div className="flex flex-col items-center text-center w-20">
      <Image
        src={`/icons/${typeInfo.type}.svg`}
        alt={`${typeInfo.type} type`}
        width={54}
        height={54}
      />
      <span className="block mt-2">
        {typeInfo.type}
        {typeInfo.multiplier !== 0 ? `: x${typeInfo.multiplier}` : ""}
      </span>
    </div>
  );

  const TypeSection = ({
    title,
    types,
  }: {
    title: string;
    types: TypeWithMultiplier[];
  }) => (
    <>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="flex flex-wrap">
        {types.length > 0 ? (
          types.map((typeInfo, index) => (
            <TypeIcon key={index} typeInfo={typeInfo} />
          ))
        ) : (
          <p>No {title.toLowerCase()} found</p>
        )}
      </div>
    </>
  );

  return (
    <div>
      <TypeSection title="Weakness" types={weaknesses} />
      <TypeSection title="Resistance" types={resistances} />
      <TypeSection title="Immune" types={immunes} />
    </div>
  );
};

export default TypeEffectivenessDisplay;
