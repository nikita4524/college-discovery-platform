"use client";

import Image from "next/image";
import { useState } from "react";

interface CollegeImageProps {
  src: string | null | undefined;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackClassName?: string;
}

function getFallbackLabel(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export default function CollegeImage({
  src,
  alt,
  fill = true,
  className = "object-cover",
  sizes = "(max-width:768px) 100vw, 33vw",
  priority = false,
  fallbackClassName,
}: CollegeImageProps) {
  const [error, setError] = useState(false);
  const showFallback = !src || error;

  if (showFallback) {
    return (
      <div
        className={
          fallbackClassName ??
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700"
        }
      >
        <span className="text-4xl font-bold text-white/90 sm:text-5xl">
          {getFallbackLabel(alt)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setError(true)}
    />
  );
}
