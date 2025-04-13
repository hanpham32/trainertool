import * as fs from "fs";
import * as path from "path";
import fetch from "node-fetch";

// Define interfaces for the API response
interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  is_default: boolean;
  order: number;
  // There are more fields in the actual API response, but we're only focusing on these
}

interface PokemonNames {
  pokemon_names: string[];
}

function readExistingNames(filePath: string): string[] {
  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, "utf8");
      const jsonData = JSON.parse(fileData) as PokemonNames;
      console.log(
        `Found existing file with ${jsonData.pokemon_names.length} Pokémon names`,
      );
      return jsonData.pokemon_names;
    }
  } catch (error) {
    console.error(`Error reading existing file: ${error}`);
  }
  return [];
}

function getHighestExistingId(names: string[]): number {
  // If we have no names, start from ID 1
  if (names.length === 0) {
    return 0;
  }

  return names.length;
}

async function fetchPokemon(id: number): Promise<Pokemon | null> {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);

    if (!response.ok) {
      console.error(`Failed to fetch Pokémon #${id}: ${response.statusText}`);
      return null;
    }

    return (await response.json()) as Pokemon;
  } catch (error) {
    console.error(`Error fetching Pokémon #${id}:`, error);
    throw error;
  }
}

async function fetchAllPokemon(
  startId: number,
  endId: number,
): Promise<string[]> {
  const pokemonNames: string[] = [];

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  console.log(`Fetching Pokémon data from #${startId} to #${endId}...`);

  for (let id = startId; id <= endId; id++) {
    process.stdout.write(`Fetching Pokémon #${id}... `);

    const pokemon = await fetchPokemon(id);

    if (pokemon) {
      pokemonNames.push(pokemon.name);
      process.stdout.write(`Found: ${pokemon.name}\n`);
    } else {
      process.stdout.write("Not found\n");
    }

    await delay(200);
  }

  return pokemonNames;
}

async function main() {
  try {
    const outputDir = path.join(__dirname, "data");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const outputPath = path.join(outputDir, "pokemon-names.json");

    // Read existing names if file exists
    const existingNames = readExistingNames(outputPath);
    const highestId = getHighestExistingId(existingNames);

    const startId = highestId + 1;
    const endId = startId + 573;

    // Skip fetching if we already have everything
    if (startId > endId) {
      console.log(
        "Already have all the requested Pokémon. No need to fetch again.",
      );
      return;
    }

    // Fetch new Pokémon
    const newPokemonNames = await fetchAllPokemon(startId, endId);

    // Combine existing and new names
    const allPokemonNames = [...existingNames, ...newPokemonNames];

    // Write the combined names to file
    fs.writeFileSync(
      outputPath,
      JSON.stringify({ pokemon_names: allPokemonNames }, null, 2),
    );

    console.log(
      `\nSuccess! Wrote ${allPokemonNames.length} Pokémon names to ${outputPath}`,
    );
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Run the program
main();
