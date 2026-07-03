import PhoneCard from "@/components/PhoneCard";
import { getTopPhones } from "@/lib/queries";

export default async function HomePage() {
  const phones = await getTopPhones(20);

  return (
    <div>
      {/* Hero */}
      <section className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          📱 本月最夯手機 Top 20
        </h1>
        <p className="text-gray-500">每月更新，精選台灣市場最受矚目的 20 款手機</p>
      </section>

      {/* Phone grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 relative">
        {phones.map((phone) => (
          <div key={phone.id} className="relative">
            <PhoneCard phone={phone} rank={phone.popularityRank ?? undefined} />
          </div>
        ))}
      </section>

      {phones.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">📦</p>
          <p>尚無資料，請先執行 npm run db:seed</p>
        </div>
      )}
    </div>
  );
}
