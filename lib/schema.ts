import {
  pgTable,
  serial,
  text,
  integer,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── phones ────────────────────────────────────────────────────────────────────
export const phones = pgTable("phones", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  priceOfficial: integer("price_official").notNull(), // TWD MSRP
  priceSite: integer("price_site").notNull(),         // TWD our price
  popularityRank: integer("popularity_rank"),
  isFeatured: boolean("is_featured").default(false),
  youtubeReviewUrl: text("youtube_review_url"),
  externalReviews: jsonb("external_reviews").$type<ExternalReview[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

// ── phone_specs ───────────────────────────────────────────────────────────────
export const phoneSpecs = pgTable("phone_specs", {
  id: serial("id").primaryKey(),
  phoneId: integer("phone_id").notNull().references(() => phones.id, { onDelete: "cascade" }),

  // Display
  display: text("display").notNull(),       // e.g. "6.7 吋 OLED, 2796×1290, 120Hz"

  // Physical
  dimensions: text("dimensions").notNull(), // e.g. "163.0 × 77.6 × 8.25 mm"
  weight: text("weight").notNull(),         // e.g. "228g"

  // Performance
  cpu: text("cpu").notNull(),               // e.g. "Apple A18 Pro"
  ram: text("ram").notNull(),               // e.g. "8GB"
  storage: text("storage").notNull(),       // e.g. "256GB / 512GB / 1TB"

  // Battery
  battery: text("battery").notNull(),       // e.g. "4685mAh, 30W 有線充電"

  // Camera
  cameraMain: text("camera_main").notNull(),
  cameraUltra: text("camera_ultra"),
  cameraTele: text("camera_tele"),
  cameraFront: text("camera_front").notNull(),

  // Software & connectivity
  os: text("os").notNull(),
  network: text("network").notNull(),

  // Colors (stored as JSON array of strings)
  colors: jsonb("colors").notNull().$type<string[]>(),
});

// ── relations ─────────────────────────────────────────────────────────────────
export const phonesRelations = relations(phones, ({ one }) => ({
  specs: one(phoneSpecs, {
    fields: [phones.id],
    references: [phoneSpecs.phoneId],
  }),
}));

export const phoneSpecsRelations = relations(phoneSpecs, ({ one }) => ({
  phone: one(phones, {
    fields: [phoneSpecs.phoneId],
    references: [phones.id],
  }),
}));

// ── types ─────────────────────────────────────────────────────────────────────
export type ExternalReview = {
  platform: "youtube" | "facebook" | "instagram" | "blog";
  title: string;
  url: string;
  thumbnail?: string;
};

export type Phone = typeof phones.$inferSelect;
export type NewPhone = typeof phones.$inferInsert;
export type PhoneSpec = typeof phoneSpecs.$inferSelect;
export type NewPhoneSpec = typeof phoneSpecs.$inferInsert;
export type PhoneWithSpecs = Phone & { specs: PhoneSpec | null };
