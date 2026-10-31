# Task Plan — ตากหลาดนัด

เอกสารนี้แตกข้อกำหนดจาก `spec.md` เป็น checklist สำหรับวางแผนและบันทึกความคืบหน้า ไม่ใช่โค้ดของแอป

## วิธีใช้และกติกาการอัปเดต
- สถานะใช้ `[ ]` ยังไม่เริ่ม, `[/]` กำลังทำ, `[x]` เสร็จและตรวจสอบแล้ว, `[!]` ติดขัด/รอคำตัดสิน
- ห้ามทำเครื่องหมาย `[x]` จนกว่าจะมีการตรวจยืนยันที่เหมาะสม; บันทึกคำสั่งทดสอบและผลจริง
- ทุกครั้งที่มีงาน ให้แก้ checklist และบันทึกใน “บันทึกการทำงาน” ว่าทำอะไร ที่ไหน อย่างไร ผลเป็นอย่างไร และเหลืองานอะไร
- ถ้างานเปลี่ยนสเปก ให้แก้ `spec.md` และบันทึกความเปลี่ยนแปลงในรายการที่เกี่ยวข้อง
- ใช้เฉพาะไฟล์แอปที่กำหนด: `package.json`, `server.js`, `public/index.html`, `public/style.css`, `public/index.js`; รูปภาพอยู่ได้เฉพาะ `public/images/` (PNG/JPG/JPEG/GIF/WebP ไม่เกิน 5 MB ต่อไฟล์)
- Backend ทั้งหมดอยู่ใน `server.js` ใช้ Express แบบ CommonJS และ `app.use(express.static("public"))`; frontend ใช้ API URL แบบ same-origin
- ห้ามสร้าง `.env` หรือไฟล์โค้ดแอปเพิ่มเติม; เชื่อม MariaDB ตามข้อกำหนดโครงการ และให้เซิร์ฟเวอร์ฟังที่พอร์ต `3108`; ห้ามใส่ API key ในโค้ด
- Admin อยู่ในแผนอนาคต ไม่ทำในรุ่นแรก

## 0. นิยามและขอบเขตผลิตภัณฑ์
- [ ] ยืนยันเป้าหมาย: จัดระเบียบการจองแผงและช่วยลูกค้าวางแผนเลือกซื้อจากผังร้าน
- [ ] ยืนยันบทบาทรุ่นแรก: Shop ต้องสมัคร/เข้าสู่ระบบและจัดการจอง; Customer ดูข้อมูลสาธารณะได้โดยไม่ต้อง login
- [ ] ยืนยัน Admin เป็นแนวคิดอนาคตเท่านั้น ไม่รวมการพัฒนา API/UI ในรุ่นแรก
- [/] เพิ่มตลาดและแผงตัวอย่างแบบ seed ซ้ำได้เพื่อเริ่มทดลอง; ข้อมูลตลาดจริงยังต้องแทนที่ภายหลัง; หมวดหมู่ให้ Shop เลือกจากรายการที่ระบบเตรียมไว้
- [x] ยืนยันหลักการเผยแพร่ข้อมูล: แสดงเฉพาะร้านที่เปิดเผยข้อมูลและ booking ที่ยืนยันแล้ว
- [x] กำหนดการจองเป็นรายวันและยืนยัน booking ทันทีเมื่อสำเร็จ ไม่รอ Admin
- [x] กำหนดว่าร้านจองหลายแผงได้ในวันเดียวกัน และยกเลิก booking ของตนได้
- [x] กำหนดให้ Shop เลือกหมวดหมู่จากรายการที่ระบบเตรียมไว้
- [x] กำหนดการเข้าสู่ระบบ Shop ด้วย cookie session
- [x] เลือกใช้ข้อมูลตลาด/แผงตัวอย่างสำหรับเริ่มต้นโดยไม่ต้องมี Admin UI; เปลี่ยนเป็นข้อมูลจริงได้ภายหลัง

