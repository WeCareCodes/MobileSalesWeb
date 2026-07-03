import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL_UNPOOLED!);

async function migrate() {
  console.log("🔧 執行資料庫 migration...");

  // 1. Create phone_specs table
  await sql`
    CREATE TABLE IF NOT EXISTS phone_specs (
      id          SERIAL PRIMARY KEY,
      phone_id    INTEGER NOT NULL REFERENCES phones(id) ON DELETE CASCADE,
      display     TEXT NOT NULL,
      dimensions  TEXT NOT NULL,
      weight      TEXT NOT NULL,
      cpu         TEXT NOT NULL,
      ram         TEXT NOT NULL,
      storage     TEXT NOT NULL,
      battery     TEXT NOT NULL,
      camera_main  TEXT NOT NULL,
      camera_ultra TEXT,
      camera_tele  TEXT,
      camera_front TEXT NOT NULL,
      os          TEXT NOT NULL,
      network     TEXT NOT NULL,
      colors      JSONB NOT NULL DEFAULT '[]'
    )
  `;
  console.log("✅ 建立 phone_specs 資料表");

  // 2. Drop the old specs jsonb column from phones (if it exists)
  await sql`
    ALTER TABLE phones DROP COLUMN IF EXISTS specs
  `;
  console.log("✅ 移除 phones.specs JSONB 欄位");

  console.log("🎉 Migration 完成！");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration 失敗:", err);
  process.exit(1);
});
