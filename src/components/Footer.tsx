import Link from "next/link";
import { GraduationCap, Share2, Mail, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-blue-600">
              <GraduationCap className="h-7 w-7" />
              CollegeDiscovery
            </Link>
            <p className="mt-3 max-w-md text-sm text-gray-600 dark:text-gray-400">
              Discover, compare, and save top colleges across India. Find the perfect
              institution for your future.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Explore</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/colleges" className="hover:text-blue-600">
                  All Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-blue-600">
                  Compare
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Account</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <Link href="/login" className="hover:text-blue-600">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-600">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 sm:flex-row dark:border-gray-800">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} CollegeDiscovery. All rights reserved.
          </p>
          <div className="flex gap-4 text-gray-500">
            <a href="https://github.com" aria-label="GitHub" className="hover:text-blue-600">
              <Share2 className="h-5 w-5" />
            </a>
            <a href="https://twitter.com" aria-label="Twitter" className="hover:text-blue-600">
              <Globe className="h-5 w-5" />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" className="hover:text-blue-600">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
