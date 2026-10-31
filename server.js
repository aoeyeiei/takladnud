const express = require("express");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const mariadb = require("mariadb");
const crypto = require("crypto");

const app = express();
const pool = mariadb.createPool({
  host: "10.200.210.117",
  port: 3306,
  user: "std08",
  password: "std08",
  database: "db_std08",
  connectionLimit: 5,
  charset: "utf8mb4"
});

class MariaSessionStore extends session.Store {
  async get(sid, callback) {
    try {
      const rows = await pool.query("SELECT session_data, expires_at FROM app_sessions WHERE session_id = ?", [sid]);
      if (!rows.length || new Date(rows[0].expires_at) <= new Date()) return callback(null, null);
      callback(null, JSON.parse(rows[0].session_data));
    } catch (error) { callback(error); }
  }
  async set(sid, value, callback) {
    try {
      const expiresAt = value.cookie && value.cookie.expires ? new Date(value.cookie.expires) : new Date(Date.now() + 86400000);
      await pool.query("INSERT INTO app_sessions (session_id, session_data, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE session_data = VALUES(session_data), expires_at = VALUES(expires_at)", [sid, JSON.stringify(value), expiresAt]);
      if (callback) callback(null);
    } catch (error) { if (callback) callback(error); }
  }
  async destroy(sid, callback) {
    try { await pool.query("DELETE FROM app_sessions WHERE session_id = ?", [sid]); if (callback) callback(null); }
    catch (error) { if (callback) callback(error); }
  }
  async touch(sid, value, callback) { this.set(sid, value, callback); }
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "32kb" }));
app.use(session({
  name: "takhladnat.sid",
  secret: crypto.randomBytes(48).toString("hex"),
  store: new MariaSessionStore(),
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", secure: "auto", maxAge: 7 * 24 * 60 * 60 * 1000 }
}));
app.use((req, res, next) => {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method) && req.path.startsWith("/api/") && req.get("origin")) {
    const origin = new URL(req.get("origin")).host;
    if (origin !== req.get("host")) return res.status(403).json({ error: { code: "CSRF_REJECTED", message: "คำขอไม่ผ่านการตรวจสอบ" } });
  }
  next();
});
app.use(express.static("public"));

