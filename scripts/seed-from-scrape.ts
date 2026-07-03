/**
 * Reads scripts/scraped-phones.json produced by scraper.ts
 * and seeds the Neon database (phones + phone_specs tables).
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as schema from "../lib/schema";
import { phones, phoneSpecs } from "../lib/schema";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Keyword matchers for spec fields (Chinese field names from sogi.com.tw)
function findSpec(specs: Record<string, string>, ...keys: string[]): string {
  for (const key of keys) {
    for (const [k, v] of Object.entries(specs)) {
      if (k.includes(key)) return v;
    }
  }
  return "";
}

// Combine multi-row camera specs into one string
function buildCameraSpec(specs: Record<string, string>, prefix: string): string {
  const mp   = findSpec(specs, `${prefix}畫素`);
  const ap   = findSpec(specs, `${prefix}光圈`);
  const fl   = findSpec(specs, `${prefix}等效焦距`);
  const ois  = findSpec(specs, `${prefix}光學防手震`);
  // fl from sogi already ends with " mm", avoid doubling
  const flStr = fl ? (fl.toLowerCase().includes("mm") ? fl : `${fl}mm`) : "";
  const parts = [mp, ap ? `f/${ap}` : "", flStr, ois === "Yes" ? "OIS" : ""].filter(Boolean);
  return parts.join(" ") || "";
}

function parsePrice(text: string): number {
  const n = parseInt(text.replace(/[^0-9]/g, ""));
  return isNaN(n) ? 0 : n;
}

// Map scraped phone data to our schema
function mapToSeed(phone: any, rank: number | null) {
  const s = phone.specs as Record<string, string>;

  // sogi.com.tw spec field names (Chinese)
  const screenSize  = findSpec(s, "主螢幕尺寸");
  const screenRes   = findSpec(s, "主螢幕解析度");
  const screenMat   = findSpec(s, "主螢幕材質");
  const screenHz    = findSpec(s, "主螢幕更新率");
  const display = screenSize && screenRes
    ? `${screenSize} ${screenMat} ${screenRes}${screenHz ? ` ${screenHz}` : ""}`
    : findSpec(s, "螢幕", "顯示", "Display");

  const cpuBrand  = findSpec(s, "處理器品牌");
  const cpuModel  = findSpec(s, "處理器型號");
  const cpu = cpuBrand && cpuModel ? `${cpuBrand} ${cpuModel}` : findSpec(s, "處理器", "CPU", "晶片");

  const ram       = findSpec(s, "RAM記憶體", "RAM", "記憶體");
  const storage   = findSpec(s, "ROM儲存空間", "儲存", "ROM");
  const battCap   = findSpec(s, "電池容量");
  // battCap from sogi may already include "mAh" suffix
  const battery   = battCap
    ? (battCap.toLowerCase().includes("mah") ? battCap : `${battCap} mAh`)
    : findSpec(s, "電池");
  const weight    = findSpec(s, "機身重量", "重量");
  // Combine separate length/width/thickness fields into one dimensions string
  const bodyLen = findSpec(s, "機身長度");
  const bodyW   = findSpec(s, "機身寬度");
  const bodyH   = findSpec(s, "機身厚度");
  const dimensions = bodyLen && bodyW && bodyH
    ? `${bodyLen} × ${bodyW} × ${bodyH}`
    : findSpec(s, "機身尺寸");
  const os        = findSpec(s, "作業系統與版本", "作業系統", "OS");
  const network   = findSpec(s, "網路頻段", "制式", "網路") || "5G / 4G LTE";

  // Camera — sogi splits each lens into multiple rows
  // sogi uses both "前置相機" and "前相機" for front camera
  const camMain  = buildCameraSpec(s, "主相機") || findSpec(s, "主相機畫素");
  const camUltra = buildCameraSpec(s, "第二主相機") || findSpec(s, "超廣角");
  const camTele  = buildCameraSpec(s, "第三主相機") || findSpec(s, "望遠");
  const camFront = buildCameraSpec(s, "前置相機") || buildCameraSpec(s, "前相機") || findSpec(s, "前鏡頭", "前相機畫素", "前置相機畫素");

  // Color
  const colorsRaw = findSpec(s, "機身顏色", "顏色", "Color", "色系");
  const colors = colorsRaw
    ? colorsRaw.split(/[、,，\/]/).map((c) => c.trim()).filter(Boolean)
    : [];

  const priceOfficial = phone.priceOfficial > 0 ? phone.priceOfficial : phone.priceSite;
  const priceSite     = phone.priceSite > 0 ? phone.priceSite : phone.priceOfficial;

  return {
    phone: {
      brand: phone.appBrand,
      name: phone.sogiName
        .replace(/^小米\s*/u, "")
        .replace(/^(Apple|SAMSUNG|Samsung|ASUS ROG|ASUS|Sony|Google|Xiaomi|OPPO|vivo|OnePlus|Nothing|Motorola|Nokia)\s*/i, ""),
      imageUrl: phone.imageUrl || "https://via.placeholder.com/360x270?text=No+Image",
      priceOfficial: priceOfficial || 29900,
      priceSite:     priceSite     || 27900,
      popularityRank: rank,
      isFeatured: rank !== null && rank <= 5,
      youtubeReviewUrl: phone.youtubeReviews?.[0]
        ? `https://www.youtube.com/watch?v=${phone.youtubeReviews[0].id}`
        : null,
      externalReviews: (phone.youtubeReviews ?? []).map((r: any) => ({
        platform: "youtube",
        title: r.title,
        url: `https://www.youtube.com/watch?v=${r.id}`,
      })),
    },
    specs: {
      display:      display      || "N/A",
      dimensions:   dimensions   || "N/A",
      weight:       weight       || "N/A",
      cpu:          cpu          || "N/A",
      ram:          ram          || "N/A",
      storage:      storage      || "N/A",
      battery:      battery      || "N/A",
      cameraMain:   camMain      || "N/A",
      cameraUltra:  camUltra     || null,
      cameraTele:   camTele      || null,
      cameraFront:  camFront     || "N/A",
      os:           os           || "N/A",
      network:      network      || "5G / 4G LTE",
      colors:       colors.length > 0 ? colors : ["黑色", "白色"],
    },
  };
}

async function seed() {
  const dataPath = "scripts/scraped-phones.json";
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ 找不到 ${dataPath}，請先執行：npx tsx scripts/scraper.ts`);
    process.exit(1);
  }

  const scraped = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as any[];
  console.log(`🌱 從爬蟲資料植入 ${scraped.length} 支手機...`);

  await db.delete(phoneSpecs);
  await db.delete(phones);
  console.log("✅ 清除舊資料");

  // Assign popularity ranks to first 20 phones that have enough data
  let rank = 1;

  for (const raw of scraped) {
    const hasData = raw.imageUrl && raw.priceSite > 0;
    const { phone: phoneData, specs: specsData } = mapToSeed(raw, hasData && rank <= 20 ? rank++ : null);

    const [inserted] = await db.insert(phones).values(phoneData).returning({ id: phones.id });
    await db.insert(phoneSpecs).values({ ...specsData, phoneId: inserted.id });

    const icon = phoneData.imageUrl.includes("placeholder") ? "❌圖" : "✅";
    console.log(`   ${icon} ${phoneData.brand} ${phoneData.name} — NT$${phoneData.priceSite.toLocaleString()}`);
  }

  console.log(`\n✅ 成功植入 ${scraped.length} 筆資料`);
  console.log("🎉 完成！重新整理瀏覽器查看結果。");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ 植入失敗：", e);
  process.exit(1);
});
