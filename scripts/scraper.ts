/**
 * Playwright scraper for sogi.com.tw
 * Collects real phone images, specs, and prices for seeding.
 * Output: scripts/scraped-phones.json
 */
import { chromium } from "playwright";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const BASE = "https://www.sogi.com.tw";

const BRAND_CONFIG = [
  { appBrand: "Apple",    sogiSlug: "Apple",    sogiId: 116,  limit: 6 },
  { appBrand: "Samsung",  sogiSlug: "SAMSUNG",  sogiId: 22,   limit: 6 },
  { appBrand: "ASUS ROG", sogiSlug: "ASUS",     sogiId: 49,   limit: 3 },
  { appBrand: "Sony",     sogiSlug: "Sony",     sogiId: 26,   limit: 3 },
  { appBrand: "Google",   sogiSlug: "Google",   sogiId: 4041, limit: 3 },
  { appBrand: "Xiaomi",   sogiSlug: "Xiaomi",   sogiId: 5368, limit: 3 },
  { appBrand: "OPPO",     sogiSlug: "OPPO",     sogiId: 5372, limit: 2 },
  { appBrand: "vivo",     sogiSlug: "vivo",     sogiId: 5603, limit: 2 },
  { appBrand: "OnePlus",  sogiSlug: "OnePlus",  sogiId: 5866, limit: 2 },
  { appBrand: "Nothing",  sogiSlug: "Nothing",  sogiId: 6058, limit: 2 },
  { appBrand: "Motorola", sogiSlug: "Motorola", sogiId: 15,   limit: 2 },
];

// Real YouTube review video IDs (繁體中文)
const YOUTUBE_REVIEWS: Record<string, { id: string; title: string }[]> = {
  "iPhone 16 Pro Max": [
    { id: "zdbu1kT1N9Q", title: "邦尼評測｜iPhone 16 Pro Max 7大關鍵優缺點超完整評測" },
    { id: "ScIdRxnIP_4", title: "FlashingDroid｜iPhone 14/15/16 Pro Max 三代終極深入評測" },
  ],
  "iPhone 16 Pro": [
    { id: "zdbu1kT1N9Q", title: "邦尼評測｜iPhone 16 Pro 超完整評測" },
  ],
  "Galaxy S25 Ultra": [
    { id: "PEiQAVQRyRI", title: "邦尼評測｜三星 S25 Ultra 超完整評測！第二代三星 AI" },
    { id: "nQcO5EIvRDc", title: "Pinky Talks｜Galaxy S25 Ultra 一個月用後感" },
  ],
  "Galaxy S25": [
    { id: "s19m588-_7Y", title: "FlashingDroid｜Samsung Galaxy S25 終極評測" },
  ],
  "ROG Phone 9 Pro": [
    { id: "WKteSyDR7fY", title: "邦尼評測｜ROG Phone 9 Pro 超完整評測 Snapdragon 8 Elite" },
    { id: "32OA7OqAfCo", title: "壹哥｜ROG Phone 9 Pro 電競手機完整開箱評測" },
  ],
  "Pixel 9 Pro": [
    { id: "h4ck6oEuGRE", title: "Galaxy S25 vs iPhone 16 Pro vs Pixel 9 Pro vs Xiaomi 15 旗艦對比" },
  ],
  "Xiaomi 15 Ultra": [
    { id: "5Jn0l-DVWMM", title: "Xiaomi 15 vs Galaxy S25 vs iPhone 16 Pro vs Pixel 9 Pro 電池相機對比" },
  ],
};

interface ScrapedPhone {
  appBrand: string;
  sogiName: string;
  imageUrl: string;
  sogiUrl: string;
  priceOfficial: number;
  priceSite: number;
  specs: Record<string, string>;
  youtubeReviews: { id: string; title: string }[];
}

async function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function goto(page: import("playwright").Page, url: string) {
  // domcontentloaded is fast; networkidle never settles on sogi (ads)
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });
  } catch {
    // partial load is fine
  }
  await delay(3000); // wait for JS to render cards
  await page.evaluate(() => window.scrollBy(0, 800));
  await delay(1000);
}

