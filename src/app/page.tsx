import Link from "next/link";
import { ArrowRight, Search, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import CollegeCard from "@/components/CollegeCard";
import { withResolvedImage } from "@/lib/college-images";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function getFeaturedColleges() {
  try {
    // 🔧 Fix: Get count safely
    const count = await prisma.college.count();
    console.log("Total colleges in DB:", count); // Debug
    
    if (count === 0) {
      console.log("No colleges found in database");
      return [];
    }
    
    // Random skip for featured colleges
    const skip = Math.floor(Math.random() * Math.max(1, count - 5));
    
    const colleges = await prisma.college.findMany({
      take: 6,
      skip: skip > 0 ? skip : 0,
      include: { courses: true, placements: true },
      orderBy: { rating: "desc" },
    });
    
    console.log("Featured colleges fetched:", colleges.length);
    return colleges;
  } catch (error) {
    console.error("Error in getFeaturedColleges:", error);
    return [];
  }
}

async function getRecentReviews() {
  try {
    const reviews = await prisma.review.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        college: { select: { name: true, id: true } },
      },
    });
    return reviews;
  } catch (error) {
    console.error("Error in getRecentReviews:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featured, reviews] = await Promise.all([
    getFeaturedColleges(),
    getRecentReviews(),
  ]);

  // Agar featured colleges nahi hai toh fallback show karo
  const hasColleges = featured && featured.length > 0;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 px-4 py-20 text-white sm:px-6 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Discover Your Perfect College in India
          </h1>
          <p className="mt-4 text-lg text-blue-100 sm:text-xl">
            Explore IITs, NITs, BITS, and 27+ top institutions. Compare fees,
            placements, and save your favorites.
          </p>
          <form action="/colleges" method="get" className="mx-auto mt-8 max-w-xl">
            <div className="flex rounded-xl bg-white p-1 shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  name="search"
                  type="search"
                  placeholder="Search by college name or city..."
                  className="w-full rounded-lg py-3 pl-12 pr-4 text-gray-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Featured Colleges
          </h2>
          <Link
            href="/colleges"
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        {!hasColleges ? (
          <div className="mt-8 rounded-xl bg-yellow-50 p-8 text-center dark:bg-yellow-900/20">
            <p className="text-yellow-800 dark:text-yellow-200">
              ⚠️ No colleges found in database. Please run:
            </p>
            <code className="mt-2 block rounded bg-gray-100 p-2 text-sm dark:bg-gray-800">
              npx prisma db push --force-reset && npx prisma db seed
            </code>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((college) => (
              <CollegeCard key={college.id} college={withResolvedImage(college)} />
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link
            href="/colleges"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Explore All Colleges
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <section className="bg-gray-50 px-4 py-16 dark:bg-gray-900 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="mt-4 text-gray-500">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {reviews.map((review) => (
                <article
                  key={review.id}
                  className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-3 line-clamp-3 text-gray-600 dark:text-gray-300">
                    {review.comment}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>{review.user.name ?? "Anonymous"}</span>
                    <Link
                      href={`/colleges/${review.college.id}`}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {review.college.name}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            { label: "Colleges", value: "27+", desc: "Top institutions" },
            { label: "Avg. Package", value: formatCurrency(1200000), desc: "Top placements" },
            { label: "Students", value: "10K+", desc: "Using platform" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 p-6 text-center dark:border-gray-700"
            >
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="mt-1 font-semibold text-gray-900 dark:text-white">{stat.label}</p>
              <p className="text-sm text-gray-500">{stat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}