**ผลลัพธ์ที่ต้องได้:** ขอบเขตเวอร์ชันแรกชัดเจน และรายการที่ยังต้องตัดสินใจถูกระบุไว้ ไม่สมมติฟีเจอร์เพิ่มเอง

## 1. ประสบการณ์ผู้ใช้และหน้าจอ

### 1.1 หน้าแรก
- [x] แสดงชื่อ/โลโก้ “ตากหลาดนัด” และคำอธิบายตลาด
- [x] มีทางไปแผนผังตลาดและเข้าสู่ระบบร้านค้า
- [x] แสดงวิธีใช้งานและข้อมูลส่วนท้ายแบบย่อ; เนื้อหาตลาดจริงจะแสดงเมื่อมีข้อมูลตลาด

### 1.2 สมัครและเข้าสู่ระบบ Shop
- [x] มีแท็บ/ทางเลือกสมัครและเข้าสู่ระบบ
- [x] ฟอร์ม login: อีเมลและรหัสผ่าน พร้อมแสดง/ซ่อนรหัสผ่าน
- [x] ฟอร์มสมัคร: ชื่อผู้ติดต่อ อีเมล เบอร์โทร รหัสผ่าน ยืนยันรหัสผ่าน ชื่อร้าน และหมวดหมู่
- [x] แสดง validation และผลสำเร็จ/ผิดพลาดที่เข้าใจง่าย
- [ ] กู้คืนรหัสผ่านเป็นตัวเลือกที่ต้องยืนยันขอบเขตก่อนทำ; ไม่รวมรุ่นแรกจนกว่าจะอนุมัติ

### 1.3 แผนผังตลาด (Customer/Shop)
- [/] โหลดตลาดจากรายการและ query `?market=public_code`; ยังต้องทดสอบ QR จริง
- [x] แสดงแผนผัง หมายเลขแผง ตำแหน่งและสถานะพร้อม legend สี/ข้อความ
- [x] ค้นหาร้านตามชื่อและกรองด้วยหมวดหมู่
- [/] แตะแผงเพื่อดูชื่อร้าน/สถานะ; ยังไม่มีหน้ารายละเอียดร้านแบบเต็ม
- [x] มือถือมีรายการร้านประกอบใต้แผนผัง
- [x] Shop ที่ login แล้วเลือกวันที่ (`YYYY-MM-DD`) เพื่อดูแผงว่างและจองแบบรายวัน

### 1.4 รายละเอียดร้าน Customer
- [ ] แสดงชื่อร้าน หมวดหมู่ รายละเอียด และข้อมูลติดต่อที่ร้านยินยอมเผยแพร่ในหน้ารายละเอียด
- [/] API รายละเอียดกรองเฉพาะร้านเผยแพร่และ booking ยืนยันแล้ว; ยังต้องเชื่อมหน้าจอและตรวจ UX
- [x] API สาธารณะไม่ส่งข้อมูลบัญชี users หรือร้าน unpublished

### 1.5 หน้าหลัก Shop และรายการจอง
- [/] แสดงรายการ booking และยกเลิกได้; ยังไม่มีสรุปยอดแยกสถานะ
- [x] แสดงตลาด แผง วันที่จอง และสถานะ
- [/] API รองรับกรองสถานะ/แบ่งหน้า; UI ยังไม่แสดงตัวกรองหรือหน้ารายละเอียด
- [x] Shop ยกเลิก booking ของตนได้ทันทีเมื่อยัง confirmed และแจ้งผล
- [x] มีจุดเข้าจองแผงและแก้ข้อมูลร้านใน Shop panel

### 1.6 แบบฟอร์มจองและโปรไฟล์ร้าน
- [x] ฟอร์มจองเลือกตลาด วันที่ และแสดงสถานะแผง; booking ยืนยันได้ทันที
- [x] API ตรวจความว่าง/ปิดแผงและแสดง conflict หากถูกจองแล้ว
- [x] โปรไฟล์แก้ชื่อร้าน หมวดหมู่ คำอธิบาย และช่องทางสาธารณะ
- [x] แยกข้อมูลบัญชีจากข้อมูลสาธารณะใน API

