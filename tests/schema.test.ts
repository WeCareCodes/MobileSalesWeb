import { describe, it, expect } from "vitest";
import { phones, phoneSpecs } from "@/lib/schema";

describe("phones 資料表結構", () => {
  it("包含必要欄位", () => {
    const cols = Object.keys(phones);
    expect(cols).toContain("id");
    expect(cols).toContain("brand");
    expect(cols).toContain("name");
    expect(cols).toContain("imageUrl");
    expect(cols).toContain("priceOfficial");
    expect(cols).toContain("priceSite");
    expect(cols).toContain("popularityRank");
    expect(cols).toContain("isFeatured");
    expect(cols).toContain("youtubeReviewUrl");
    expect(cols).toContain("externalReviews");
  });

  it("不包含已移除的 specs jsonb 欄位", () => {
    const cols = Object.keys(phones);
    expect(cols).not.toContain("specs");
  });
});

describe("phone_specs 資料表結構", () => {
  it("包含所有規格欄位", () => {
    const cols = Object.keys(phoneSpecs);
    expect(cols).toContain("id");
    expect(cols).toContain("phoneId");
    expect(cols).toContain("display");
    expect(cols).toContain("dimensions");
    expect(cols).toContain("weight");
    expect(cols).toContain("cpu");
    expect(cols).toContain("ram");
    expect(cols).toContain("storage");
    expect(cols).toContain("battery");
    expect(cols).toContain("cameraMain");
    expect(cols).toContain("cameraUltra");
    expect(cols).toContain("cameraTele");
    expect(cols).toContain("cameraFront");
    expect(cols).toContain("os");
    expect(cols).toContain("network");
    expect(cols).toContain("colors");
  });
});