async function scrapeBrandPage(
  page: import("playwright").Page,
  config: (typeof BRAND_CONFIG)[0]
): Promise<Omit<ScrapedPhone, "specs" | "priceOfficial" | "priceSite">[]> {
  const url = `${BASE}/brands/${config.sogiSlug}/${config.sogiId}`;
  console.log(`  📂 品牌頁：${url}`);

  await goto(page, url);
  await page.screenshot({ path: `scripts/screenshots/${config.sogiSlug}.png`, fullPage: false });

  const cards = await page.evaluate(() => {
    const results: { name: string; imageUrl: string; href: string }[] = [];
    const seen = new Set<string>();

    const allLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));
    for (const a of allLinks) {
      const href = a.getAttribute("href") ?? "";
      if (!href.includes("/products/") || seen.has(href)) continue;

      // Image: look inside anchor and in parent card
      let imgEl: HTMLImageElement | null = a.querySelector("img");
      if (!imgEl) {
        imgEl = a.closest("li,div,article,section")?.querySelector("img") ?? null;
      }
      const src = imgEl?.getAttribute("src") ?? imgEl?.getAttribute("data-src") ?? "";
      // Must be a real phone image from the CDN (not icons/logos)
      if (!src.includes("cloudfront.net") || src.includes("logo") || src.includes("brand")) continue;

      // Name
      let name = (a.getAttribute("title") ?? "").trim();
      if (!name) {
        const el =
          a.querySelector("h2,h3,h4,h5,strong,[class*=name],[class*=title],[class*=model]") ??
          a.closest("li,div,article")?.querySelector("h2,h3,h4,h5,strong,[class*=name],[class*=title]");
        name = (el?.textContent ?? a.textContent ?? "").replace(/\s+/g, " ").trim();
      }
      if (!name || name.length > 100) continue;

      seen.add(href);
      results.push({ name, imageUrl: src, href });
    }
    return results;
  });

  console.log(`     → 找到 ${cards.length} 筆，取前 ${config.limit} 筆`);

  return cards.slice(0, config.limit).map((c) => ({
    appBrand: config.appBrand,
    sogiName: c.name,
    imageUrl: c.imageUrl.startsWith("http") ? c.imageUrl : `${BASE}${c.imageUrl}`,
    sogiUrl: c.href.startsWith("http") ? c.href : `${BASE}${c.href}`,
    youtubeReviews: [],
  }));
}