const fail = (res, status, code, message, fields) => res.status(status).json({ error: { code, message, ...(fields ? { fields } : {}) } });
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const requireShop = (req, res, next) => req.session.shopId ? next() : fail(res, 401, "UNAUTHENTICATED", "กรุณาเข้าสู่ระบบร้านค้าก่อน");
const validDate = (value) => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`)) && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
const cleanEmail = (value) => String(value || "").trim().toLowerCase();

async function initializeDatabase() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS app_sessions (session_id VARCHAR(128) PRIMARY KEY, session_data MEDIUMTEXT NOT NULL, expires_at DATETIME NOT NULL, INDEX idx_sessions_expiry (expires_at)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS users (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, email VARCHAR(254) NOT NULL UNIQUE, password_hash VARCHAR(255) NOT NULL, contact_name VARCHAR(120) NOT NULL, phone VARCHAR(30) NOT NULL, account_status ENUM('active','disabled') NOT NULL DEFAULT 'active', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS categories (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(80) NOT NULL UNIQUE, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS shops (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, user_id INT UNSIGNED NOT NULL UNIQUE, category_id INT UNSIGNED NULL, name VARCHAR(150) NOT NULL, description TEXT NULL, public_phone VARCHAR(30) NULL, public_contact VARCHAR(255) NULL, is_published TINYINT(1) NOT NULL DEFAULT 0, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, CONSTRAINT fk_shops_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT fk_shops_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS markets (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(150) NOT NULL, description TEXT NULL, address VARCHAR(255) NULL, timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Bangkok', map_image_path VARCHAR(255) NULL, public_code VARCHAR(64) NOT NULL UNIQUE, is_active TINYINT(1) NOT NULL DEFAULT 1, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS booths (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, market_id INT UNSIGNED NOT NULL, booth_code VARCHAR(32) NOT NULL, description VARCHAR(255) NULL, map_x DECIMAL(8,5) NULL, map_y DECIMAL(8,5) NULL, map_width DECIMAL(8,5) NULL, map_height DECIMAL(8,5) NULL, base_status ENUM('available','unavailable') NOT NULL DEFAULT 'available', created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, UNIQUE KEY uq_booth_code (market_id, booth_code), CONSTRAINT fk_booth_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS market_facilities (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, market_id INT UNSIGNED NOT NULL, facility_type ENUM('parking_car','parking_motorcycle','seating') NOT NULL, name VARCHAR(120) NOT NULL, description VARCHAR(255) NULL, location_label VARCHAR(100) NULL, capacity SMALLINT UNSIGNED NOT NULL DEFAULT 0, occupied_count SMALLINT UNSIGNED NOT NULL DEFAULT 0, map_x DECIMAL(8,5) NULL, map_y DECIMAL(8,5) NULL, status ENUM('open','closed') NOT NULL DEFAULT 'open', updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_facility_market (market_id, facility_type), CONSTRAINT fk_facility_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS market_food_recommendations (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, market_id INT UNSIGNED NOT NULL, booth_id INT UNSIGNED NOT NULL, name VARCHAR(120) NOT NULL, cuisine VARCHAR(60) NOT NULL, description VARCHAR(255) NOT NULL, image_path VARCHAR(255) NOT NULL, price_label VARCHAR(80) NULL, is_demo TINYINT(1) NOT NULL DEFAULT 0, is_active TINYINT(1) NOT NULL DEFAULT 1, featured_order SMALLINT UNSIGNED NOT NULL DEFAULT 0, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE KEY uq_recommendation_market_name (market_id, name), INDEX idx_recommendation_market_active (market_id, is_active, featured_order), CONSTRAINT fk_recommendation_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE CASCADE, CONSTRAINT fk_recommendation_booth FOREIGN KEY (booth_id) REFERENCES booths(id) ON DELETE RESTRICT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
    `CREATE TABLE IF NOT EXISTS bookings (id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY, shop_id INT UNSIGNED NOT NULL, market_id INT UNSIGNED NOT NULL, booth_id INT UNSIGNED NOT NULL, status ENUM('confirmed','cancelled','completed') NOT NULL DEFAULT 'confirmed', booking_date DATE NOT NULL, shop_name_snapshot VARCHAR(150) NOT NULL, category_name_snapshot VARCHAR(80) NULL, description_snapshot TEXT NULL, contact_snapshot VARCHAR(255) NULL, shop_note VARCHAR(500) NULL, review_note VARCHAR(500) NULL, created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, INDEX idx_booking_shop_created (shop_id, created_at), INDEX idx_booking_booth_date (booth_id, booking_date, status), INDEX idx_booking_market_date (market_id, booking_date, status), CONSTRAINT fk_booking_shop FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE RESTRICT, CONSTRAINT fk_booking_market FOREIGN KEY (market_id) REFERENCES markets(id) ON DELETE RESTRICT, CONSTRAINT fk_booking_booth FOREIGN KEY (booth_id) REFERENCES booths(id) ON DELETE RESTRICT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`
  ];
  for (const sql of statements) await pool.query(sql);
  await pool.query("INSERT IGNORE INTO categories (name) VALUES (?), (?), (?), (?), (?), (?)", ["อาหาร", "เครื่องดื่ม", "เสื้อผ้า", "ของใช้", "งานฝีมือ", "อื่น ๆ"]);
  await pool.query("INSERT IGNORE INTO markets (name, description, address, timezone, public_code, is_active) VALUES (?, ?, ?, 'Asia/Bangkok', ?, 1)", ["ตลาดตัวอย่าง ตากหลาดนัด", "ข้อมูลตัวอย่างสำหรับทดลองระบบ สามารถแทนที่ด้วยข้อมูลตลาดจริง", "ข้อมูลที่อยู่ตัวอย่าง", "demo-takhladnat"]);
  const demoMarket = await pool.query("SELECT id FROM markets WHERE public_code = ?", ["demo-takhladnat"]);
  for (let row = 0; row < 5; row += 1) {
    for (let column = 0; column < 10; column += 1) {
      const code = `${String.fromCharCode(65 + row)}${String(column + 1).padStart(2, "0")}`;
      const mapX = 4 + column * 9;
      const mapY = 8 + row * 13;
      await pool.query("INSERT IGNORE INTO booths (market_id, booth_code, description, map_x, map_y, map_width, map_height) VALUES (?, ?, ?, ?, ?, 7, 9)", [demoMarket[0].id, code, `โซน ${String.fromCharCode(65 + row)}`, mapX, mapY]);
      await pool.query("UPDATE booths SET description=?, map_x=?, map_y=?, map_width=7, map_height=9 WHERE market_id=? AND booth_code=?", [`โซน ${String.fromCharCode(65 + row)}`, mapX, mapY, demoMarket[0].id, code]);
    }
  }
  const facilities = [
    ["parking_car", "ลานจอดรถยนต์", "จอดรถยนต์และรถกระบะ", "ประตูเหนือ", 48, 17, 5, 82],
    ["parking_motorcycle", "ลานจอดมอเตอร์ไซค์", "จอดมอเตอร์ไซค์และจักรยาน", "ประตูตะวันตก", 80, 31, 83, 82],
    ["seating", "ศูนย์อาหารกลางตลาด", "โต๊ะนั่งทานอาหาร มีหลังคา", "โซน F · กลางตลาด", 64, 28, 46, 80],
    ["seating", "สวนพักใจ", "ม้านั่งใต้ร่มไม้", "โซน G · สวนด้านใน", 24, 5, 75, 17]
  ];
  for (const facility of facilities) {
    await pool.query("INSERT INTO market_facilities (market_id, facility_type, name, description, location_label, capacity, occupied_count, map_x, map_y, status) SELECT ?, ?, ?, ?, ?, ?, ?, ?, ?, 'open' WHERE NOT EXISTS (SELECT 1 FROM market_facilities WHERE market_id=? AND name=?)", [demoMarket[0].id, ...facility, demoMarket[0].id, facility[1]]);
  }
  const recommendations = [
    ["A02", "เส้นสดบ้านอิ่ม", "ก๋วยเตี๋ยว · อาหารจานเดียว", "ก๋วยเตี๋ยวปรุงสด น้ำซุปหอม เลือกเครื่องได้ตามชอบ", "/images/food-noodles.jpg", "เริ่มต้นประมาณ 50 บาท", 1],
    ["B03", "ข้าวจานอิ่ม", "ข้าวหน้า · อาหารจานเดียว", "เมนูข้าวหน้ากับผักและเครื่องเคียง ทำใหม่พร้อมเสิร์ฟ", "/images/food-rice.jpg", "เริ่มต้นประมาณ 45 บาท", 2],
    ["C05", "เตาถ่านบ้านสวน", "ปิ้งย่าง · ของทานเล่น", "ของย่างหอมเตาถ่าน พร้อมน้ำจิ้มรสจัดจ้าน", "/images/food-grill.jpg", "เริ่มต้นประมาณ 20 บาท", 3],
    ["D07", "ขนมหวานละมุน", "ขนมหวาน · ของหวาน", "ขนมหวานและของว่าง ทำเป็นรอบเล็ก ๆ สดใหม่", "/images/food-dessert.jpg", "เริ่มต้นประมาณ 35 บาท", 4]
  ];
  await pool.query("UPDATE market_food_recommendations SET is_active=0 WHERE market_id=? AND name=? AND is_demo=1", [demoMarket[0].id, "ข้าวแกงคุณละไม"]);
  for (const [boothCode, name, cuisine, description, imagePath, priceLabel, order] of recommendations) {
    const booth = await pool.query("SELECT id FROM booths WHERE market_id=? AND booth_code=?", [demoMarket[0].id, boothCode]);
    if (booth.length) {
      await pool.query(`INSERT INTO market_food_recommendations (market_id, booth_id, name, cuisine, description, image_path, price_label, is_demo, featured_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        ON DUPLICATE KEY UPDATE booth_id=VALUES(booth_id), cuisine=VALUES(cuisine), description=VALUES(description), image_path=VALUES(image_path), price_label=VALUES(price_label), is_demo=1, is_active=1, featured_order=VALUES(featured_order)`, [demoMarket[0].id, booth[0].id, name, cuisine, description, imagePath, priceLabel, order]);
    }
  }
}

app.get("/api/v1/health", asyncRoute(async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ data: { status: "ok", database: "connected" } });
}));
app.get("/api/v1/public/categories", asyncRoute(async (req, res) => {
  const rows = await pool.query("SELECT id, name FROM categories ORDER BY name");
  res.json({ data: rows });
}));
app.get("/api/v1/public/markets", asyncRoute(async (req, res) => {
  const rows = await pool.query("SELECT id, name, description, address, public_code FROM markets WHERE is_active = 1 ORDER BY name");
  res.json({ data: rows });
}));
app.get("/api/v1/public/markets/:code", asyncRoute(async (req, res) => {
  const rows = await pool.query("SELECT id, name, description, address, timezone, map_image_path, public_code FROM markets WHERE public_code = ? AND is_active = 1", [req.params.code]);
  if (!rows.length) return fail(res, 404, "MARKET_NOT_FOUND", "ไม่พบตลาดนี้");
  res.json({ data: rows[0] });
}));
app.get("/api/v1/public/markets/:code/map", asyncRoute(async (req, res) => {
  const markets = await pool.query("SELECT id, name, description, address, timezone, map_image_path, public_code FROM markets WHERE public_code = ? AND is_active = 1", [req.params.code]);
  if (!markets.length) return fail(res, 404, "MARKET_NOT_FOUND", "ไม่พบตลาดนี้");
  const market = markets[0];
  const date = req.query.booking_date || new Intl.DateTimeFormat("en-CA", { timeZone: market.timezone }).format(new Date());
  if (!validDate(date)) return fail(res, 422, "INVALID_BOOKING_DATE", "วันที่ไม่ถูกต้อง");
  const booths = await pool.query(`SELECT b.id, b.booth_code, b.description, b.map_x, b.map_y, b.map_width, b.map_height, b.base_status,
    CASE WHEN b.base_status = 'unavailable' THEN 'unavailable' WHEN bk.id IS NOT NULL THEN 'confirmed' ELSE 'available' END AS status,
    CASE WHEN s.is_published = 1 THEN s.id ELSE NULL END AS shop_id,
    CASE WHEN s.is_published = 1 THEN bk.shop_name_snapshot ELSE NULL END AS shop_name,
    CASE WHEN s.is_published = 1 THEN COALESCE(c.name, bk.category_name_snapshot) ELSE NULL END AS category_name
    FROM booths b LEFT JOIN bookings bk ON bk.booth_id = b.id AND bk.booking_date = ? AND bk.status = 'confirmed'
    LEFT JOIN shops s ON s.id = bk.shop_id LEFT JOIN categories c ON c.id = s.category_id
    WHERE b.market_id = ? ORDER BY b.booth_code`, [date, market.id]);
  const facilities = await pool.query("SELECT id, facility_type, name, description, location_label, capacity, occupied_count, GREATEST(capacity - occupied_count, 0) AS available_count, map_x, map_y, status FROM market_facilities WHERE market_id = ? ORDER BY facility_type, name", [market.id]);
  res.json({ data: { market, booking_date: date, booths, facilities } });
}));
app.get("/api/v1/public/markets/:code/facilities", asyncRoute(async (req, res) => {
  const markets = await pool.query("SELECT id FROM markets WHERE public_code = ? AND is_active = 1", [req.params.code]);
  if (!markets.length) return fail(res, 404, "MARKET_NOT_FOUND", "ไม่พบตลาดนี้");
  const facilities = await pool.query("SELECT id, facility_type, name, description, location_label, capacity, occupied_count, GREATEST(capacity - occupied_count, 0) AS available_count, map_x, map_y, status FROM market_facilities WHERE market_id = ? ORDER BY facility_type, name", [markets[0].id]);
  res.json({ data: facilities });
}));
app.get("/api/v1/public/markets/:code/recommendations", asyncRoute(async (req, res) => {
  const markets = await pool.query("SELECT id, timezone FROM markets WHERE public_code = ? AND is_active = 1", [req.params.code]);
  if (!markets.length) return fail(res, 404, "MARKET_NOT_FOUND", "ไม่พบตลาดนี้");
  const date = req.query.booking_date || new Intl.DateTimeFormat("en-CA", { timeZone: markets[0].timezone }).format(new Date());
  if (!validDate(date)) return fail(res, 422, "INVALID_BOOKING_DATE", "วันที่ไม่ถูกต้อง");
  const recommendations = await pool.query(`SELECT r.id, r.name, r.cuisine, r.description, r.image_path, r.price_label, r.is_demo,
    b.id AS booth_id, b.booth_code, b.map_x, b.map_y,
    CASE WHEN b.base_status='unavailable' THEN 'unavailable'
         WHEN EXISTS (SELECT 1 FROM bookings bk WHERE bk.booth_id=b.id AND bk.booking_date=? AND bk.status='confirmed') THEN 'confirmed'
         ELSE 'available' END AS booth_status
    FROM market_food_recommendations r
    JOIN booths b ON b.id=r.booth_id
    WHERE r.market_id=? AND r.is_active=1
    ORDER BY r.featured_order, r.name`, [date, markets[0].id]);
  res.json({ data: recommendations });
}));
app.get("/api/v1/public/markets/:code/shops", asyncRoute(async (req, res) => {
  const markets = await pool.query("SELECT id, timezone FROM markets WHERE public_code = ? AND is_active = 1", [req.params.code]);
  if (!markets.length) return fail(res, 404, "MARKET_NOT_FOUND", "ไม่พบตลาดนี้");
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const search = `%${String(req.query.q || "").slice(0, 100)}%`;
  const categoryId = req.query.category_id ? Number(req.query.category_id) : null;
  const date = req.query.booking_date || new Intl.DateTimeFormat("en-CA", { timeZone: markets[0].timezone }).format(new Date());
  if (!validDate(date)) return fail(res, 422, "INVALID_BOOKING_DATE", "วันที่ไม่ถูกต้อง");
  const where = "bk.market_id = ? AND bk.status = 'confirmed' AND bk.booking_date = ? AND s.is_published = 1 AND (? IS NULL OR s.category_id = ?) AND (? = '%%' OR s.name LIKE ?)";
  const params = [markets[0].id, date, categoryId, categoryId, search, search];
  const counts = await pool.query(`SELECT COUNT(DISTINCT s.id) AS total FROM bookings bk JOIN shops s ON s.id=bk.shop_id WHERE ${where}`, params);
  const rows = await pool.query(`SELECT DISTINCT s.id, s.name, s.description, s.public_phone, s.public_contact, c.id AS category_id, c.name AS category_name, b.booth_code
    FROM bookings bk JOIN shops s ON s.id=bk.shop_id JOIN booths b ON b.id=bk.booth_id LEFT JOIN categories c ON c.id=s.category_id
    WHERE ${where} ORDER BY s.name LIMIT ? OFFSET ?`, [...params, limit, (page - 1) * limit]);
  res.json({ data: rows, meta: { page, limit, total: Number(counts[0].total) } });
}));
app.post("/api/v1/auth/register", asyncRoute(async (req, res) => {
  const { contact_name, email, phone, password, shop } = req.body || {};
  const errors = {};
  if (!contact_name || String(contact_name).trim().length > 120) errors.contact_name = "กรุณาระบุชื่อผู้ติดต่อไม่เกิน 120 ตัวอักษร";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail(email)) || cleanEmail(email).length > 254) errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  if (!phone || String(phone).trim().length > 30) errors.phone = "กรุณาระบุเบอร์โทรศัพท์";
  if (typeof password !== "string" || password.length < 8 || password.length > 72) errors.password = "รหัสผ่านต้องมี 8-72 ตัวอักษร";
  if (!shop || !shop.name || String(shop.name).trim().length > 150) errors["shop.name"] = "กรุณาระบุชื่อร้านไม่เกิน 150 ตัวอักษร";
  if (Object.keys(errors).length) return fail(res, 422, "VALIDATION_ERROR", "ตรวจสอบข้อมูลที่กรอก", errors);
  const category = await pool.query("SELECT id FROM categories WHERE id = ?", [Number(shop.category_id)]);
  if (!category.length) return fail(res, 422, "INVALID_CATEGORY", "กรุณาเลือกหมวดหมู่ที่มีในระบบ");
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const hash = await bcrypt.hash(password, 12);
    const user = await conn.query("INSERT INTO users (email, password_hash, contact_name, phone) VALUES (?, ?, ?, ?)", [cleanEmail(email), hash, String(contact_name).trim(), String(phone).trim()]);
    const store = await conn.query("INSERT INTO shops (user_id, category_id, name, description, public_phone, public_contact) VALUES (?, ?, ?, ?, ?, ?)", [user.insertId, Number(shop.category_id), String(shop.name).trim(), shop.description || null, shop.public_phone || null, shop.public_contact || null]);
    await conn.commit();
    req.session.userId = Number(user.insertId);
    req.session.shopId = Number(store.insertId);
    req.session.regenerate((error) => {
      if (error) return fail(res, 500, "SESSION_ERROR", "สร้างเซสชันไม่สำเร็จ");
      req.session.userId = Number(user.insertId); req.session.shopId = Number(store.insertId);
      req.session.save((saveError) => saveError ? fail(res, 500, "SESSION_ERROR", "บันทึกเซสชันไม่สำเร็จ") : res.status(201).json({ data: { id: Number(store.insertId), name: String(shop.name).trim(), email: cleanEmail(email) } }));
    });
  } catch (error) { await conn.rollback(); if (error.code === "ER_DUP_ENTRY") return fail(res, 409, "EMAIL_ALREADY_EXISTS", "อีเมลนี้มีบัญชีแล้ว"); throw error; }
  finally { conn.release(); }
}));
app.post("/api/v1/auth/login", asyncRoute(async (req, res) => {
  const email = cleanEmail(req.body && req.body.email);
  const rows = await pool.query("SELECT u.id AS user_id, u.password_hash, u.account_status, s.id AS shop_id, s.name FROM users u JOIN shops s ON s.user_id=u.id WHERE u.email=?", [email]);
  if (!rows.length || rows[0].account_status !== "active" || !(await bcrypt.compare(String(req.body.password || ""), rows[0].password_hash))) return fail(res, 401, "INVALID_CREDENTIALS", "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  req.session.regenerate((error) => {
    if (error) return fail(res, 500, "SESSION_ERROR", "เข้าสู่ระบบไม่สำเร็จ");
    req.session.userId = Number(rows[0].user_id); req.session.shopId = Number(rows[0].shop_id);
    req.session.save((saveError) => saveError ? fail(res, 500, "SESSION_ERROR", "เข้าสู่ระบบไม่สำเร็จ") : res.json({ data: { id: Number(rows[0].shop_id), name: rows[0].name, email } }));
  });
}));
app.post("/api/v1/auth/logout", requireShop, (req, res, next) => req.session.destroy((error) => error ? next(error) : res.clearCookie("takhladnat.sid").status(204).end()));
app.get("/api/v1/auth/me", requireShop, asyncRoute(async (req, res) => {
  const rows = await pool.query("SELECT u.id AS user_id, u.email, u.contact_name, u.phone, s.id AS shop_id, s.name, s.description, s.public_phone, s.public_contact, s.is_published, s.category_id, c.name AS category_name FROM users u JOIN shops s ON s.user_id=u.id LEFT JOIN categories c ON c.id=s.category_id WHERE s.id=?", [req.session.shopId]);
  if (!rows.length) return fail(res, 401, "UNAUTHENTICATED", "กรุณาเข้าสู่ระบบใหม่");
  res.json({ data: rows[0] });
}));
app.get("/api/v1/public/markets/:code/shops/:shopId", asyncRoute(async (req, res) => {
  const rows = await pool.query(`SELECT s.id, s.name, s.description, s.public_phone, s.public_contact, c.name AS category_name, b.booth_code, bk.booking_date
    FROM shops s JOIN bookings bk ON bk.shop_id=s.id AND bk.status='confirmed' JOIN booths b ON b.id=bk.booth_id JOIN markets m ON m.id=bk.market_id
    LEFT JOIN categories c ON c.id=s.category_id WHERE m.public_code=? AND s.id=? AND s.is_published=1 AND m.is_active=1 ORDER BY bk.booking_date DESC LIMIT 1`, [req.params.code, Number(req.params.shopId)]);
  if (!rows.length) return fail(res, 404, "SHOP_NOT_FOUND", "ไม่พบร้านค้านี้");
  res.json({ data: rows[0] });
}));
app.get("/api/v1/shop/profile", requireShop, asyncRoute(async (req, res) => {
  const rows = await pool.query("SELECT u.contact_name, u.email, u.phone, s.name, s.category_id, s.description, s.public_phone, s.public_contact, s.is_published FROM users u JOIN shops s ON s.user_id=u.id WHERE s.id=?", [req.session.shopId]);
  res.json({ data: rows[0] });
}));
app.patch("/api/v1/shop/profile", requireShop, asyncRoute(async (req, res) => {
  const { name, category_id, description, public_phone, public_contact, is_published } = req.body || {};
  if (!name || String(name).trim().length > 150) return fail(res, 422, "VALIDATION_ERROR", "กรุณาระบุชื่อร้านไม่เกิน 150 ตัวอักษร");
  const result = await pool.query("UPDATE shops SET name=?, category_id=?, description=?, public_phone=?, public_contact=?, is_published=? WHERE id=?", [String(name).trim(), category_id || null, description || null, public_phone || null, public_contact || null, is_published ? 1 : 0, req.session.shopId]);
  res.json({ data: { updated: result.affectedRows === 1 } });
}));
app.get("/api/v1/markets/:marketId/booths", requireShop, asyncRoute(async (req, res) => {
  const date = req.query.booking_date;
  if (!validDate(date)) return fail(res, 422, "INVALID_BOOKING_DATE", "ระบุ booking_date รูปแบบ YYYY-MM-DD");
  const rows = await pool.query(`SELECT b.id, b.booth_code, b.description, b.map_x, b.map_y, b.map_width, b.map_height, b.base_status,
    CASE WHEN b.base_status='unavailable' THEN 'unavailable' WHEN EXISTS (SELECT 1 FROM bookings k WHERE k.booth_id=b.id AND k.booking_date=? AND k.status='confirmed') THEN 'confirmed' ELSE 'available' END AS status
    FROM booths b WHERE b.market_id=? ORDER BY b.booth_code`, [date, Number(req.params.marketId)]);
  res.json({ data: rows });
}));
app.post("/api/v1/bookings", requireShop, asyncRoute(async (req, res) => {
  const marketId = Number(req.body.market_id), boothId = Number(req.body.booth_id), date = req.body.booking_date;
  if (!Number.isInteger(marketId) || !Number.isInteger(boothId) || !validDate(date)) return fail(res, 422, "VALIDATION_ERROR", "ตรวจสอบตลาด แผง และวันที่จอง");
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const booth = await conn.query("SELECT b.id, b.market_id, b.base_status, s.name, s.description, s.public_phone, s.public_contact, c.name AS category_name FROM booths b JOIN shops s ON s.id=? LEFT JOIN categories c ON c.id=s.category_id WHERE b.id=? FOR UPDATE", [req.session.shopId, boothId]);
    if (!booth.length || Number(booth[0].market_id) !== marketId) { await conn.rollback(); return fail(res, 404, "BOOTH_NOT_FOUND", "ไม่พบแผงในตลาดนี้"); }
    if (booth[0].base_status !== "available") { await conn.rollback(); return fail(res, 409, "BOOTH_UNAVAILABLE", "แผงนี้ไม่เปิดให้จอง"); }
    const taken = await conn.query("SELECT id FROM bookings WHERE booth_id=? AND booking_date=? AND status='confirmed' FOR UPDATE", [boothId, date]);
    if (taken.length) { await conn.rollback(); return fail(res, 409, "BOOTH_UNAVAILABLE", "แผงนี้มีผู้จองแล้วในวันที่เลือก"); }
    const result = await conn.query("INSERT INTO bookings (shop_id, market_id, booth_id, status, booking_date, shop_name_snapshot, category_name_snapshot, description_snapshot, contact_snapshot, shop_note) VALUES (?, ?, ?, 'confirmed', ?, ?, ?, ?, ?, ?)", [req.session.shopId, marketId, boothId, date, booth[0].name, booth[0].category_name, booth[0].description, booth[0].public_contact || booth[0].public_phone, String(req.body.shop_note || "").slice(0, 500) || null]);
    await conn.commit();
    res.status(201).json({ data: { id: Number(result.insertId), market_id: marketId, booth_id: boothId, booking_date: date, status: "confirmed" } });
  } catch (error) { await conn.rollback(); throw error; }
  finally { conn.release(); }
}));
app.get("/api/v1/bookings", requireShop, asyncRoute(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1), limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const status = ["confirmed", "cancelled", "completed"].includes(req.query.status) ? req.query.status : null;
  const count = await pool.query("SELECT COUNT(*) AS total FROM bookings WHERE shop_id=? AND (? IS NULL OR status=?)", [req.session.shopId, status, status]);
  const data = await pool.query("SELECT b.id,b.booking_date,b.status,b.shop_name_snapshot,b.created_at,m.name AS market_name,bo.booth_code FROM bookings b JOIN markets m ON m.id=b.market_id JOIN booths bo ON bo.id=b.booth_id WHERE b.shop_id=? AND (? IS NULL OR b.status=?) ORDER BY b.created_at DESC LIMIT ? OFFSET ?", [req.session.shopId, status, status, limit, (page - 1) * limit]);
  res.json({ data, meta: { page, limit, total: Number(count[0].total) } });
}));
app.get("/api/v1/bookings/:id", requireShop, asyncRoute(async (req, res) => {
  const rows = await pool.query("SELECT b.id,b.booking_date,b.status,b.shop_name_snapshot,b.category_name_snapshot,b.description_snapshot,b.contact_snapshot,b.shop_note,b.created_at,b.updated_at,m.name AS market_name,bo.booth_code FROM bookings b JOIN markets m ON m.id=b.market_id JOIN booths bo ON bo.id=b.booth_id WHERE b.id=? AND b.shop_id=?", [req.params.id, req.session.shopId]);
  if (!rows.length) return fail(res, 404, "BOOKING_NOT_FOUND", "ไม่พบรายการจอง");
  res.json({ data: rows[0] });
}));
app.post("/api/v1/bookings/:id/cancel", requireShop, asyncRoute(async (req, res) => {
  const result = await pool.query("UPDATE bookings SET status='cancelled' WHERE id=? AND shop_id=? AND status='confirmed'", [req.params.id, req.session.shopId]);
  if (!result.affectedRows) return fail(res, 409, "BOOKING_NOT_CANCELLABLE", "รายการนี้ถูกยกเลิกไปแล้วหรือไม่สามารถยกเลิกได้");
  res.json({ data: { id: Number(req.params.id), status: "cancelled" } });
}));
app.get("/api/health", (req, res) => res.redirect(307, "/api/v1/health"));
app.use((error, req, res, next) => {
  console.error("Request failed:", error.message);
  if (res.headersSent) return next(error);
  fail(res, 500, "INTERNAL_ERROR", "เกิดข้อผิดพลาด กรุณาลองใหม่");
});

initializeDatabase().then(() => {
  app.listen(3108, () => console.log("ตากหลาดนัดพร้อมใช้งานที่ http://localhost:3108"));
}).catch((error) => {
  console.error("Database initialization failed:", error.message);
  process.exitCode = 1;
});
