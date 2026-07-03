import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPhoneById } from "@/lib/queries";
import { brandSlug } from "@/lib/brands";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return [];
}

export default async function PhoneDetailPage({ params }: Props) {
  const { id } = await params;
  const phone = await getPhoneById(Number(id));

  if (!phone) notFound();

  const specs = phone.specs;
  const discount = Math.round(
    ((phone.priceOfficial - phone.priceSite) / phone.priceOfficial) * 100
  );

  const youtubeEmbedId = phone.youtubeReviewUrl
    ? phone.youtubeReviewUrl.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1]
    : null;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex gap-2 flex-wrap">
        <Link href="/" className="hover:text-blue-600">首頁</Link>
        <span>›</span>
        <Link href={`/brands/${brandSlug(phone.brand)}`} className="hover:text-blue-600">{phone.brand}</Link>
        <span>›</span>
        <span className="text-gray-900 font-medium">{phone.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {/* Image */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 flex items-center justify-center min-h-80">
          <div className="relative w-full h-80">
            <Image
              src={phone.imageUrl}
              alt={phone.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </div>
        </div>

        {/* Basic info + pricing */}
        <div className="flex flex-col gap-4">
          <div>
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{phone.brand}</span>
            <h1 className="text-2xl font-extrabold text-gray-900 mt-1">{phone.name}</h1>
          </div>

          {/* Quick specs pills */}
          {specs && (
            <div className="flex flex-wrap gap-2">
              {[specs.cpu, specs.ram, specs.storage, specs.os].map((s) => (
                <span key={s} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Colors */}
          {specs && (specs.colors as string[]).length > 0 && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">顏色選項</p>
              <div className="flex flex-wrap gap-1">
                {(specs.colors as string[]).map((c) => (
                  <span key={c} className="border border-gray-300 text-gray-600 text-xs px-2 py-0.5 rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="bg-red-50 border border-red-100 rounded-xl p-5 mt-auto">
            <div className="flex items-baseline gap-3">
              <p className="text-3xl font-extrabold text-red-600">
                NT${phone.priceSite.toLocaleString()}
              </p>
              {discount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  省 {discount}%
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              官方建議售價：NT${phone.priceOfficial.toLocaleString()}
            </p>
            <button type="button" className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors">
              立即詢價
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Specs */}
      {specs && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            詳細規格
          </h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ["螢幕", specs.display],
                  ["尺寸", specs.dimensions],
                  ["重量", specs.weight],
                  ["處理器", specs.cpu],
                  ["記憶體", specs.ram],
                  ["儲存空間", specs.storage],
                  ["電池", specs.battery],
                  ["作業系統", specs.os],
                  ["網路", specs.network],
                  ["主相機", specs.cameraMain],
                  ...(specs.cameraUltra ? [["超廣角", specs.cameraUltra]] : []),
                  ...(specs.cameraTele ? [["望遠鏡頭", specs.cameraTele]] : []),
                  ["前置相機", specs.cameraFront],
                ].map(([label, value], i) => (
                  <tr key={label} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                    <td className="py-3 px-4 font-semibold text-gray-600 w-32 whitespace-nowrap">{label}</td>
                    <td className="py-3 px-4 text-gray-800">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* YouTube review embed */}
      {youtubeEmbedId && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            影音評測
          </h2>
          <div className="aspect-video rounded-2xl overflow-hidden border border-gray-200">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeEmbedId}`}
              title={`${phone.name} 評測`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </section>
      )}

      {/* External reviews */}
      {phone.externalReviews && (phone.externalReviews as []).length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
            網路評測資源
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {(phone.externalReviews as Array<{ platform: string; title: string; url: string }>).map((review, i) => (
              <a
                key={i}
                href={review.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-xl p-4 transition-all group"
              >
                <span className="text-2xl">
                  {review.platform === "youtube" ? "▶️" : review.platform === "facebook" ? "👍" : "📷"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 uppercase font-semibold">{review.platform}</p>
                  <p className="text-sm text-gray-800 font-medium line-clamp-2 group-hover:text-blue-700">
                    {review.title}
                  </p>
                </div>
                <span className="text-gray-400 group-hover:text-blue-600">→</span>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const phone = await getPhoneById(Number(id));
  if (!phone) return { title: "找不到手機" };
  return {
    title: `${phone.name} 規格與售價 - 手機比較王`,
    description: `${phone.name} 完整規格、官方售價 NT$${phone.priceOfficial.toLocaleString()}、本站售價 NT$${phone.priceSite.toLocaleString()}`,
  };
}