### 1.7 Responsive และการเข้าถึง
- [ ] ออกแบบ mobile-first สำหรับ QR flow และตรวจแท็บเล็ต/desktop
- [ ] ใช้ตัวอักษรไทยอ่านชัด ขนาดและ contrast เพียงพอสำหรับช่วงอายุ 18–60 ปี
- [ ] ปุ่ม/พื้นที่สัมผัสใหญ่พอ สถานะไม่สื่อด้วยสีอย่างเดียว และมี focus/label สำหรับคีย์บอร์ด/ตัวช่วยอ่าน

**ผลลัพธ์ที่ต้องได้:** หน้าจอครบ user journey ทั้ง Shop และ Customer พร้อมสถานะ loading, empty, error และ success ในแต่ละจุดสำคัญ

## 2. ระบบภาพและ UI
- [ ] กำหนด design tokens: พื้นครีม/ขาวนวล, เขียวมิ้นต์หรือเขียวเสจหลัก, พีช/เหลืองอ่อนเป็น accent
- [ ] ใช้ minimal, การ์ดและมุมโค้งอย่างสม่ำเสมอ โดยไม่ให้ของตกแต่งกลบแผนผัง/สถานะ
- [ ] เลือกฟอนต์ไทยที่อ่านง่ายและมี fallback
- [ ] กำหนดสี/ไอคอน/ข้อความคู่กันสำหรับ available, pending, confirmed และสถานะอื่น
- [ ] ตรวจ contrast, focus, error message และหน้าจอแคบ

**ตำแหน่ง:** `public/style.css` สำหรับ style; markup ใน `public/index.html`; พฤติกรรมและ render ใน `public/index.js` เท่านั้น

## 3. ฐานข้อมูล MariaDB

### 3.1 Schema และความสัมพันธ์
- [x] สร้างตาราง InnoDB และ charset `utf8mb4` ขณะเริ่ม server
- [x] สร้าง `users`, `categories`, `shops`, `markets`, `booths`, `bookings` พร้อม fields/indexes/foreign keys ตาม spec
- [x] กำหนด unique email/category/public_code/booth code และ FK delete rules
- [!] Migration จาก schema เดิมที่อาจมี `start_at`/`end_at` ยังไม่ได้ทำ; ตารางใหม่ในฐานข้อมูลปัจจุบันเริ่มต้นได้
- [x] ตรวจ `booking_date` เป็นวันที่จริง และใช้ timezone ตลาดเป็นค่าเริ่มต้นสำหรับ public views
- [/] booking ใช้วันท้องถิ่นแบบ DATE; ยังไม่ทดสอบ timezone ของตลาดอื่น

### 3.2 ความถูกต้อง/การจองพร้อมกัน
- [x] สร้าง transaction สำหรับการส่ง booking
- [x] ล็อกแถว booth ก่อนตรวจว่ามี booking `confirmed` ในวันเดียวกันหรือไม่
- [x] ปฏิเสธการจองแผงเดิมในวันเดียวกันด้วย conflict; ร้านเดียวกันจองหลายแผงในวันเดียวกันได้
- [x] สร้าง booking เป็น `confirmed` ทันทีใน transaction เดียวกับการตรวจความว่าง
- [x] เจ้าของร้านยกเลิก booking active ได้ โดยเปลี่ยนเป็น `cancelled` ไม่ลบแถว
- [ ] ทดสอบ concurrency จริงเพื่อยืนยันว่าแผงเดียวกัน/วันเดียวกันมีผู้จองได้ไม่เกินหนึ่งร้าน

**ผลลัพธ์ที่ต้องได้:** schema ใช้ foreign key/index ถูกต้อง ข้อมูลไทยรองรับครบ และกติกาจองไม่เกิด race condition

## 4. Backend และ API

