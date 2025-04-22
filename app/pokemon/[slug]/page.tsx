import Home from "@/app/page";

export default function PokemonPage({params}: {params: Promise<{slug: string}>}) {
  return <Home />
}

