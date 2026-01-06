import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 問い合わせテーブル
 * LPからの問い合わせ情報を保存
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  /** お名前 */
  name: varchar("name", { length: 100 }).notNull(),
  /** メールアドレス */
  email: varchar("email", { length: 320 }),
  /** 電話番号 */
  phone: varchar("phone", { length: 20 }),
  /** ご住所 */
  address: text("address"),
  /** サービス種類 */
  serviceType: varchar("serviceType", { length: 50 }),
  /** お問い合わせ内容 */
  message: text("message").notNull(),
  /** UTMパラメータ（JSON形式） */
  utmParams: json("utmParams"),
  /** 流入元情報 */
  trafficSource: text("trafficSource"),
  /** ランディングページURL */
  landingPage: text("landingPage"),
  /** リファラー */
  referrer: text("referrer"),
  /** ステータス */
  status: mysqlEnum("status", ["new", "contacted", "quoted", "completed", "cancelled"]).default("new").notNull(),
  /** 作成日時 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  /** 更新日時 */
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * 問い合わせ写真テーブル
 * 問い合わせに添付された写真を管理
 */
export const inquiryPhotos = mysqlTable("inquiry_photos", {
  id: int("id").autoincrement().primaryKey(),
  /** 問い合わせID */
  inquiryId: int("inquiryId").notNull(),
  /** S3ファイルキー */
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  /** S3 URL */
  url: text("url").notNull(),
  /** ファイル名 */
  filename: varchar("filename", { length: 255 }),
  /** MIMEタイプ */
  mimeType: varchar("mimeType", { length: 100 }),
  /** ファイルサイズ（バイト） */
  fileSize: int("fileSize"),
  /** 作成日時 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InquiryPhoto = typeof inquiryPhotos.$inferSelect;
export type InsertInquiryPhoto = typeof inquiryPhotos.$inferInsert;