### 4.1 โครงสร้าง/พื้นฐาน
- [x] ประกาศ dependencies ใน `package.json` และคำสั่ง start
- [x] เขียน backend ทั้งหมดใน `server.js`, CommonJS `require("express")`
- [x] serve `public` ด้วย `app.use(express.static("public"))`; listen ที่พอร์ต `3108`
- [x] เชื่อม MariaDB ตามค่าที่กำหนด; ไม่มี `.env`/`process.env`
- [x] มี JSON parser, error handler กลาง, health endpoint ที่ไม่เผย secret
- [x] จำกัด request body 32 KB และใช้ parameterized SQL

### 4.2 รูปแบบ API กลาง
- [x] ใช้ prefix `/api/v1`, JSON UTF-8 และ envelope `{data}` / `{error}`
- [x] pagination รายการจอง/ค้นหาร้าน และจำกัด `limit` สูงสุด 100
- [/] validation/HTTP errors สำหรับ flow ที่ทำแล้ว; ยังขาด rate limiting และรูปแบบ 400/429 ที่ครบทุกกรณี
- [x] error response ไม่ส่ง SQL/stack/password; log แสดงเฉพาะข้อความ error

### 4.3 Auth และ Shop API
- [x] `POST /auth/register`: validate, bcrypt hash, สร้าง users+shops ใน transaction และป้องกัน email ซ้ำ
- [/] `POST /auth/login`: ตรวจ active/password และสร้าง cookie session; rate limit/brute-force mitigation ยังไม่ทำ
- [x] `POST /auth/logout`: ทำลาย session ฝั่ง MariaDB และลบ cookie
- [x] `GET /auth/me`: คืนเฉพาะข้อมูลผู้ใช้/ร้านโดยไม่ส่ง password_hash
- [x] `GET /shop/profile` และ `PATCH /shop/profile`: ownership จาก session และ allowlist fields
- [/] cookie HttpOnly/SameSite, Secure auto บน HTTPS, session expiry; CSRF Origin validation ทำแล้วแต่ยังต้อง harden/test

### 4.4 Public API สำหรับ Customer/QR
- [x] `GET /public/markets`: เฉพาะตลาด active
- [x] `GET /public/markets/{public_code}`: ข้อมูลตลาดผ่าน public code
- [x] `GET /public/markets/{public_code}/map`: booths, พิกัด, สถานะตามวันและร้านเผยแพร่
- [x] `GET /public/markets/{public_code}/shops`: ค้นหา/กรองหมวดหมู่/แบ่งหน้า
- [x] `GET /public/markets/{public_code}/shops/{shop_id}`: ร้านเผยแพร่และ booking confirmed
- [x] `GET /public/categories`: หมวดหมู่สำหรับ filter
- [x] API map/detail ไม่ส่งข้อมูลบัญชีส่วนตัวหรือร้าน unpublished

### 4.5 Booking API สำหรับ Shop
- [x] `GET /markets/{market_id}/booths?booking_date=YYYY-MM-DD`: สถานะความว่างรายวัน
- [x] `POST /bookings`: รับ market/booth/booking_date/shop_note; สร้าง confirmed ทันทีและ snapshot จากฐานข้อมูล
- [x] `GET /bookings`: จำกัดด้วย shop_id ใน session, filter status และ paginate
- [x] `GET /bookings/{booking_id}`: ตรวจ ownership
- [x] `POST /bookings/{booking_id}/cancel`: ตรวจ ownership/status แล้วเปลี่ยนเป็น cancelled
- [x] ร้านเดียวกันจองหลายแผงต่อวันได้; กันแผงเดิมซ้ำในวันเดียวกัน
- [ ] Idempotency-Key ยังไม่รองรับ; แผงไม่ว่างคืน 409
- [x] ไม่มี Admin endpoints ในรุ่นแรก

**ผลลัพธ์ที่ต้องได้:** API ตรงกับหน้าจอและ schema, authorization ทุก endpoint, response ไม่รั่วข้อมูล และการจองพร้อมกันปลอดภัย

