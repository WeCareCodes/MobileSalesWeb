import { notFound } from "next/navigation";
import PhoneCard from "@/components/PhoneCard";
import { BRANDS } from "@/lib/brands";
import { getPhonesByBrand } from "@/lib/queries";

interface Props {
  params: Promise<{ brand: string }>;
}

export async function generateStaticParams() {
  return BRANDS.map((brand) => ({
    brand: encodeURIComponent(brand.toLowerCase().replace(/\s+/g, "-")),
  }));
}

function decodeSlug(slug: string): string {
  const decoded = decodeURIComponent(slug).replace(/-/g, " ");
  // Find matching brand (case-insensitive)
  return (
    BRANDS.find((b) => b.toLowerCase() === decoded.toLowerCase()) ?? decoded
  );
}

export default async function BrandPage({ params }: Props) {
  const { brand: slug } = await params;
  const brandName = decodeSlug(slug);

  const phones = await getPhonesByBrand(brandName);

  if (phones.length === 0) {
    // Check if it's actually a valid brand with no phones vs unknown brand
    const isKnownBrand = BRANDS.some(
      (b) => b.toLowerCase() === brandName.toLowerCase()
    );
    if (!isKnownBrand) notFound();
  }

  return (
    <div>
      <section className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          {brandName} 手機系列
        </h1>
        <p className="text-gray-500">
          共 {phones.length} 款 {brandName} 手機
        </p>
      </section>

      {phones.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {phones.map((phone) => (
            <PhoneCard key={phone.id} phone={phone} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">📦</p>
          <p>此品牌目前尚無資料</p>
        </div>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { brand: slug } = await params;
  const brandName = decodeSlug(slug);
  return {
    title: `${brandName} 手機 - 手機比較王`,
    description: `瀏覽所有 ${brandName} 手機規格與售價比較`,
  };
}
