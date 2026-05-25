"use client";

import { Star } from "lucide-react";
import { formatRating } from "@/lib/utils";

export function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  const stars = formatRating(rating);
  return (
    <div className="flex items-center gap-0.5">
      {stars.map((type, i) => (
        <Star
          key={i}
          size={size}
          className={
            type === "empty"
              ? "text-gray-300 dark:text-gray-600"
              : "fill-amber-400 text-amber-400"
          }
        />
      ))}
      <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
    </div>
  );
}
