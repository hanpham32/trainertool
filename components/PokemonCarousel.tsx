import * as React from "react"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface PokemonCarouselProps {
  imageUrls: string[]
}

export function PokemonCarousel({imageUrls}: PokemonCarouselProps) {
  return (
    <Carousel className="w-full max-w-xs my-4" opts={{loop:false, startIndex: 4}}>
      <CarouselContent>
        {imageUrls.map((imageUrl, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-2">
                  <div className="relative w-full h-full">
                    <Image
                      src={imageUrl}
                      alt={`Pokemon image ${index + 1}`}
                      className="object-contain"
                      fill
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
