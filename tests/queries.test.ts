import { describe, it, expect, beforeAll } from "vitest";
import { getTopPhones, getPhonesByBrand, getPhoneById, getAllBrands } from "@/lib/queries";

// 整合測試：直接查詢 Neon 資料庫
// 需要 .env.local 中的 DATABASE_URL

describe("getTopPhones()", () => {
  it("回傳最多 20 筆有 popularityRank 的手機", async () => {
    const phones = await getTopPhones(20);
    expect(phones.length).toBeGreaterThan(0);
    expect(phones.length).toBeLessThanOrEqual(20);
  });

  it("依 popularityRank 升冪排序", async () => {
    const phones = await getTopPhones(20);
    for (let i = 1; i < phones.length; i++) {
      expect(phones[i].popularityRank!).toBeGreaterThanOrEqual(phones[i - 1].popularityRank!);
    }
  });

  it("每筆手機都有 specs", async () => {
    const phones = await getTopPhones(5);
    for (const phone of phones) {
      expect(phone.specs).not.toBeNull();
      expect(phone.specs?.cpu).toBeTruthy();
      expect(phone.specs?.display).toBeTruthy();
    }
  });

  it("limit 參數有效", async () => {
    const phones = await getTopPhones(3);
    expect(phones.length).toBeLessThanOrEqual(3);
  });
});

describe("getPhonesByBrand()", () => {
  it("回傳指定品牌的手機", async () => {
    const phones = await getPhonesByBrand("Apple");
    expect(phones.length).toBeGreaterThan(0);
    for (const p of phones) {
      expect(p.brand).toBe("Apple");
    }
  });

  it("不存在的品牌回傳空陣列", async () => {
    const phones = await getPhonesByBrand("不存在的品牌XYZ");
    expect(phones).toEqual([]);
  });

  it("Samsung 有多款機型", async () => {
    const phones = await getPhonesByBrand("Samsung");
    expect(phones.length).toBeGreaterThanOrEqual(3);
  });

  it("結果依名稱排序", async () => {
    const phones = await getPhonesByBrand("Apple");
    const names = phones.map((p) => p.name);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });
});

describe("getPhoneById()", () => {
  let firstId: number;

  beforeAll(async () => {
    const phones = await getTopPhones(1);
    firstId = phones[0].id;
  });

  it("找到存在的手機", async () => {
    const phone = await getPhoneById(firstId);
    expect(phone).not.toBeNull();
    expect(phone?.id).toBe(firstId);
  });

  it("包含 specs 資料", async () => {
    const phone = await getPhoneById(firstId);
    expect(phone?.specs).not.toBeNull();
    expect(phone?.specs?.cpu).toBeTruthy();
    expect(phone?.specs?.cameraMain).toBeTruthy();
    expect(phone?.specs?.colors).toBeInstanceOf(Array);
  });

  it("不存在的 ID 回傳 null", async () => {
    const phone = await getPhoneById(999999);
    expect(phone).toBeNull();
  });
});

describe("getAllBrands()", () => {
  it("回傳所有品牌名稱", async () => {
    const brands = await getAllBrands();
    expect(brands.length).toBeGreaterThan(0);
    expect(brands).toContain("Apple");
    expect(brands).toContain("Samsung");
  });

  it("品牌不重複", async () => {
    const brands = await getAllBrands();
    const unique = new Set(brands);
    expect(brands.length).toBe(unique.size);
  });

  it("依字母排序", async () => {
    const brands = await getAllBrands();
    const sorted = [...brands].sort();
    expect(brands).toEqual(sorted);
  });
});
