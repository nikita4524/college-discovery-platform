"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Download, Trash2, GitCompare } from "lucide-react";
import CollegeCard from "@/components/CollegeCard";
import { GridSkeleton } from "@/components/LoadingSkeleton";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNotifications } from "@/hooks/useNotifications";
import { SavedCollegeWithCollege, SavedComparison } from "@/types";

type Tab = "saved" | "comparisons";

export default function DashboardPage() {
  const router = useRouter();
  const { notify } = useNotifications();
  const [tab, setTab] = useState<Tab>("saved");
  const [saved, setSaved] = useState<SavedCollegeWithCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedComparisons] = useLocalStorage<SavedComparison[]>("saved-comparisons", []);

  useEffect(() => {
    fetch("/api/saved")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSaved(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const removeSaved = async (collegeId: string) => {
    await fetch("/api/saved", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ collegeId }),
    });
    setSaved((prev) => prev.filter((s) => s.collegeId !== collegeId));
    notify("College removed", "success");
  };

  const exportCSV = async () => {
    try {
      const res = await fetch("/api/saved/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "saved-colleges.csv";
      a.click();
      URL.revokeObjectURL(url);
      notify("CSV exported successfully!", "success");
    } catch {
      notify("Export failed", "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      <div className="mt-6 flex gap-4 border-b dark:border-gray-700">
        {(
          [
            { id: "saved" as Tab, label: "Saved Colleges" },
            { id: "comparisons" as Tab, label: "Saved Comparisons" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`border-b-2 px-4 py-2 text-sm font-medium ${
              tab === t.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "saved" && (
        <div className="mt-8">
          {saved.length > 0 && (
            <button
              type="button"
              onClick={exportCSV}
              className="mb-6 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              Export to CSV
            </button>
          )}
          {loading ? (
            <GridSkeleton count={3} />
          ) : saved.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center dark:border-gray-600">
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No saved colleges. Start exploring!
              </p>
              <Link
                href="/colleges"
                className="mt-4 inline-block text-blue-600 hover:underline"
              >
                Browse colleges
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {saved.map((item) => (
                <div key={item.id} className="relative">
                  <CollegeCard college={item.college} isSaved />
                  <button
                    type="button"
                    onClick={() => removeSaved(item.collegeId)}
                    className="absolute bottom-4 right-4 rounded-lg bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/30"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "comparisons" && (
        <div className="mt-8">
          {savedComparisons.length === 0 ? (
            <div className="rounded-xl border border-dashed p-12 text-center dark:border-gray-600">
              <GitCompare className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                No saved comparisons yet
              </p>
              <Link href="/compare" className="mt-2 inline-block text-blue-600 hover:underline">
                Create a comparison
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {savedComparisons.map((comp) => (
                <li
                  key={comp.id}
                  className="flex items-center justify-between rounded-xl border p-4 dark:border-gray-700"
                >
                  <div>
                    <p className="font-semibold dark:text-white">{comp.name}</p>
                    <p className="text-sm text-gray-500">
                      {comp.collegeIds.length} colleges ·{" "}
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      router.push(`/compare?collegeIds=${comp.collegeIds.join(",")}`)
                    }
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
                  >
                    Load
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
