import { db } from "./db";
import { phones, phoneSpecs } from "./schema";
import type { PhoneWithSpecs } from "./schema";
import { eq, asc, isNotNull } from "drizzle-orm";

export async function getTopPhones(limit = 20): Promise<PhoneWithSpecs[]> {
  const rows = await db
    .select()
    .from(phones)
    .leftJoin(phoneSpecs, eq(phoneSpecs.phoneId, phones.id))
    .where(isNotNull(phones.popularityRank))
    .orderBy(asc(phones.popularityRank))
    .limit(limit);

  return rows.map((r) => ({ ...r.phones, specs: r.phone_specs }));
}

export async function getPhonesByBrand(brand: string): Promise<PhoneWithSpecs[]> {
  const rows = await db
    .select()
    .from(phones)
    .leftJoin(phoneSpecs, eq(phoneSpecs.phoneId, phones.id))
    .where(eq(phones.brand, brand))
    .orderBy(asc(phones.name));

  return rows.map((r) => ({ ...r.phones, specs: r.phone_specs }));
}

export async function getPhoneById(id: number): Promise<PhoneWithSpecs | null> {
  const rows = await db
    .select()
    .from(phones)
    .leftJoin(phoneSpecs, eq(phoneSpecs.phoneId, phones.id))
    .where(eq(phones.id, id))
    .limit(1);

  if (!rows[0]) return null;
  return { ...rows[0].phones, specs: rows[0].phone_specs };
}

export async function getAllBrands(): Promise<string[]> {
  const result = await db
    .selectDistinct({ brand: phones.brand })
    .from(phones)
    .orderBy(asc(phones.brand));
  return result.map((r) => r.brand);
}
