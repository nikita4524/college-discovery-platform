"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CollegeImage from "@/components/CollegeImage";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  ExternalLink,
  Heart,
  MapPin,
  Calendar,
} from "lucide-react";
import { CollegeDetail, CollegeWithRelations } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/StarRating";
import CollegeCard from "@/components/CollegeCard";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import { useNotifications } from "@/hooks/useNotifications";

type Tab = "overview" | "courses" | "placements" | "reviews";

export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { notify } = useNotifications();
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [related, setRelated] = useState<CollegeWithRelations[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/colleges/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setCollege(data);
        return fetch(
          `/api/colleges?city=${encodeURIComponent(data.city)}&limit=4`
        );
      })
      .then((r) => r?.json())
      .then((d) => {
        if (d?.colleges) {
          setRelated(d.colleges.filter((c: CollegeWithRelations) => c.id !== id).slice(0, 3));
        }
      })
      .catch(() => router.push("/colleges"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const toggleSave = async () => {
    if (!session) {
      notify("Please login to save colleges", "error");
      return;
    }
    if (!college) return;
    try {
      if (college.isSaved) {
        await fetch("/api/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId: college.id }),
        });
        setCollege({ ...college, isSaved: false });
        notify("Removed from saved", "success");
      } else {
        await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId: college.id }),
        });
        setCollege({ ...college, isSaved: true });
        notify("College saved!", "save");
      }
    } catch {
      notify("Failed to update", "error");
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      notify("Please login to leave a review", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId: id, ...reviewForm }),
      });
      if (!res.ok) throw new Error();
      const review = await res.json();
      setCollege((c) =>
        c ? { ...c, reviews: [review, ...c.reviews].slice(0, 5) } : c
      );
      setReviewForm({ rating: 5, comment: "" });
      notify("Review submitted!", "success");
    } catch {
      notify("Failed to submit review", "error");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <DetailSkeleton />
      </div>
    );
  }

  if (!college) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "courses", label: "Courses" },
    { id: "placements", label: "Placements" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link
        href="/colleges"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to colleges
      </Link>

      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="relative h-56 sm:h-72">
          <CollegeImage
            src={college.imageUrl}
            alt={college.name}
            className="object-cover opacity-40"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white sm:p-8">
            <h1 className="text-3xl font-bold sm:text-4xl">{college.name}</h1>
            <p className="mt-2 flex items-center gap-2 text-blue-100">
              <MapPin className="h-5 w-5" />
              {college.location}
            </p>
            {college.established && (
              <p className="mt-1 flex items-center gap-2 text-sm text-blue-100">
                <Calendar className="h-4 w-4" />
                Est. {college.established}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={toggleSave}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-3 backdrop-blur transition hover:scale-110"
          >
            <Heart
              className={`h-6 w-6 ${college.isSaved ? "fill-red-400 text-red-400" : "text-white"}`}
            />
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Annual Fees", value: formatCurrency(college.fees) },
          { label: "Rating", value: <StarRating rating={college.rating} /> },
          {
            label: "Placement Rate",
            value: college.placements ? `${college.placements.placementRate}%` : "N/A",
          },
          {
            label: "Avg. Package",
            value: college.placements
              ? formatCurrency(college.placements.averagePackage)
              : "N/A",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 border-b border-gray-200 dark:border-gray-700">
        <nav className="flex gap-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${
                tab === t.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {tab === "overview" && (
          <div className="prose max-w-none dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-300">
              {college.description ?? "No description available."}
            </p>
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:underline"
              >
                Visit website <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        )}

        {tab === "courses" && (
          <div className="overflow-x-auto rounded-xl border dark:border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="p-4">Course</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Fees</th>
                  <th className="p-4">Seats</th>
                </tr>
              </thead>
              <tbody>
                {college.courses.map((c) => (
                  <tr key={c.id} className="border-t dark:border-gray-700">
                    <td className="p-4 font-medium">{c.name}</td>
                    <td className="p-4">{c.duration} years</td>
                    <td className="p-4">{c.fees ? formatCurrency(c.fees) : "—"}</td>
                    <td className="p-4">{c.seats ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "placements" && college.placements && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border p-4 dark:border-gray-700">
                <p className="text-sm text-gray-500">Average Package</p>
                <p className="text-xl font-bold">
                  {formatCurrency(college.placements.averagePackage)}
                </p>
              </div>
              <div className="rounded-xl border p-4 dark:border-gray-700">
                <p className="text-sm text-gray-500">Highest Package</p>
                <p className="text-xl font-bold">
                  {formatCurrency(college.placements.highestPackage)}
                </p>
              </div>
              <div className="rounded-xl border p-4 dark:border-gray-700">
                <p className="text-sm text-gray-500">Placement Rate ({college.placements.year})</p>
                <p className="text-xl font-bold">{college.placements.placementRate}%</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold">Top Recruiters</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {college.placements.topRecruiters.map((r) => (
                  <span
                    key={r}
                    className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="space-y-6">
            {college.reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-xl border p-4 dark:border-gray-700"
              >
                <StarRating rating={review.rating} />
                <p className="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
                <p className="mt-2 text-sm text-gray-500">
                  {review.user.name ?? "Anonymous"} ·{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </article>
            ))}
            {session ? (
              <form onSubmit={submitReview} className="rounded-xl border p-4 dark:border-gray-700">
                <h3 className="font-semibold">Write a review</h3>
                <select
                  value={reviewForm.rating}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, rating: parseInt(e.target.value, 10) })
                  }
                  className="mt-2 rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} stars
                    </option>
                  ))}
                </select>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm({ ...reviewForm, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                  className="mt-2 w-full rounded border p-3 dark:border-gray-600 dark:bg-gray-800"
                  rows={4}
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <p className="text-gray-500">
                <Link href="/login" className="text-blue-600 hover:underline">
                  Login
                </Link>{" "}
                to write a review
              </p>
            )}
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold dark:text-white">Related Colleges</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CollegeCard key={c.id} college={c} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
