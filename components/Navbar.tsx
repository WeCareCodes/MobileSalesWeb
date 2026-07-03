"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRANDS, brandSlug } from "@/lib/brands";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (brand: string) =>
    pathname === `/brands/${brandSlug(brand)}`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <span className="text-2xl">📱</span>
          <span>手機比較王</span>
        </Link>
        <button
          className="md:hidden p-2 rounded text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="開啟選單"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Brand navigation */}
      <nav className={`border-t border-gray-100 bg-gray-50 ${mobileOpen ? "block" : "hidden md:block"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex flex-wrap gap-1 py-2">
            {BRANDS.map((brand) => (
              <li key={brand}>
                <Link
                  href={`/brands/${brandSlug(brand)}`}
                  className={`inline-block px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    isActive(brand)
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
