import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as dotenv from "dotenv";
import * as schema from "../lib/schema";
import { phones, phoneSpecs } from "../lib/schema";
import type { NewPhone, NewPhoneSpec } from "../lib/schema";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

type SeedEntry = NewPhone & {
  specsData: Omit<NewPhoneSpec, "id" | "phoneId">;
};

const seedData: SeedEntry[] = [
  // ── Apple ──────────────────────────────────────────────────────────────────
  {
    brand: "Apple", name: "iPhone 16 Pro Max",
    imageUrl: "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_Full-Bleed-Image.jpg.large.jpg",
    priceOfficial: 49900, priceSite: 47900, popularityRank: 1, isFeatured: true,
    youtubeReviewUrl: "https://www.youtube.com/watch?v=YdtdV4hSxRQ",
    externalReviews: [
      { platform: "youtube", title: "iPhone 16 Pro Max 完整評測！值得升級嗎？", url: "https://www.youtube.com/watch?v=YdtdV4hSxRQ" },
      { platform: "youtube", title: "iPhone 16 Pro Max vs Samsung S25 Ultra 台灣比較", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
    specsData: {
      display: "6.9 吋 Super Retina XDR OLED，2868×1320，120Hz ProMotion",
      dimensions: "163.0 × 77.6 × 8.25 mm", weight: "227g",
      cpu: "Apple A18 Pro", ram: "8GB", storage: "256GB / 512GB / 1TB",
      battery: "4685mAh，MagSafe 25W / USB-C 27W",
      cameraMain: "48MP f/1.78，Fusion 主鏡頭，光學防手震",
      cameraUltra: "48MP f/2.2 超廣角，123° 視角",
      cameraTele: "12MP f/2.8，5x 光學望遠",
      cameraFront: "12MP TrueDepth，4K 錄影",
      os: "iOS 18", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["黑色鈦金屬", "白色鈦金屬", "原色鈦金屬", "沙漠色鈦金屬"],
    },
  },
  {
    brand: "Apple", name: "iPhone 16 Pro",
    imageUrl: "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_Full-Bleed-Image.jpg.large.jpg",
    priceOfficial: 42900, priceSite: 40900, popularityRank: 3, isFeatured: true,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.3 吋 Super Retina XDR OLED，2622×1206，120Hz ProMotion",
      dimensions: "149.6 × 71.5 × 8.25 mm", weight: "199g",
      cpu: "Apple A18 Pro", ram: "8GB", storage: "128GB / 256GB / 512GB / 1TB",
      battery: "3582mAh，MagSafe 25W / USB-C 27W",
      cameraMain: "48MP f/1.78 主鏡頭，光學防手震",
      cameraUltra: "48MP f/2.2 超廣角",
      cameraTele: "12MP f/2.8，5x 光學望遠",
      cameraFront: "12MP TrueDepth",
      os: "iOS 18", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["黑色鈦金屬", "白色鈦金屬", "原色鈦金屬", "沙漠色鈦金屬"],
    },
  },
  {
    brand: "Apple", name: "iPhone 16",
    imageUrl: "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-240909_Full-Bleed-Image.jpg.large.jpg",
    priceOfficial: 29900, priceSite: 28500, popularityRank: 6, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.1 吋 Super Retina XDR OLED，2556×1179，60Hz",
      dimensions: "147.6 × 71.6 × 7.80 mm", weight: "170g",
      cpu: "Apple A18", ram: "8GB", storage: "128GB / 256GB / 512GB",
      battery: "3561mAh，MagSafe 25W",
      cameraMain: "48MP f/1.6 主鏡頭",
      cameraUltra: "12MP f/2.2 超廣角",
      cameraTele: null,
      cameraFront: "12MP TrueDepth",
      os: "iOS 18", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["超藍色", "粉紅色", "白色", "黑色", "青色"],
    },
  },
  {
    brand: "Apple", name: "iPhone 16e",
    imageUrl: "https://www.apple.com/newsroom/images/2025/02/apple-introduces-iphone-16e/article/Apple-iPhone-16e-hero-250219_Full-Bleed-Image.jpg.large.jpg",
    priceOfficial: 19900, priceSite: 18900, popularityRank: null, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.1 吋 Super Retina XDR OLED，2556×1179，60Hz",
      dimensions: "138.7 × 67.1 × 7.80 mm", weight: "167g",
      cpu: "Apple A16 Bionic", ram: "6GB", storage: "128GB / 256GB",
      battery: "3279mAh，MagSafe 25W",
      cameraMain: "48MP f/1.6 主鏡頭",
      cameraUltra: null, cameraTele: null,
      cameraFront: "12MP TrueDepth",
      os: "iOS 18", network: "5G / 4G LTE / Wi-Fi 6",
      colors: ["黑色", "白色"],
    },
  },

  // ── Samsung ────────────────────────────────────────────────────────────────
  {
    brand: "Samsung", name: "Galaxy S25 Ultra",
    imageUrl: "https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-s/all-galaxy-s25/01142025/Galaxy-S25-Ultra-titanium-Black-1600x1200.jpg",
    priceOfficial: 49900, priceSite: 47500, popularityRank: 2, isFeatured: true,
    youtubeReviewUrl: "https://www.youtube.com/watch?v=0zHSzHrOEFQ",
    externalReviews: [{ platform: "youtube", title: "Galaxy S25 Ultra 完整評測！S Pen 新功能", url: "https://www.youtube.com/watch?v=0zHSzHrOEFQ" }],
    specsData: {
      display: "6.9 吋 QHD+ Dynamic AMOLED 2X，3088×1440，120Hz",
      dimensions: "162.8 × 77.6 × 8.2 mm", weight: "218g",
      cpu: "Snapdragon 8 Elite", ram: "12GB", storage: "256GB / 512GB / 1TB",
      battery: "5000mAh，45W 有線 / 15W 無線",
      cameraMain: "200MP f/1.7 主鏡頭，光學防手震",
      cameraUltra: "50MP f/1.9 超廣角",
      cameraTele: "10MP f/2.4 3x + 50MP f/3.4 5x 雙望遠",
      cameraFront: "12MP f/2.2",
      os: "Android 15 / One UI 7", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["鈦灰黑", "鈦銀白", "鈦藍灰", "鈦橙"],
    },
  },
  {
    brand: "Samsung", name: "Galaxy Z Fold 6",
    imageUrl: "https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-z/galaxy-z-fold6/07102024/Galaxy-Z-Fold6-Navy-1600x1200.jpg",
    priceOfficial: 59900, priceSite: 56900, popularityRank: 4, isFeatured: true,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "7.6 吋內螢幕 QXGA+ AMOLED，2176×1856，120Hz / 6.3 吋外螢幕，2376×968，120Hz",
      dimensions: "156.1 × 132.6 × 5.6 mm（展開） / 156.1 × 68.1 × 12.1 mm（折疊）", weight: "239g",
      cpu: "Snapdragon 8 Gen 3", ram: "12GB", storage: "256GB / 512GB / 1TB",
      battery: "4400mAh，25W 有線 / 15W 無線",
      cameraMain: "50MP f/1.8 主鏡頭，OIS",
      cameraUltra: "12MP f/2.2 超廣角",
      cameraTele: "10MP f/2.4 3x 望遠",
      cameraFront: "10MP 封面 / 4MP 內螢幕",
      os: "Android 14 / One UI 6.1.1", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["藍黑", "銀色", "白銀", "粉玫瑰"],
    },
  },
  {
    brand: "Samsung", name: "Galaxy Z Flip 6",
    imageUrl: "https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-z/galaxy-z-flip6/07102024/Galaxy-Z-Flip6-Mint-1600x1200.jpg",
    priceOfficial: 35900, priceSite: 33900, popularityRank: 5, isFeatured: true,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.7 吋內螢幕 FHD+ AMOLED，2640×1080，120Hz / 3.4 吋外螢幕",
      dimensions: "71.9 × 85.1 × 14.9 mm（折疊） / 165.1 × 71.9 × 6.9 mm（展開）", weight: "187g",
      cpu: "Snapdragon 8 Gen 3", ram: "12GB", storage: "256GB / 512GB",
      battery: "4000mAh，25W 有線 / 15W 無線",
      cameraMain: "50MP f/1.8 主鏡頭，OIS",
      cameraUltra: "12MP f/2.2 超廣角",
      cameraTele: null,
      cameraFront: "10MP f/2.2",
      os: "Android 14 / One UI 6.1.1", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["薄荷綠", "黃色", "藍色", "銀色", "黑色", "白色"],
    },
  },
  {
    brand: "Samsung", name: "Galaxy S25+",
    imageUrl: "https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-s/all-galaxy-s25/01142025/Galaxy-S25-Navy-1600x1200.jpg",
    priceOfficial: 39900, priceSite: 37900, popularityRank: 7, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.7 吋 QHD+ Dynamic AMOLED 2X，3088×1440，120Hz",
      dimensions: "158.5 × 75.8 × 7.3 mm", weight: "190g",
      cpu: "Snapdragon 8 Elite", ram: "12GB", storage: "256GB / 512GB",
      battery: "4900mAh，45W 有線 / 15W 無線",
      cameraMain: "50MP f/1.8 主鏡頭",
      cameraUltra: "12MP f/2.2 超廣角",
      cameraTele: "10MP f/2.4 3x 望遠",
      cameraFront: "12MP f/2.2",
      os: "Android 15 / One UI 7", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["冰藍灰", "冰銀白", "冰黑", "海軍藍"],
    },
  },
  {
    brand: "Samsung", name: "Galaxy S25",
    imageUrl: "https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-s/all-galaxy-s25/01142025/Galaxy-S25-Navy-1600x1200.jpg",
    priceOfficial: 31900, priceSite: 29900, popularityRank: 10, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.2 吋 FHD+ Dynamic AMOLED 2X，2340×1080，120Hz",
      dimensions: "146.9 × 70.5 × 7.2 mm", weight: "162g",
      cpu: "Snapdragon 8 Elite", ram: "12GB", storage: "128GB / 256GB",
      battery: "4000mAh，25W 有線 / 15W 無線",
      cameraMain: "50MP f/1.8 主鏡頭",
      cameraUltra: "12MP f/2.2 超廣角",
      cameraTele: "10MP f/2.4 3x 望遠",
      cameraFront: "12MP f/2.2",
      os: "Android 15 / One UI 7", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["冰藍灰", "冰銀白", "冰黑", "海軍藍"],
    },
  },
  {
    brand: "Samsung", name: "Galaxy A55 5G",
    imageUrl: "https://image-us.samsung.com/SamsungUS/home/mobile/galaxy-a/a55/04032024/A55-Iceblue-1600x1200.jpg",
    priceOfficial: 14990, priceSite: 13900, popularityRank: null, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.6 吋 FHD+ Super AMOLED，2340×1080，120Hz",
      dimensions: "161.1 × 77.4 × 8.2 mm", weight: "213g",
      cpu: "Exynos 1480", ram: "8GB", storage: "128GB / 256GB",
      battery: "5000mAh，25W 有線",
      cameraMain: "50MP f/1.8 主鏡頭，OIS",
      cameraUltra: "12MP f/2.2 超廣角",
      cameraTele: "5MP f/2.4 望遠",
      cameraFront: "32MP f/2.2",
      os: "Android 14 / One UI 6.1", network: "5G / 4G LTE / Wi-Fi 6",
      colors: ["藍色", "檸檬黃", "黑色", "紫色"],
    },
  },

  // ── ASUS ROG ───────────────────────────────────────────────────────────────
  {
    brand: "ASUS ROG", name: "ROG Phone 9 Pro",
    imageUrl: "https://dlcdnwebimgs.asus.com/gain/BD5FEB85-A4A1-42F8-A1AD-7FAC4F3BDEDE/w1000/h732",
    priceOfficial: 45990, priceSite: 43900, popularityRank: 8, isFeatured: true,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.78 吋 AMOLED，2400×1080，165Hz",
      dimensions: "163.8 × 76.8 × 8.9 mm", weight: "227g",
      cpu: "Snapdragon 8 Elite", ram: "16GB / 24GB", storage: "512GB / 1TB",
      battery: "5800mAh，65W 有線 / 15W 無線",
      cameraMain: "50MP f/1.9 主鏡頭，OIS",
      cameraUltra: "13MP f/2.2 超廣角",
      cameraTele: "32MP f/2.4 3x 望遠",
      cameraFront: "32MP f/2.0",
      os: "Android 15 / ROG UI", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["星空黑", "幻影白"],
    },
  },
  {
    brand: "ASUS ROG", name: "ROG Phone 8 Pro",
    imageUrl: "https://dlcdnwebimgs.asus.com/gain/BD5FEB85-A4A1-42F8-A1AD-7FAC4F3BDEDE/w1000/h732",
    priceOfficial: 37990, priceSite: 35900, popularityRank: null, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.78 吋 AMOLED，2400×1080，165Hz",
      dimensions: "163.8 × 76.8 × 8.9 mm", weight: "225g",
      cpu: "Snapdragon 8 Gen 3", ram: "16GB", storage: "512GB",
      battery: "5500mAh，65W 有線",
      cameraMain: "50MP f/1.9 主鏡頭",
      cameraUltra: "13MP 超廣角",
      cameraTele: "32MP 3x 望遠",
      cameraFront: "32MP",
      os: "Android 14 / ROG UI", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["星空黑", "雷鳴白"],
    },
  },

  // ── Sony ───────────────────────────────────────────────────────────────────
  {
    brand: "Sony", name: "Xperia 1 VI",
    imageUrl: "https://www.sony.com.tw/zh/products/1vi.png",
    priceOfficial: 39990, priceSite: 37900, popularityRank: 12, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.5 吋 4K HDR OLED，2340×1080，1-120Hz 可變更新率",
      dimensions: "162 × 74 × 8.2 mm", weight: "192g",
      cpu: "Snapdragon 8 Gen 3", ram: "12GB", storage: "256GB / 512GB",
      battery: "5000mAh，30W 有線 / 15W 無線",
      cameraMain: "52MP f/1.9 Zeiss 主鏡頭，OIS",
      cameraUltra: "12MP f/2.2 超廣角",
      cameraTele: "12MP f/2.3-3.5 3.5-5.2x 可變焦望遠",
      cameraFront: "12MP f/2.0",
      os: "Android 14", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["黑", "鉑金銀", "橄欖綠", "深紅"],
    },
  },
  {
    brand: "Sony", name: "Xperia 5 VI",
    imageUrl: "https://www.sony.com.tw/zh/products/5vi.png",
    priceOfficial: 30990, priceSite: 28900, popularityRank: null, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.1 吋 FHD+ OLED，2520×1080，120Hz",
      dimensions: "154 × 68 × 8.2 mm", weight: "182g",
      cpu: "Snapdragon 8 Gen 3", ram: "8GB", storage: "128GB / 256GB",
      battery: "4000mAh，30W 有線",
      cameraMain: "48MP f/1.9 Zeiss 主鏡頭",
      cameraUltra: "12MP 超廣角",
      cameraTele: "12MP 3.5-5.2x 可變焦",
      cameraFront: "12MP",
      os: "Android 14", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["黑", "藍"],
    },
  },

  // ── Google ─────────────────────────────────────────────────────────────────
  {
    brand: "Google", name: "Pixel 9 Pro XL",
    imageUrl: "https://lh3.googleusercontent.com/rcTH0nvM8m3r7xwMDVxhqfYmEi0r5yc3CU_OJjZ5gAAlAUqHJJKsP2Z_yQ",
    priceOfficial: 39900, priceSite: 37900, popularityRank: 11, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.8 吋 LTPO OLED，3120×1440，1-120Hz",
      dimensions: "162.8 × 76.6 × 8.5 mm", weight: "221g",
      cpu: "Google Tensor G4", ram: "16GB", storage: "128GB / 256GB / 512GB / 1TB",
      battery: "5060mAh，37W 有線 / 23W 無線",
      cameraMain: "50MP f/1.68 主鏡頭，OIS",
      cameraUltra: "48MP f/1.7 超廣角",
      cameraTele: "48MP f/2.8 5x 望遠",
      cameraFront: "42MP f/2.2",
      os: "Android 15", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["黑曜石", "瓷白", "薔薇", "榛子"],
    },
  },
  {
    brand: "Google", name: "Pixel 9",
    imageUrl: "https://lh3.googleusercontent.com/rcTH0nvM8m3r7xwMDVxhqfYmEi0r5yc3CU_OJjZ5gAAlAUqHJJKsP2Z_yQ",
    priceOfficial: 28900, priceSite: 26900, popularityRank: null, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.3 吋 OLED，2424×1080，60-120Hz",
      dimensions: "152.9 × 72.0 × 8.5 mm", weight: "198g",
      cpu: "Google Tensor G4", ram: "12GB", storage: "128GB / 256GB",
      battery: "4700mAh，27W 有線 / 15W 無線",
      cameraMain: "50MP f/1.68 主鏡頭",
      cameraUltra: "48MP f/1.7 超廣角",
      cameraTele: null,
      cameraFront: "10.5MP f/2.2",
      os: "Android 15", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["黑曜石", "瓷白", "薔薇", "冬青"],
    },
  },
  {
    brand: "Google", name: "Pixel 9 Pro Fold",
    imageUrl: "https://lh3.googleusercontent.com/rcTH0nvM8m3r7xwMDVxhqfYmEi0r5yc3CU_OJjZ5gAAlAUqHJJKsP2Z_yQ",
    priceOfficial: 55900, priceSite: 52900, popularityRank: 13, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "8.0 吋內螢幕 OLED，2076×2152，120Hz / 6.3 吋外螢幕，2424×1080，120Hz",
      dimensions: "155.2 × 150.2 × 5.1 mm（展開） / 155.2 × 77.1 × 10.5 mm（折疊）", weight: "257g",
      cpu: "Google Tensor G4", ram: "16GB", storage: "256GB / 512GB",
      battery: "4650mAh，21W 有線 / 7.5W 無線",
      cameraMain: "48MP f/1.7 主鏡頭，OIS",
      cameraUltra: "10.5MP f/2.2 超廣角",
      cameraTele: "10.8MP f/3.1 5x 望遠",
      cameraFront: "10MP 封面 / 10MP 內螢幕",
      os: "Android 14", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["黑曜石", "瓷白"],
    },
  },

  // ── Xiaomi ─────────────────────────────────────────────────────────────────
  {
    brand: "Xiaomi", name: "Xiaomi 15 Ultra",
    imageUrl: "https://i01.appmifile.com/webfile/globalimg/products/pc/xiaomi-15-ultra/overview_intro_01.jpg",
    priceOfficial: 39990, priceSite: 37900, popularityRank: 9, isFeatured: true,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.73 吋 2K LTPO AMOLED，3200×1440，1-120Hz",
      dimensions: "161.3 × 75.3 × 9.5 mm", weight: "226g",
      cpu: "Snapdragon 8 Elite", ram: "12GB / 16GB", storage: "256GB / 512GB / 1TB",
      battery: "5000mAh，90W 有線 / 80W 無線",
      cameraMain: "50MP f/1.63 Leica 主鏡頭，1 吋感光元件",
      cameraUltra: "200MP f/2.48 超廣角望遠",
      cameraTele: "50MP f/2.5 5x 望遠",
      cameraFront: "32MP f/2.0",
      os: "Android 15 / HyperOS 2", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["鈦灰黑", "鈦灰白"],
    },
  },
  {
    brand: "Xiaomi", name: "Redmi Note 14 Pro+ 5G",
    imageUrl: "https://i01.appmifile.com/webfile/globalimg/products/pc/redmi-note14pro.jpg",
    priceOfficial: 12990, priceSite: 11900, popularityRank: 15, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.67 吋 FHD+ AMOLED，2712×1220，120Hz",
      dimensions: "161.4 × 74.3 × 8.6 mm", weight: "204g",
      cpu: "Snapdragon 7s Gen 3", ram: "8GB / 12GB", storage: "256GB / 512GB",
      battery: "5110mAh，90W 有線",
      cameraMain: "200MP f/1.65 主鏡頭，OIS",
      cameraUltra: "8MP f/2.2 超廣角",
      cameraTele: "2MP 微距",
      cameraFront: "20MP f/2.24",
      os: "Android 14 / HyperOS", network: "5G / 4G LTE / Wi-Fi 6",
      colors: ["幻紫", "暮光黑", "珍珠白"],
    },
  },

  // ── OPPO ───────────────────────────────────────────────────────────────────
  {
    brand: "OPPO", name: "Find X8 Pro",
    imageUrl: "https://image.oppo.com/content/dam/oppo/common/mkt/v2-2/find-x8-pro/overview/intro.jpg",
    priceOfficial: 39990, priceSite: 37900, popularityRank: 14, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.78 吋 2K LTPO AMOLED，2780×1264，1-120Hz",
      dimensions: "163.9 × 75.7 × 8.2 mm", weight: "218g",
      cpu: "Dimensity 9400", ram: "12GB / 16GB", storage: "256GB / 512GB",
      battery: "5910mAh，80W 有線 / 50W 無線",
      cameraMain: "50MP f/1.6 Hasselblad 主鏡頭，OIS",
      cameraUltra: "50MP f/2.0 超廣角",
      cameraTele: "50MP f/2.6 3x 望遠",
      cameraFront: "32MP f/2.4",
      os: "Android 15 / ColorOS 15", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["晴空白", "太空黑"],
    },
  },

  // ── vivo ───────────────────────────────────────────────────────────────────
  {
    brand: "vivo", name: "vivo X200 Pro",
    imageUrl: "https://www.vivo.com/content/dam/vivo/common/banner/x200pro.jpg",
    priceOfficial: 39990, priceSite: 37900, popularityRank: 16, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.78 吋 2K LTPO AMOLED，2800×1260，1-120Hz",
      dimensions: "164.4 × 75.9 × 8.2 mm", weight: "229g",
      cpu: "Dimensity 9400", ram: "16GB", storage: "256GB / 512GB / 1TB",
      battery: "6000mAh，90W 有線 / 30W 無線",
      cameraMain: "50MP f/1.57 ZEISS Omnivision 主鏡頭，OIS",
      cameraUltra: "50MP f/2.0 超廣角",
      cameraTele: "200MP f/2.67 3.7x 望遠",
      cameraFront: "32MP f/2.0",
      os: "Android 15 / OriginOS 5", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["深空黑", "晨曦金"],
    },
  },

  // ── Nothing ────────────────────────────────────────────────────────────────
  {
    brand: "Nothing", name: "Nothing Phone (3a)",
    imageUrl: "https://nothing.tech/cdn/shop/files/phone3a-black.jpg",
    priceOfficial: 12990, priceSite: 11900, popularityRank: 17, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.77 吋 AMOLED，2392×1080，120Hz",
      dimensions: "162.1 × 77.5 × 8.3 mm", weight: "201g",
      cpu: "Snapdragon 7s Gen 3", ram: "8GB / 12GB", storage: "128GB / 256GB",
      battery: "5000mAh，50W 有線 / 15W 無線",
      cameraMain: "50MP f/1.88 主鏡頭，OIS",
      cameraUltra: "8MP f/2.2 超廣角",
      cameraTele: "50MP f/2.0 2x 望遠",
      cameraFront: "32MP f/2.2",
      os: "Android 15 / Nothing OS 3.1", network: "5G / 4G LTE / Wi-Fi 6",
      colors: ["黑", "白"],
    },
  },

  // ── OnePlus ────────────────────────────────────────────────────────────────
  {
    brand: "OnePlus", name: "OnePlus 13",
    imageUrl: "https://oasis.opstatics.com/content/dam/oasis/product/2024/OnePlus13.jpg",
    priceOfficial: 31990, priceSite: 29900, popularityRank: 18, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.82 吋 2K LTPO AMOLED，3168×1440，1-120Hz",
      dimensions: "162.9 × 76.0 × 8.9 mm", weight: "210g",
      cpu: "Snapdragon 8 Elite", ram: "12GB / 16GB", storage: "256GB / 512GB",
      battery: "6000mAh，100W 有線 / 50W 無線",
      cameraMain: "50MP f/1.6 Hasselblad 主鏡頭，OIS",
      cameraUltra: "50MP f/2.0 超廣角",
      cameraTele: "50MP f/2.6 3x 望遠",
      cameraFront: "32MP f/2.4",
      os: "Android 15 / OxygenOS 15", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["綠色", "白色", "黑色"],
    },
  },

  // ── Motorola ───────────────────────────────────────────────────────────────
  {
    brand: "Motorola", name: "Motorola Edge 50 Ultra",
    imageUrl: "https://motorola-global-portal.custhelp.com/ci/fattach/get/edge50ultra.jpg",
    priceOfficial: 26990, priceSite: 24900, popularityRank: 19, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.67 吋 2K pOLED，2712×1220，144Hz",
      dimensions: "161.1 × 72.4 × 8.4 mm", weight: "206g",
      cpu: "Snapdragon 8s Gen 3", ram: "12GB", storage: "256GB / 512GB",
      battery: "4500mAh，125W 有線 / 50W 無線",
      cameraMain: "50MP f/1.8 主鏡頭，OIS",
      cameraUltra: "50MP f/2.2 超廣角",
      cameraTele: "64MP f/2.4 3x 望遠",
      cameraFront: "50MP f/2.0",
      os: "Android 14", network: "5G / 4G LTE / Wi-Fi 7",
      colors: ["北極白", "沙漠鈦", "星際黑"],
    },
  },

  // ── Nokia ──────────────────────────────────────────────────────────────────
  {
    brand: "Nokia", name: "Nokia XR21",
    imageUrl: "https://i03.appmifile.com/896_operator_sg/31/10/2023/c1b48cdea44f55aef6a25c5c1e8e0b3e.jpg",
    priceOfficial: 16990, priceSite: 14900, popularityRank: 20, isFeatured: false,
    youtubeReviewUrl: null, externalReviews: [],
    specsData: {
      display: "6.49 吋 FHD+ LCD，2400×1080，90Hz",
      dimensions: "171.5 × 81.0 × 10.9 mm", weight: "248g",
      cpu: "Snapdragon 695 5G", ram: "6GB", storage: "128GB",
      battery: "4800mAh，18W 有線",
      cameraMain: "64MP f/1.8 主鏡頭",
      cameraUltra: "5MP f/2.2 超廣角",
      cameraTele: null,
      cameraFront: "16MP f/2.0",
      os: "Android 12 (保證升級至 Android 14)", network: "5G / 4G LTE / Wi-Fi 6",
      colors: ["黑色"],
    },
  },
];

async function seed() {
  console.log("🌱 開始植入手機資料...");

  await db.delete(phoneSpecs);
  await db.delete(phones);
  console.log("✅ 清除舊資料");

  for (const entry of seedData) {
    const { specsData, ...phoneData } = entry;

    const [inserted] = await db.insert(phones).values(phoneData).returning({ id: phones.id });
    await db.insert(phoneSpecs).values({ ...specsData, phoneId: inserted.id });

    console.log(`   ✓ ${phoneData.brand} ${phoneData.name}`);
  }

  console.log(`\n✅ 成功植入 ${seedData.length} 筆手機 + 規格資料`);
  console.log("🎉 完成！");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ 植入失敗:", err);
  process.exit(1);
});
