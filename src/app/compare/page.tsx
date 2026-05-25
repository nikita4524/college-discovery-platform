"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Plus, Share2, Save, X, GitCompare } from "lucide-react";
import ComparisonTable from "@/components/ComparisonTable";
import { TableSkeleton } from "@/components/LoadingSkeleton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNotifications } from "@/hooks/useNotifications";
import { CollegeWithRelations, SavedComparison } from "@/types";
import { formatCurrency } from "@/lib/utils";

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { notify } = useNotifications();
  const [allColleges, setAllColleges] = useState<CollegeWithRelations[]>([]);
  const [selected, setSelected] = useState<CollegeWithRelations[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [savedComparisons, setSavedComparisons, comparisonsLoaded] =
    useLocalStorage<SavedComparison[]>("saved-comparisons", []);

  useEffect(() => {
    fetch("/api/colleges?limit=50")
      .then((r) => r.json())
      .then((d) => setAllColleges(d.colleges ?? []));
  }, []);

  useEffect(() => {
    const ids = searchParams.get("collegeIds");
    if (ids && allColleges.length) {
      const idList = ids.split(",").slice(0, 3);
      const found = idList
        .map((id) => allColleges.find((c) => c.id === id))
        .filter(Boolean) as CollegeWithRelations[];
      if (found.length) setSelected(found);
    }
  }, [searchParams, allColleges]);

  const addCollege = async (id: string) => {
    if (selected.length >= 3) return;
    if (selected.some((c) => c.id === id)) return;
    setLoading(true);
    const res = await fetch("/api/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeIds: [...selected.map((c) => c.id), id] }),
    });
    const colleges = await res.json();
    setSelected(colleges);
    setSearch("");
    setLoading(false);
    notify("College added to comparison", "compare");
  };

  const removeCollege = (id: string) => {
    setSelected((prev) => prev.filter((c) => c.id !== id));
  };

  const shareComparison = () => {
    const ids = selected.map((c) => c.id).join(",");
    const url = `${window.location.origin}/compare?collegeIds=${ids}`;
    navigator.clipboard.writeText(url);
    notify("Comparison link copied!", "success");
  };

  const saveComparison = () => {
    if (!session) {
      notify("Login to save comparisons", "error");
      return;
    }
    const comp: SavedComparison = {
      id: `comp_${Date.now()}`,
      name: `Comparison ${savedComparisons.length + 1}`,
      collegeIds: selected.map((c) => c.id),
      createdAt: new Date().toISOString(),
    };
    setSavedComparisons([comp, ...savedComparisons]);
    notify("Comparison saved!", "save");
  };

  const filtered = allColleges.filter(
    (c) =>
      !selected.some((s) => s.id === c.id) &&
      c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="flex items-center gap-2 text-3xl font-bold text-gray-900 dark:text-white">
        <GitCompare className="h-8 w-8 text-blue-600" />
        Compare Colleges
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Select up to 3 colleges to compare side by side
      </p>

      {selected.length < 3 && (
        <div className="relative mt-6 max-w-md">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search college to add..."
            className="w-full rounded-lg border px-4 py-3 dark:border-gray-600 dark:bg-gray-800"
          />
          {search && filtered.length > 0 && (
            <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {filtered.slice(0, 8).map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => addCollege(c.id)}
                    className="flex w-full items-center justify-between px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <span>{c.name}</span>
                    <span className="text-sm text-gray-500">{formatCurrency(c.fees)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selected.length > 0 ? (
        <>
          <div className="mt-6 flex flex-wrap gap-3">
            {selected.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-900"
              >
                <span className="font-medium">{c.name}</span>
                <button type="button" onClick={() => removeCollege(c.id)}>
                  <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                </button>
              </div>
            ))}
            {selected.length < 3 && (
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <Plus className="h-4 w-4" />
                Add {3 - selected.length} more
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={shareComparison}
              className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800"
            >
              <Share2 className="h-4 w-4" />
              Share comparison
            </button>
            <button
              type="button"
              onClick={saveComparison}
              disabled={selected.length < 2}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              Save comparison
            </button>
          </div>

          <div className="mt-8">
            {loading ? <TableSkeleton /> : <ComparisonTable colleges={selected} />}
          </div>
        </>
      ) : (
        <div className="mt-12 rounded-xl border border-dashed border-gray-300 p-12 text-center dark:border-gray-600">
          <GitCompare className="mx-auto h-12 w-12 text-gray-300" />
          <h2 className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
            No colleges selected
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Search and add colleges above, or share a comparison link with collegeIds
          </p>
        </div>
      )}

      {comparisonsLoaded && savedComparisons.length > 0 && (
        <section className="mt-12">
          <h2 className="font-semibold dark:text-white">Saved comparisons (local)</h2>
          <ul className="mt-4 space-y-2">
            {savedComparisons.map((comp) => (
              <li key={comp.id}>
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/compare?collegeIds=${comp.collegeIds.join(",")}`)
                  }
                  className="text-blue-600 hover:underline"
                >
                  {comp.name} ({comp.collegeIds.length} colleges)
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<TableSkeleton />}>
      <CompareContent />
    </Suspense>
  );
}