async function scrapePhoneDetail(
  page: import("playwright").Page,
  phone: Omit<ScrapedPhone, "specs" | "priceOfficial" | "priceSite">
): Promise<ScrapedPhone> {
  console.log(`    ↳ ${phone.sogiName}`);
  await goto(page, phone.sogiUrl);

  const detail = await page.evaluate(() => {
    // ── Image ──────────────────────────────────────────────────
    // Prefer product images (tw/product/img/) over article cover images
    const productImgEl = document.querySelector<HTMLImageElement>(
      'img[src*="tw/product/img/"], img[src*="/Product/"][src*="/big/"]'
    );
    const imageUrl = productImgEl?.getAttribute("src") ?? "";

    // ── Price ──────────────────────────────────────────────────
    // sogi.com.tw structure: 原廠售價 $XX,XXX 本站售價 $XX,XXX
    let priceOfficial = 0;
    let priceSite = 0;

    // Walk all text nodes looking for 售價 pattern
    const allText = document.body.innerText;
    const officialMatch = allText.match(/原廠售價[^0-9$]*\$?\s*([\d,]+)/);
    const siteMatch     = allText.match(/本站售價[^0-9$]*\$?\s*([\d,]+)/);
    if (officialMatch) priceOfficial = parseInt(officialMatch[1].replace(/,/g, ""));
    if (siteMatch)     priceSite     = parseInt(siteMatch[1].replace(/,/g, ""));
    if (!priceSite)    priceSite     = priceOfficial;
    if (!priceOfficial) priceOfficial = priceSite;

    // ── Specs table ────────────────────────────────────────────
    const specs: Record<string, string> = {};

    // Method 1: <tr><td>key</td><td>value</td></tr>
    document.querySelectorAll<HTMLTableRowElement>("tr").forEach(row => {
      const cells = row.querySelectorAll("td,th");
      if (cells.length >= 2) {
        const k = (cells[0].textContent ?? "").trim();
        const v = (cells[1].textContent ?? "").trim().replace(/\s+/g, " ");
        if (k && v && k.length < 30) specs[k] = v;
      }
    });

    // Method 2: <dl><dt>key</dt><dd>value</dd></dl>
    document.querySelectorAll<HTMLElement>("dt").forEach(dt => {
      const dd = dt.nextElementSibling;
      if (dd?.tagName === "DD") {
        const k = (dt.textContent ?? "").trim();
        const v = (dd.textContent ?? "").trim().replace(/\s+/g, " ");
        if (k && v && k.length < 30) specs[k] = v;
      }
    });

    return { imageUrl, priceOfficial, priceSite, specs };
  });

  // Match YouTube reviews — exact keyword match only
  const reviews: { id: string; title: string }[] = [];
  for (const [kw, rvs] of Object.entries(YOUTUBE_REVIEWS)) {
    if (phone.sogiName.includes(kw)) {
      reviews.push(...rvs);
      break;
    }
  }

  return {
    ...phone,
    imageUrl: detail.imageUrl?.startsWith("http") ? detail.imageUrl : phone.imageUrl,
    priceOfficial: detail.priceOfficial || 0,
    priceSite: detail.priceSite || 0,
    specs: detail.specs,
    youtubeReviews: reviews,
  };
}

async function main() {
  console.log("🕷️  Playwright 爬蟲啟動...\n");
  fs.mkdirSync("scripts/screenshots", { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    locale: "zh-TW",
    extraHTTPHeaders: { "Accept-Language": "zh-TW,zh;q=0.9,en;q=0.8" },
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  // Block heavy resources to speed things up
  await page.route("**/*.{gif,mp4,mp3,woff,woff2}", r => r.abort());

  const allPhones: ScrapedPhone[] = [];

  for (const brandConfig of BRAND_CONFIG) {
    console.log(`\n📱 ${brandConfig.appBrand}`);
    let brandPhones: Omit<ScrapedPhone, "specs" | "priceOfficial" | "priceSite">[];
    try {
      brandPhones = await scrapeBrandPage(page, brandConfig);
    } catch (e) {
      console.warn(`  ⚠️ 品牌頁失敗：${e}`);
      continue;
    }

    for (const phone of brandPhones) {
      try {
        const detailed = await scrapePhoneDetail(page, phone);
        allPhones.push(detailed);
        const hasImg = !detailed.imageUrl.includes("placeholder");
        const specCount = Object.keys(detailed.specs).length;
        console.log(`      ${hasImg ? "✅圖" : "❌圖"} ${specCount}筆規格 NT$${detailed.priceSite || "?"}`);
      } catch (e) {
        console.warn(`      ⚠️ 詳細頁失敗：${e}`);
        allPhones.push({ ...phone, priceOfficial: 0, priceSite: 0, specs: {}, youtubeReviews: [] });
      }
      await delay(600);
    }
  }

  await browser.close();

  fs.writeFileSync("scripts/scraped-phones.json", JSON.stringify(allPhones, null, 2), "utf-8");
  console.log(`\n✅ 爬取完成！共 ${allPhones.length} 支手機`);
  console.log("📄 資料儲存於 scripts/scraped-phones.json");
  console.log("\n接著執行：npm run db:seed:scrape");
  process.exit(0);
}

main().catch(e => {
  console.error("❌ 爬蟲失敗：", e);
  process.exit(1);
});
