"use client";

import Link from "next/link";
import CollegeImage from "./CollegeImage";
import { Heart, MapPin } from "lucide-react";
import { CollegeWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "./StarRating";

interface CollegeCardProps {
  college: CollegeWithRelations;
  isSaved?: boolean;
  onSaveToggle?: (collegeId: string) => void;
}

export default function CollegeCard({
  college,
  isSaved = false,
  onSaveToggle,
}: CollegeCardProps) {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
      <div className="relative h-44 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        <CollegeImage
          src={college.imageUrl}
          alt={college.name}
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {onSaveToggle && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSaveToggle(college.id);
            }}
            className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow transition hover:scale-110 dark:bg-gray-800/90"
            aria-label={isSaved ? "Unsave college" : "Save college"}
          >
            <Heart
              className={`h-5 w-5 transition ${
                isSaved ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </button>
        )}
      </div>
      <Link href={`/colleges/${college.id}`} className="block p-4">
        <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
          {college.name}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4 shrink-0" />
          {college.location}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatCurrency(college.fees)}
            <span className="text-xs font-normal text-gray-500">/yr</span>
          </span>
          <StarRating rating={college.rating} size={14} />
        </div>
      </Link>
    </article>
  );
}
