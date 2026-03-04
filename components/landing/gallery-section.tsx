"use client"

import { useState } from "react"
import Image from "next/image"

const galleryImages = [
  {
    src: "/images/gallery-1.jpg",
    alt: "Board game night with friends playing strategy games",
    height: "h-64",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Close-up of a complex board game being set up",
    height: "h-80",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Club tournament with players competing at tables",
    height: "h-72",
  },
  {
    src: "/images/gallery-4.jpg",
    alt: "Shelves filled with board game collection",
    height: "h-80",
  },
  {
    src: "/images/gallery-5.jpg",
    alt: "Game night event with neon lighting",
    height: "h-64",
  },
  {
    src: "/images/gallery-6.jpg",
    alt: "Players laughing during a party game",
    height: "h-72",
  },
]

export function GallerySection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="gallery" className="relative px-4 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-5xl">
            Game Night <span className="text-neon-red text-glow-red">Moments</span>
          </h2>
          <p className="mx-auto max-w-2xl text-pretty text-muted-foreground">
            A glimpse into our sessions. Every game night brings new stories, rivalries, and inside jokes.
          </p>
        </div>

        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className={`relative mb-4 overflow-hidden rounded-xl border border-border/60 transition-all duration-300 ${image.height} ${
                hoveredIndex === index
                  ? "neon-glow-red border-neon-red/40 scale-[1.02]"
                  : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay on hover */}
              <div
                className={`absolute inset-0 flex items-end bg-gradient-to-t from-background/80 via-transparent to-transparent p-4 transition-opacity duration-300 ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="text-sm text-foreground font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
