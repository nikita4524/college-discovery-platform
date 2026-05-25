"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import CollegeCard from "@/components/CollegeCard";
import CollegeFilters, { FilterState } from "@/components/CollegeFilters";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import { useDebounce } from "@/hooks/useDebounce";
import { useNotifications } from "@/hooks/useNotifications";
import { CollegeWithRelations, CollegesResponse } from "@/types";

function CollegesContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const { notify } = useNotifications();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const debouncedSearch = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CollegesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<string[]>([]);
  const [maxFee, setMaxFee] = useState(2500000);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    minFee: 0,
    maxFee: 2500000,
    rating: null,
  });

  useEffect(() => {
    fetch("/api/cities")
      .then((r) => r.json())
      .then((d) => {
        setCities(d.cities ?? []);
        const mf = d.maxFee ?? 2500000;
        setMaxFee(mf);
        setFilters((f) => ({ ...f, maxFee: mf }));
      });
  }, []);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/saved")
        .then((r) => r.json())
        .then((saved: { collegeId: string }[]) => {
          if (Array.isArray(saved)) {
            setSavedIds(new Set(saved.map((s) => s.collegeId)));
          }
        })
        .catch(() => {});
    }
  }, [session]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (filters.cities.length) params.set("cities", filters.cities.join(","));
    params.set("minFee", String(filters.minFee));
    params.set("maxFee", String(filters.maxFee));
    if (filters.rating) params.set("rating", String(filters.rating));
    params.set("page", String(page));
    params.set("limit", "9");

    const res = await fetch(`/api/colleges?${params}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  }, [debouncedSearch, filters, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filters]);

  const handleSaveToggle = async (collegeId: string) => {
    if (!session) {
      notify("Please login to save colleges", "error");
      return;
    }
    const isSaved = savedIds.has(collegeId);
    try {
      if (isSaved) {
        await fetch("/api/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        setSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(collegeId);
          return next;
        });
        notify("College removed from saved list", "success");
      } else {
        await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        setSavedIds((prev) => new Set(prev).add(collegeId));
        notify("College saved successfully!", "save");
      }
    } catch {
      notify("Failed to update saved list", "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Explore Colleges</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        {data ? `${data.total} colleges found` : "Loading..."}
      </p>

      <div className="mt-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search colleges..." />
      </div>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row">
        <div className="lg:w-64 lg:shrink-0">
          <CollegeFilters
            filters={filters}
            onFilterChange={setFilters}
            availableCities={cities}
            minFee={0}
            maxFee={maxFee}
          />
        </div>

        <div className="flex-1">
          {loading ? (
            <GridSkeleton count={6} />
          ) : !data?.colleges?.length ? (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No colleges found
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.colleges.map((college: CollegeWithRelations) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isSaved={savedIds.has(college.id)}
                    onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
              <Pagination
                currentPage={data.page}
                totalPages={data.totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<GridSkeleton count={6} />}>
      <CollegesContent />
    </Suspense>
  );
}