## 5. Frontend และการเชื่อม API
- [x] `public/index.html`: semantic sections, navigation, dialogs และฟอร์มหลัก
- [/] `public/index.js`: same-origin `/api/v1`, loading/empty/error/success บาง flow; ต้องทดสอบ failure states เพิ่ม
- [x] หน้าแรกและ navigation ไปแผนผัง/เข้าสู่ระบบ
- [x] registration/login/logout และสถานะผู้ใช้ปัจจุบัน
- [/] public map/search/filter และ QR query entry ทำแล้ว; หน้ารายละเอียดร้านเต็มยังไม่เชื่อม
- [/] Shop panel มี profile, daily booth booking, booking list/cancel; รายละเอียด booking และตัวกรอง UI ยังขาด
- [/] ใช้ `textContent` สำหรับชื่อร้าน/รายละเอียดใน UI ส่วนใหญ่; ต้องทำ security review เพิ่ม
- [/] responsive layout ทำแล้วและดูผ่าน browser desktop/mobile; ยังต้องตรวจ accessibility และอุปกรณ์จริง

## 6. QR Code, รูปภาพ และข้อมูลตั้งต้น
- [ ] ระบุ public URL ของตลาดจาก `public_code` สำหรับนำไปสร้าง QR
- [ ] ทดสอบสแกน QR บนอุปกรณ์จริง/กล้องมือถือและเปิดแผนผังที่ถูกตลาด
- [ ] เตรียมรูปแผนผังใน `public/images/` เฉพาะ PNG/JPG/JPEG/GIF/WebP ไม่เกิน 5 MB ต่อไฟล์
- [ ] ใช้ URL `/images/filename` ใน browser; ห้ามใช้ `public/images/...`
- [ ] ห้ามเขียนทับไฟล์ชื่อซ้ำโดยไม่แจ้ง; ไม่ลบภาพเดิม เว้นแต่ผู้ใช้สั่ง
- [/] หมวดหมู่ 6 รายการและตลาดตัวอย่าง/15 แผง seed อัตโนมัติใน `server.js`; ข้อมูลนี้เป็น placeholder ต้องแทนด้วยตลาดจริง

## 7. การทดสอบและตรวจรับ

### 7.1 Auth/Profile
- [ ] สมัครสำเร็จสร้าง user/shop อย่าง atomic
- [ ] email ซ้ำ, ข้อมูลไม่ครบ/ผิดรูปแบบ และ login ผิดให้ผลเหมาะสม
- [ ] session/token ถูกตรวจทุก protected route; ผู้ใช้ไม่เข้าถึงข้อมูลร้านอื่น
- [ ] profile update แก้ได้เฉพาะ field ที่อนุญาต

### 7.2 Public/Map
- [ ] QR/public code ถูกต้องและตลาด inactive/ไม่พบให้ผลตามสัญญา API
- [ ] map สถานะ available/pending/confirmed ถูกต้อง
- [ ] ค้นหาและ filter/pagination ให้ผลตรง
- [ ] ลูกค้าเห็นเฉพาะร้านเผยแพร่และข้อมูลที่อนุญาต

### 7.3 Booking
- [ ] ปฏิเสธวันที่ไม่ถูกต้อง, booth คนละตลาด, booth unavailable และ booth ที่ถูกจองแล้วในวันเดียวกัน
- [ ] การส่งซ้ำ/idempotency ไม่สร้าง booking ซ้ำ
- [ ] Shop อ่าน/ยกเลิกได้เฉพาะ booking ของตน
- [ ] ร้านเดียวกันจองหลาย booth ในวันเดียวกันได้; booking ที่ยกเลิกเก็บประวัติและทำให้ booth กลับ available
- [ ] ทดสอบ concurrency: คำขอสองรายการแย่ง booth เดียวกัน/วันเดียวกันต้องสำเร็จไม่เกินหนึ่งรายการ

