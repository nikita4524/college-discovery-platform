"use client";

import Link from "next/link";
import { CollegeWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "./StarRating";

interface ComparisonTableProps {
  colleges: CollegeWithRelations[];
}

function getHighlight(
  values: number[],
  index: number,
  mode: "max" | "min"
): string {
  if (values.length < 2) return "";
  const target = mode === "max" ? Math.max(...values) : Math.min(...values);
  const allSame = values.every((v) => v === values[0]);
  if (allSame) return "";
  return values[index] === target
    ? mode === "max"
      ? "bg-green-50 dark:bg-green-900/20"
      : "bg-blue-50 dark:bg-blue-900/20"
    : "";
}

export default function ComparisonTable({ colleges }: ComparisonTableProps) {
  if (colleges.length === 0) return null;

  const fees = colleges.map((c) => c.fees);
  const ratings = colleges.map((c) => c.rating);
  const avgPkgs = colleges.map((c) => c.placements?.averagePackage ?? 0);
  const highPkgs = colleges.map((c) => c.placements?.highestPackage ?? 0);
  const rates = colleges.map((c) => c.placements?.placementRate ?? 0);

  const rows: {
    label: string;
    cells: (string | React.ReactNode)[];
    highlights?: string[];
  }[] = [
    {
      label: "College Name",
      cells: colleges.map((c) => (
        <Link
          key={c.id}
          href={`/colleges/${c.id}`}
          className="font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {c.name}
        </Link>
      )),
    },
    {
      label: "Location",
      cells: colleges.map((c) => `${c.city}, ${c.state}`),
    },
    {
      label: "Fees",
      cells: colleges.map((c) => formatCurrency(c.fees)),
      highlights: colleges.map((_, i) => getHighlight(fees, i, "min")),
    },
    {
      label: "Rating",
      cells: colleges.map((c) => <StarRating key={c.id} rating={c.rating} />),
      highlights: colleges.map((_, i) => getHighlight(ratings, i, "max")),
    },
    {
      label: "Average Package",
      cells: colleges.map((c) =>
        c.placements ? formatCurrency(c.placements.averagePackage) : "N/A"
      ),
      highlights: colleges.map((_, i) => getHighlight(avgPkgs, i, "max")),
    },
    {
      label: "Highest Package",
      cells: colleges.map((c) =>
        c.placements ? formatCurrency(c.placements.highestPackage) : "N/A"
      ),
      highlights: colleges.map((_, i) => getHighlight(highPkgs, i, "max")),
    },
    {
      label: "Placement Rate",
      cells: colleges.map((c) =>
        c.placements ? `${c.placements.placementRate}%` : "N/A"
      ),
      highlights: colleges.map((_, i) => getHighlight(rates, i, "max")),
    },
    {
      label: "Top Recruiters",
      cells: colleges.map((c) =>
        c.placements?.topRecruiters.join(", ") ?? "N/A"
      ),
    },
    {
      label: "Available Courses",
      cells: colleges.map((c) => c.courses.map((co) => co.name).join(", ") || "N/A"),
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <th className="p-4 font-semibold text-gray-900 dark:text-white">Criteria</th>
            {colleges.map((c) => (
              <th key={c.id} className="p-4 font-semibold text-gray-900 dark:text-white">
                {c.name.split(" ").slice(0, 2).join(" ")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className="border-b border-gray-100 dark:border-gray-800"
            >
              <td className="p-4 font-medium text-gray-700 dark:text-gray-300">
                {row.label}
              </td>
              {row.cells.map((cell, i) => (
                <td
                  key={i}
                  className={`p-4 text-gray-600 dark:text-gray-400 ${row.highlights?.[i] ?? ""}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
