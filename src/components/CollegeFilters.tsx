"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, RotateCcw } from "lucide-react";

export interface FilterState {
  cities: string[];
  minFee: number;
  maxFee: number;
  rating: number | null;
}

interface CollegeFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  availableCities: string[];
  minFee: number;
  maxFee: number;
  filters: FilterState;
}

export default function CollegeFilters({
  onFilterChange,
  availableCities,
  minFee,
  maxFee,
  filters,
}: CollegeFiltersProps) {
  const [open, setOpen] = useState(false);

  const toggleCity = (city: string) => {
    const cities = filters.cities.includes(city)
      ? filters.cities.filter((c) => c !== city)
      : [...filters.cities, city];
    onFilterChange({ ...filters, cities });
  };

  const reset = () => {
    onFilterChange({ cities: [], minFee: 0, maxFee, rating: null });
  };

  const content = (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">City</h3>
        <div className="max-h-48 space-y-2 overflow-y-auto">
          {availableCities.map((city) => (
            <label key={city} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={filters.cities.includes(city)}
                onChange={() => toggleCity(city)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              {city}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">
          Fee Range (₹{filters.minFee.toLocaleString("en-IN")} – ₹
          {filters.maxFee.toLocaleString("en-IN")})
        </h3>
        <input
          type="range"
          min={minFee}
          max={maxFee}
          value={filters.maxFee}
          onChange={(e) =>
            onFilterChange({ ...filters, maxFee: parseInt(e.target.value, 10) })
          }
          className="w-full accent-blue-600"
        />
        <input
          type="range"
          min={minFee}
          max={maxFee}
          value={filters.minFee}
          onChange={(e) =>
            onFilterChange({ ...filters, minFee: parseInt(e.target.value, 10) })
          }
          className="mt-2 w-full accent-blue-600"
        />
      </div>

      <div>
        <h3 className="mb-3 font-semibold text-gray-900 dark:text-white">Rating</h3>
        <div className="flex flex-wrap gap-2">
          {[3, 4, 4.5].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() =>
                onFilterChange({
                  ...filters,
                  rating: filters.rating === r ? null : r,
                })
              }
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filters.rating === r
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
              }`}
            >
              {r}+ ★
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={reset}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
      >
        <RotateCcw className="h-4 w-4" />
        Clear filters
      </button>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="mb-4 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white p-4 lg:hidden dark:border-gray-700 dark:bg-gray-900"
      >
        <span className="font-semibold">Filters</span>
        {open ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      <div className={`lg:block ${open ? "block" : "hidden"}`}>
        <aside className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 hidden text-lg font-bold lg:block dark:text-white">Filters</h2>
          {content}
        </aside>
      </div>
    </>
  );
}