### 7.4 UI/Compatibility
- [ ] ทดสอบมือถือจอเล็ก, tablet และ desktop
- [ ] ตรวจ keyboard/focus/labels/contrast และสถานะที่ไม่พึ่งสีอย่างเดียว
- [ ] ทดสอบกรณี API ช้า/ล้มเหลวและไม่มีข้อมูล
- [ ] ตรวจ console/network ไม่มี error หรือข้อมูลลับ

**บันทึกผลตรวจรับ:** เพิ่มวันเวลา, environment, คำสั่ง/วิธีทดสอบ, ผลผ่าน/ไม่ผ่าน และหลักฐานที่จำเป็นในบันทึกการทำงาน

## 8. Deployment และการส่งมอบ
- [ ] ตรวจว่า source/config มีเฉพาะไฟล์ที่อนุญาต และภาพอยู่ใน `public/images/`
- [ ] ยืนยัน production dependencies อยู่ใน `package.json`; ไม่ส่ง `node_modules`/package-lock ไป uploader หากไม่รองรับ
- [ ] ทดสอบ start ด้วย runtime ที่กำหนดที่พอร์ต `3108` และตรวจ same-origin static/API
- [ ] ตรวจการเชื่อม MariaDB และการจัดการกรณี DB unavailable โดยไม่เผย credential
- [ ] ตรวจ QR URL ใช้งานได้จากเครือข่าย/อุปกรณ์เป้าหมาย
- [ ] สรุปฟีเจอร์ที่เสร็จ ข้อจำกัดที่ยังอยู่ และขั้นตอนเริ่มใช้งาน

## 9. งานอนาคต (ไม่อยู่ในรุ่นแรก)
- [ ] Admin login/role/authorization
- [ ] หน้าจัดการตลาด แผนผัง แผง และหมวดหมู่
- [ ] หน้าตรวจสอบ/อนุมัติ/ปฏิเสธ booking และการตรวจช่วงเวลาซ้ำเมื่อยืนยัน
- [ ] สร้าง/หมุนเวียน QR Code จากหน้าจอ Admin
- [ ] นโยบายการเก็บประวัติ booking, ปิดบัญชี และลบข้อมูล

## บันทึกการทำงาน

### รูปแบบบันทึกต่อรอบ
```text
วันที่/เวลา:
Checklist ID และสถานะ:
ทำอะไร:
ทำที่ไหน (ไฟล์/ส่วน/endpoint/table/screen):
ทำอย่างไร (แนวทางและรายละเอียดการเปลี่ยนแปลง):
ตรวจสอบอย่างไร (คำสั่ง/ขั้นตอนและผลจริง):
สิ่งที่ยังเหลือ/ข้อขัดข้อง:
อ้างอิงการเปลี่ยนสเปก (ถ้ามี):
```

### รายการบันทึก

