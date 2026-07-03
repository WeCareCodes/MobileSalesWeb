import Link from "next/link";
import Image from "next/image";
import type { PhoneWithSpecs } from "@/lib/schema";

interface Props {
  phone: PhoneWithSpecs;
  rank?: number;
}

export default function PhoneCard({ phone, rank }: Props) {
  const discount = Math.round(((phone.priceOfficial - phone.priceSite) / phone.priceOfficial) * 100);

  return (
    <Link
      href={`/phones/${phone.id}`}
      className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all overflow-hidden flex flex-col"
    >
      {/* Rank badge */}
      {rank && (
        <div className={`absolute top-3 left-3 z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
          rank <= 3 ? "bg-amber-500" : "bg-gray-500"
        }`}>
          {rank}
        </div>
      )}

      <div className="relative pt-[75%] bg-gray-50">
        <Image
          src={phone.imageUrl}
          alt={phone.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            省 {discount}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{phone.brand}</p>
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-700">
          {phone.name}
        </h3>

        <div className="mt-auto pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 line-through">
            官方售價 NT${phone.priceOfficial.toLocaleString()}
          </p>
          <p className="text-lg font-bold text-red-600">
            NT${phone.priceSite.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
