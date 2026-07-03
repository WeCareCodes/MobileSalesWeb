import { describe, it, expect } from "vitest";
import { brandSlug, slugToBrand, BRANDS } from "@/lib/brands";

describe("brandSlug()", () => {
  it("轉換單字品牌為小寫", () => {
    expect(brandSlug("Apple")).toBe("apple");
    expect(brandSlug("Samsung")).toBe("samsung");
    expect(brandSlug("Sony")).toBe("sony");
  });

  it("空格替換為連字號", () => {
    expect(brandSlug("ASUS ROG")).toBe("asus-rog");
    expect(brandSlug("Nothing Phone")).toBe("nothing-phone");
  });

  it("大小寫混合品牌正確處理", () => {
    expect(brandSlug("OnePlus")).toBe("oneplus");
    expect(brandSlug("vivo")).toBe("vivo");
  });
});

describe("slugToBrand()", () => {
  it("還原單字品牌", () => {
    expect(slugToBrand("apple")).toBe("Apple");
    expect(slugToBrand("samsung")).toBe("Samsung");
  });

  it("還原多字品牌", () => {
    expect(slugToBrand("asus-rog")).toBe("Asus Rog");
  });
});

describe("BRANDS 常數", () => {
  it("包含 12 個品牌", () => {
    expect(BRANDS).toHaveLength(12);
  });

  it("包含所有主要品牌", () => {
    const brands = BRANDS as readonly string[];
    expect(brands).toContain("Apple");
    expect(brands).toContain("Samsung");
    expect(brands).toContain("ASUS ROG");
    expect(brands).toContain("Sony");
    expect(brands).toContain("Google");
    expect(brands).toContain("Xiaomi");
    expect(brands).toContain("OPPO");
    expect(brands).toContain("vivo");
    expect(brands).toContain("OnePlus");
    expect(brands).toContain("Nothing");
    expect(brands).toContain("Motorola");
    expect(brands).toContain("Nokia");
  });

  it("brandSlug 可對所有品牌產生 URL 安全字串", () => {
    for (const brand of BRANDS) {
      const slug = brandSlug(brand);
      expect(slug).toMatch(/^[a-z0-9%-]+$/);
    }
  });
});