#### 2026-10-31 — เริ่มพัฒนาเวอร์ชันแรก
- Checklist ID และสถานะ: 1.1, 1.2 บางส่วน, 1.3-1.6 บางส่วน, 3.1-3.2 บางส่วน, 4.1-4.5 บางส่วน — ทำโครงหลักและตรวจ smoke test; ยังไม่ถือว่าระบบครบหรือผ่าน acceptance
- ทำอะไร: สร้างหน้าเว็บพาสเทล responsive; API สาธารณะ/Shop; MariaDB schema และ seed หมวดหมู่; สมัคร/เข้าสู่ระบบด้วย bcrypt + cookie session; โปรไฟล์ร้าน; แผนผัง/ค้นหาร้าน; จองรายวัน confirmed ทันทีและยกเลิก
- ทำที่ไหน: `package.json`, `server.js`, `public/index.html`, `public/style.css`, `public/index.js`; บันทึกขอบเขตหน้าจอที่ทำใน `spec.md`
- ทำอย่างไร: ประกาศ Express, MariaDB, express-session, bcryptjs; สร้างตาราง InnoDB เมื่อ server เริ่ม; เก็บ session ใน MariaDB; API ใช้ parameterized SQL, transaction/lock booth, owner checks; client เรียก `/api/v1` แบบ same-origin และใช้ `?market=public_code` สำหรับเข้าแผนผัง
- ตรวจสอบอย่างไร: `node --check server.js`, `node --check public/index.js`, `npm.cmd audit --omit=dev` (0 vulnerabilities); เริ่ม `npm.cmd start`; หน้า `/`, CSS และ JS ตอบ 200, `/api/v1/health` เชื่อม DB ได้, categories มี 6 รายการ, protected booths API ตอบ 401 เมื่อไม่มี session; เปิด browser ที่ desktop และ viewport 390px ตรวจหน้าเว็บ
- ผลตรวจ/ข้อจำกัด: ฐานข้อมูลไม่มีตลาด (`GET /api/v1/public/markets` คืน 0) จึงยังจอง/ทดสอบแผนผังจริงไม่ได้; browser มี expected 401 จากการเช็ก session ที่ยังไม่ login; ยังไม่ได้สร้างบัญชีทดสอบหรือทำ concurrency/UI acceptance tests
- สิ่งที่ยังเหลือ: แทนข้อมูลตลาดตัวอย่างด้วยข้อมูลจริงและภาพผัง; เชื่อมหน้ารายละเอียดร้านเต็ม; filter/detail ใน Shop panel; idempotency key; rate limit; migration schema เก่า; QR scan จริง; ทดสอบ accessibility/concurrency และ deployment
- หลังผู้ใช้เลือกตลาดตัวอย่าง: เพิ่ม seed ตลาด placeholder `demo-takhladnat` และ 15 แผงแบบ `INSERT IGNORE` ใน `server.js`; ตรวจ `GET /api/v1/public/markets` และ `/map` ได้ตลาด 1 แห่ง/15 แผง
- อ้างอิงการเปลี่ยนสเปก: เริ่มนำข้อกำหนดใน `spec.md` ไปทำเป็นเว็บตามกติกาธุรกิจที่ยืนยันแล้ว

#### 2026-10-31 — ยืนยันกติกาธุรกิจและปรับสเปก
- Checklist ID และสถานะ: 0 (ขอบเขตผลิตภัณฑ์) — ยืนยันแล้ว; งานพัฒนายังไม่เริ่ม
- ทำอะไร: บันทึกการจองรายวัน, ยืนยัน booking ทันที, เลือกหมวดหมู่โดยร้าน, ยกเลิกได้, cookie session และอนุญาตร้านจองหลายแผงในวันเดียวกัน
- ทำที่ไหน: `spec.md` ส่วนผู้ใช้, หน้าจอ, schema MariaDB, API และกติกาการจอง; `task.md` ส่วน scope, UI, DB, API และ tests
- ทำอย่างไร: เปลี่ยน booking จาก start/end timestamp เป็น `booking_date DATE`; กำหนดสถานะเริ่มต้น `confirmed`; เพิ่ม timezone ตลาด; แก้ endpoints ให้รับวันจอง; ระบุ transaction/lock booth เพื่อกัน booking booth เดิมวันเดียวกัน; ระบุ cookie session และ cancellation โดย owner
- ตรวจสอบอย่างไร: ตรวจข้อความในเอกสารด้วยการค้นหา stale terms; ยังไม่ได้ทดสอบระบบหรือฐานข้อมูลจริงเพราะเป็นการแก้เอกสาร
- สิ่งที่ยังเหลือ/ข้อขัดข้อง: ต้องระบุผู้จัดเตรียมข้อมูลตลาดและแผงเริ่มต้น เพราะยังไม่มี Admin UI; ต้องตัดสินใจแยกต่างหากเรื่องการกู้คืนรหัสผ่านหากต้องการรวมในรุ่นแรก
- อ้างอิงการเปลี่ยนสเปก: กติกาที่ผู้ใช้ยืนยันในวันที่ 2026-10-31

- Checklist ที่ยังไม่ติ๊ก `[x]` เป็นงานคงเหลือ; การสร้างโครงหลักยังไม่เท่ากับฟีเจอร์ผ่านการตรวจรับ
