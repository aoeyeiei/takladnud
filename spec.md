# ตากหลาดนัด

## ภาพรวม
ตากหลาดนัดเป็นแอปพลิเคชันสำหรับช่วยจัดระเบียบตลาดนัด และช่วยให้ลูกค้าวางแผนเลือกซื้อสินค้าจากร้านค้าภายในตลาดได้สะดวกขึ้น

> แผนงานและ checklist การพัฒนาอยู่ใน `task.md` ส่วนนี้เป็นสเปกอ้างอิงหลัก เมื่อทำงานตาม checklist ให้ปรับสถานะใน `task.md` พร้อมบันทึกสิ่งที่ทำ ตำแหน่งไฟล์ วิธีทำ ผลตรวจสอบ และงานคงเหลือ โดยไม่ลบข้อกำหนดจากสเปก

## ประเภทผู้ใช้งาน

### พ่อค้าแม่ค้า (Shop)
- สมัครสมาชิกและเข้าสู่ระบบเพื่อจัดการการจองแผง
- ดูแผนผังตลาดและเลือกแผงที่ยังว่าง
- ส่งคำขอจองแผง พร้อมระบุข้อมูลร้านค้า เช่น ชื่อร้าน ประเภทสินค้า และช่องทางติดต่อ
- ดูรายการและรายละเอียดการจองของตนเอง
- จองแผงเป็นรายวัน และการจองสำเร็จมีสถานะ `confirmed` ทันทีโดยไม่ต้องรอผู้ดูแลยืนยัน
- ร้านหนึ่งจองหลายแผงได้ในวันเดียวกัน; ร้านสามารถยกเลิก booking ของตนเองได้

### ลูกค้า (Customer)
- สแกน QR Code ของตลาดเพื่อเปิดดูแผนผังร้านค้า
- ดูตำแหน่งและข้อมูลร้านค้าที่เปิดให้บริการ เช่น ชื่อร้าน ประเภทสินค้า และรายละเอียดสินค้า
- วางแผนเลือกร้านค้าที่ต้องการอุดหนุนจากตำแหน่งร้านบนแผนผัง
- ใช้งานหน้าข้อมูลตลาดได้โดยไม่ต้องเข้าสู่ระบบ

## ความต้องการหลัก
- แสดงแผนผังตลาดที่เข้าใจง่าย พร้อมหมายเลขหรือตำแหน่งแผง
- แยกสถานะแผงว่างและมีผู้จองแล้วอย่างชัดเจน; การจองที่สำเร็จมีผลทันที
- เชื่อมโยงข้อมูลร้านค้าที่ได้รับการยืนยันเข้ากับตำแหน่งแผง
- ให้ QR Code เปิดหน้าแผนผังตลาดที่เหมาะกับการใช้งานบนโทรศัพท์มือถือ
- ป้องกันไม่ให้มีการยืนยันการจองแผงเดียวกันซ้ำ

## ขั้นตอนการใช้งาน

### การจองแผงของร้านค้า
1. พ่อค้าแม่ค้าเข้าสู่ระบบ
2. เลือกตลาดและตรวจสอบแผนผังกับสถานะแผง
3. เลือกแผงว่างและกรอกข้อมูลร้านค้า
4. ส่งคำขอจอง
5. ตรวจสอบรายละเอียดการจองที่มีผลทันที และยกเลิกได้จากหน้าร้านค้า

### การดูแผนผังของลูกค้า
1. ลูกค้าสแกน QR Code ที่ตลาดหรือสื่อประชาสัมพันธ์
2. ระบบเปิดหน้าแผนผังตลาดบนโทรศัพท์
3. ลูกค้าดูตำแหน่งร้านและข้อมูลร้านค้า
4. ลูกค้าเลือกดูร้านที่สนใจเพื่อวางแผนการอุดหนุน

## หน้าจอที่คาดว่าจะมี
- หน้าแรกและข้อมูลตลาด
- หน้าสมัครสมาชิกและเข้าสู่ระบบสำหรับพ่อค้าแม่ค้า
- หน้าแผนผังตลาดสำหรับร้านค้าและลูกค้า
- หน้ารายละเอียดและแบบฟอร์มจองแผง
- หน้ารายการจองและสถานะการจองของร้านค้า
- หน้ารายละเอียดร้านค้าสำหรับลูกค้า

## แนวทางการออกแบบ
- ธีม minimal ใช้สีพาสเทลโทนอุ่นและสีธรรมชาติ ให้ความรู้สึกน่ารัก สบายตา และไม่รก
- ออกแบบให้อ่านง่ายสำหรับผู้ใช้อายุประมาณ 18-60 ปี: ใช้ตัวอักษรไทยที่ชัดเจน ขนาดเนื้อหาอ่านสบาย ปุ่มกดมีพื้นที่เพียงพอ และไม่สื่อความหมายด้วยสีเพียงอย่างเดียว
- ใช้พื้นหลังสีขาวนวล/ชมพูอ่อน สีชมพูกุหลาบหม่นเป็นสีหลัก และพีช/เหลืองครีมเป็นสีเน้น; ใช้สีเข้มสำหรับข้อความเพื่อให้อ่านชัด
- ใช้การ์ด มุมโค้ง และไอคอนเรียบง่ายอย่างสม่ำเสมอ โดยให้แผนผังและสถานะจองเด่นกว่าของตกแต่ง
- รองรับมือถือเป็นหลัก โดยเฉพาะหน้าที่เปิดจาก QR Code และปรับใช้งานได้บนแท็บเล็ต/คอมพิวเตอร์

## โครงสร้างหน้าจอและองค์ประกอบ

### 1. หน้าแรก
- แถบด้านบน: โลโก้/ชื่อ “ตากหลาดนัด” และเมนูเข้าสู่ระบบหรือโปรไฟล์
- ส่วนแนะนำตลาด: ข้อความต้อนรับ ชื่อตลาด และคำอธิบายสั้น ๆ
- ปุ่มหลัก: “ดูแผนผังตลาด” และ “เข้าสู่ระบบร้านค้า”
- ส่วนร้านอาหารแนะนำ: รูปอาหาร ชื่อร้าน ประเภทอาหาร คำแนะนำ ราคาโดยประมาณ และปุ่มพาไปยังแผงบนแผนผัง
- ร้าน/ราคาตัวอย่างต้องมีป้ายกำกับว่าเป็นข้อมูลสาธิต; รูปภาพควรเสิร์ฟจากไฟล์ในระบบและมีข้อความระบุที่มา
- ส่วนแนะนำวิธีใช้งานหรือหมวดหมู่ร้านค้าแบบสั้น
- ส่วนท้าย: ช่องทางติดต่อและข้อมูลตลาด

### 2. สมัครสมาชิกและเข้าสู่ระบบ Shop
- สลับแท็บ “เข้าสู่ระบบ” และ “สมัครสมาชิก”
- ฟอร์มเข้าสู่ระบบ: อีเมล/ชื่อผู้ใช้ และรหัสผ่าน พร้อมปุ่มแสดง/ซ่อนรหัสผ่าน
- ฟอร์มสมัคร: ชื่อผู้ติดต่อ อีเมล เบอร์โทร รหัสผ่าน ยืนยันรหัสผ่าน และเลือกหมวดหมู่ร้านจากรายการหมวดหมู่ที่มี
- ข้อความแจ้งข้อผิดพลาดหรือผลการดำเนินการที่อ่านเข้าใจง่าย
- ลิงก์กลับหน้าแรก และช่องทางกู้คืนรหัสผ่าน (ถ้ารองรับ)

### 3. แผนผังตลาด (Shop และ Customer)
- แถบหัวหน้า: ชื่อตลาด ปุ่มกลับ และปุ่มเข้าสู่ระบบสำหรับ Shop เมื่อยังไม่ได้เข้าสู่ระบบ
- แถบค้นหาร้าน และตัวกรองประเภทสินค้า
- แผนผังแบบละเอียด แบ่งโซน/ทางเดิน/ทางเข้า พร้อมหมายเลขแผง ชื่อร้าน และตัวบอกสถานะ
- คำอธิบายสัญลักษณ์ทั้งแผงว่าง/จองแล้ว ที่จอดรถ และโซนนั่งรับประทานอาหาร
- แตะแผง/จุดสิ่งอำนวยความสะดวกเพื่อดูชื่อ ตำแหน่ง และจำนวนที่ว่าง
- แสดงจำนวนที่จอดรถและที่นั่งว่างเทียบกับความจุทั้งหมดของแต่ละโซน
- แสดงรายการร้านค้าและการ์ดสิ่งอำนวยความสะดวกใต้แผนผัง เพื่อใช้งานบนจอเล็ก
- รองรับแผงจำนวนมากและการจองหลายแผงในวันเดียวกัน โดยแต่ละแผงยืนยัน/ยกเลิกแยกกัน

### 4. รายละเอียดร้านค้า (Customer)
- ชื่อร้านและประเภทสินค้า
- ตำแหน่ง/หมายเลขแผง พร้อมปุ่มกลับไปยังแผนผัง
- รายละเอียดสินค้าและช่องทางติดต่อที่ร้านเลือกเผยแพร่
- ป้ายหมวดหมู่ และสถานะเปิดให้บริการ (ถ้ามีข้อมูล)

### 5. หน้าหลักร้านค้า (Shop)
- แถบหัวหน้า: ชื่อร้าน เมนูโปรไฟล์ และปุ่มออกจากระบบ
- สรุปรายการ booking รายวัน โดยการจองใหม่มีสถานะยืนยันแล้วทันที และสามารถยกเลิกได้
- ปุ่มเด่น “จองแผง” เพื่อไปยังแผนผังและเลือกแผง
- รายการคำขอจองล่าสุด พร้อมวันที่ ตลาด หมายเลขแผง และสถานะ
- ทางลัดไปหน้าแก้ไขข้อมูลร้าน

### 6. แบบฟอร์มจองแผง
- แสดงตลาดและแผงที่เลือก พร้อมสถานะว่าง
- ฟอร์มข้อมูลร้าน: ชื่อร้าน ประเภทสินค้า รายละเอียด และช่องทางติดต่อ
- สรุปข้อมูลก่อนส่งคำขอ และปุ่มยืนยันส่งคำขอ
- แจ้งผลสำเร็จหรือข้อผิดพลาด พร้อมทางกลับหน้ารายการจอง

### 7. รายการจองและรายละเอียดการจอง (Shop)
- รายการจองแสดงตลาด แผง วันที่ส่งคำขอ และสถานะ
- ตัวกรองตามสถานะ และเรียงรายการล่าสุดก่อน
- หน้ารายละเอียดแสดงข้อมูลที่ส่งไปและประวัติ/ข้อความสถานะ
- ปุ่มยกเลิก booking ของร้านได้โดยตรง พร้อมแจ้งผลการยกเลิกอย่างชัดเจน

### 8. โปรไฟล์ร้านค้า (Shop)
- แสดงและแก้ไขชื่อผู้ติดต่อ อีเมล เบอร์โทร และข้อมูลร้าน
- ระบุชื่อร้าน ประเภทสินค้า รายละเอียด และช่องทางติดต่อสาธารณะ
- ปุ่มบันทึกและยกเลิกการแก้ไข พร้อมข้อความยืนยันผล

### 9. หน้าจอ Admin (อนาคต)
- ยังไม่พัฒนาในเวอร์ชันปัจจุบัน
- แนวคิดเบื้องต้น: จัดการตลาดและแผง ตรวจสอบคำขอจอง และจัดการข้อมูลร้าน

## ออกแบบฐานข้อมูล (MariaDB)

ฐานข้อมูลจัดเก็บบัญชีร้านค้า ตลาด ผังแผง หมวดสินค้า การจอง สิ่งอำนวยความสะดวก (ลานจอดรถ/โซนที่นั่งรับประทานอาหาร) และรายการร้านอาหารแนะนำ โดยลูกค้าไม่จำเป็นต้องมีบัญชีในเวอร์ชันแรก ตารางทั้งหมดใช้ InnoDB และ `utf8mb4` รองรับภาษาไทย; วันที่จองใช้ `DATE` ตาม timezone ของตลาด

### ความสัมพันธ์หลัก
- `users` 1 ต่อ 1 `shops`: บัญชีผู้ใช้งานร้านค้าหนึ่งบัญชีเป็นเจ้าของข้อมูลร้านหนึ่งรายการ
- `markets` 1 ต่อหลาย `booths`: ตลาดหนึ่งแห่งมีแผงได้หลายแผง
- `markets` 1 ต่อหลาย `bookings`: ตลาดหนึ่งแห่งมีคำขอจองได้หลายรายการ
- `shops` 1 ต่อหลาย `bookings`: ร้านหนึ่งสามารถมีประวัติการจองหลายรายการและจองหลายแผงในวันเดียวกันได้
- `booths` 1 ต่อหลาย `bookings`: แผงหนึ่งมีประวัติ booking หลายรายการในคนละวัน แต่จองได้ไม่เกินหนึ่งร้านต่อวัน
- `categories` 1 ต่อหลาย `shops`: ร้านหนึ่งเลือกหมวดหลักได้หนึ่งหมวด; อนาคตสามารถเพิ่มตารางเชื่อมหลายหมวดได้
- `markets` 1 ต่อหลาย `market_facilities`: ตลาดหนึ่งแห่งมีพื้นที่จอดรถและโซนนั่งรับประทานอาหารหลายจุด
- `markets` 1 ต่อหลาย `market_food_recommendations`: ตลาดหนึ่งแห่งมีร้านอาหารแนะนำหลายร้าน โดยแต่ละรายการชี้ไปยังแผงบนแผนผัง

### 1. `users` — บัญชีผู้ใช้ร้านค้า
- `id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`: รหัสบัญชีภายใน
- `email VARCHAR(254) NOT NULL UNIQUE`: อีเมลสำหรับเข้าสู่ระบบ; เก็บรูปแบบมาตรฐานตัวพิมพ์เล็ก
- `password_hash VARCHAR(255) NOT NULL`: hash รหัสผ่านที่สร้างด้วยอัลกอริทึมที่เหมาะสม เช่น bcrypt/Argon2 ห้ามเก็บรหัสผ่านจริง
- `contact_name VARCHAR(120) NOT NULL`: ชื่อผู้ติดต่อ
- `phone VARCHAR(30) NOT NULL`: เบอร์โทรศัพท์ เก็บเป็นข้อความเพื่อรองรับ + และเลขศูนย์นำหน้า
- `account_status ENUM('active','disabled') NOT NULL DEFAULT 'active'`: สถานะบัญชี
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`: วันเวลาสมัคร
- `updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`: วันเวลาแก้ไขล่าสุด

### 2. `categories` — หมวดหมู่สินค้า
- `id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`: รหัสหมวดหมู่
- `name VARCHAR(80) NOT NULL UNIQUE`: ชื่อหมวดหมู่ เช่น อาหาร เครื่องดื่ม เสื้อผ้า
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`: วันเวลาสร้าง

### 3. `shops` — ข้อมูลร้านค้า
- `id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`: รหัสร้าน
- `user_id INT UNSIGNED NOT NULL UNIQUE`: เจ้าของร้าน อ้างอิง `users.id`
- `category_id INT UNSIGNED NULL`: หมวดหลัก อ้างอิง `categories.id`
- `name VARCHAR(150) NOT NULL`: ชื่อร้าน
- `description TEXT NULL`: รายละเอียดร้านหรือสินค้า
- `public_phone VARCHAR(30) NULL`: เบอร์ติดต่อที่ยินยอมเผยแพร่
- `public_contact VARCHAR(255) NULL`: ช่องทางติดต่อสาธารณะ เช่น URL หรือชื่อบัญชีโซเชียล
- `is_published TINYINT(1) NOT NULL DEFAULT 0`: แสดงร้านแก่ลูกค้าเมื่อเปิดเผยข้อมูลแล้ว
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`: วันเวลาสร้าง
- `updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`: วันเวลาแก้ไขล่าสุด
- Foreign key: `user_id` ไป `users.id` ใช้ `ON DELETE CASCADE`; `category_id` ไป `categories.id` ใช้ `ON DELETE SET NULL`

### 4. `markets` — ตลาด
- `id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`: รหัสตลาด
- `name VARCHAR(150) NOT NULL`: ชื่อตลาด
- `description TEXT NULL`: คำแนะนำหรือรายละเอียดตลาด
- `address VARCHAR(255) NULL`: ที่อยู่
- `timezone VARCHAR(64) NOT NULL DEFAULT 'Asia/Bangkok'`: timezone ที่ใช้กำหนดวันจองรายวัน
- `map_image_path VARCHAR(255) NULL`: พาธรูปแผนผังประกอบ (ถ้ามี)
- `public_code VARCHAR(64) NOT NULL UNIQUE`: รหัสสุ่มสำหรับ URL/QR สาธารณะ ห้ามใช้เลข id เดาง่ายเป็นรหัสเข้าถึง
- `is_active TINYINT(1) NOT NULL DEFAULT 1`: เปิด/ปิดการแสดงตลาด
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`: วันเวลาสร้าง
- `updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`: วันเวลาแก้ไขล่าสุด

### 5. `booths` — แผงในตลาด
- `id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`: รหัสแผง
- `market_id INT UNSIGNED NOT NULL`: ตลาดที่แผงสังกัด อ้างอิง `markets.id`
- `booth_code VARCHAR(32) NOT NULL`: หมายเลข/รหัสแสดงบนแผนผัง
- `description VARCHAR(255) NULL`: ตำแหน่งหรือคำอธิบาย
- `map_x DECIMAL(8,5) NULL` และ `map_y DECIMAL(8,5) NULL`: พิกัดสัดส่วนบนแผนผัง (0–100); NULL เมื่อยังไม่วางตำแหน่ง
- `map_width DECIMAL(8,5) NULL` และ `map_height DECIMAL(8,5) NULL`: ขนาดกรอบแผงบนผัง (0–100)
- `base_status ENUM('available','unavailable') NOT NULL DEFAULT 'available'`: สถานะที่ตลาดกำหนด เช่น เปิดให้จองหรือปิดใช้งาน; สถานะจองปัจจุบันคำนวณจากรายการ `bookings` ที่ยังมีผล ไม่บันทึกซ้ำไว้ที่แผง
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`: วันเวลาสร้าง
- `updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`: วันเวลาแก้ไขล่าสุด
- Unique: (`market_id`, `booth_code`) ป้องกันรหัสแผงซ้ำในตลาดเดียวกัน
- Foreign key: `market_id` ไป `markets.id` ใช้ `ON DELETE CASCADE`

### 6. `market_facilities` — ที่จอดรถและโซนที่นั่ง
- `id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`: รหัสสถานที่
- `market_id INT UNSIGNED NOT NULL`: ตลาดเจ้าของพื้นที่ อ้างอิง `markets.id`
- `facility_type ENUM('parking_car','parking_motorcycle','seating') NOT NULL`: ประเภทรถที่จอดหรือพื้นที่นั่ง
- `name VARCHAR(120) NOT NULL`: ชื่อที่แสดง เช่น ลานจอดรถยนต์/ศูนย์อาหาร
- `description VARCHAR(255) NULL`: รายละเอียดสิ่งอำนวยความสะดวก
- `location_label VARCHAR(100) NULL`: คำอธิบายตำแหน่ง เช่น ประตูเหนือ/โซน F
- `capacity SMALLINT UNSIGNED NOT NULL DEFAULT 0`: จำนวนช่องจอดหรือที่นั่งทั้งหมด
- `occupied_count SMALLINT UNSIGNED NOT NULL DEFAULT 0`: จำนวนที่ใช้อยู่; จำนวนว่างคำนวณจาก `GREATEST(capacity - occupied_count, 0)`
- `map_x DECIMAL(8,5) NULL`, `map_y DECIMAL(8,5) NULL`: ตำแหน่งบนแผนผังสัดส่วน 0–100
- `status ENUM('open','closed') NOT NULL DEFAULT 'open'`: เปิด/ปิดพื้นที่
- `updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`: เวลาแก้ไข occupancy/สถานะล่าสุด
- Index: (`market_id`,`facility_type`); Foreign key `market_id` ไป `markets.id` ใช้ `ON DELETE CASCADE`
- ขอบเขตรุ่นแรก: ลูกค้าดูจำนวนว่างจากข้อมูล occupancy ที่บันทึกไว้; การอัปเดตจำนวนแบบ sensor/เจ้าหน้าที่หรือจองที่จอดยังไม่รวม

### 7. `market_food_recommendations` — ร้านอาหารแนะนำ
- `id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY`: รหัสรายการแนะนำ
- `market_id INT UNSIGNED NOT NULL`: ตลาดเจ้าของรายการ อ้างอิง `markets.id`
- `booth_id INT UNSIGNED NOT NULL`: แผงที่ลูกค้ากดเพื่อดูตำแหน่งบนแผนผัง อ้างอิง `booths.id`
- `name VARCHAR(120) NOT NULL`: ชื่อร้าน/รายการแนะนำ
- `cuisine VARCHAR(60) NOT NULL`: ประเภทอาหารหรือหมวดร้าน
- `description VARCHAR(255) NOT NULL`: คำอธิบายสั้น ๆ ที่แสดงในการ์ด
- `image_path VARCHAR(255) NOT NULL`: path รูปภาพภายในเว็บ เช่น `/images/food-noodles.jpg`
- `price_label VARCHAR(80) NULL`: ข้อความราคาโดยประมาณ; ต้องตรวจและปรับให้ตรงข้อมูลจริง
- `is_demo TINYINT(1) NOT NULL DEFAULT 0`: ระบุข้อมูลตัวอย่างที่ไม่ใช่ร้านจริง
- `is_active TINYINT(1) NOT NULL DEFAULT 1`: ควบคุมการแสดงรายการ
- `featured_order SMALLINT UNSIGNED NOT NULL DEFAULT 0`: ลำดับแสดง
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`: วันเวลาสร้าง
- Unique: (`market_id`,`name`); Index: (`market_id`,`is_active`,`featured_order`)
- Foreign key: `market_id` ไป `markets.id` ใช้ `ON DELETE CASCADE`; `booth_id` ไป `booths.id` ใช้ `ON DELETE RESTRICT`
- ข้อมูล seed ของตลาดสาธิตต้องมีป้ายกำกับว่าเป็นตัวอย่าง; รูปภาพเก็บใน `public/images/` และไม่มีการเรียกรูปจาก third-party ขณะใช้งาน

### 8. `bookings` — คำขอจองแผง
- `id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY`: รหัสรายการจอง
- `shop_id INT UNSIGNED NOT NULL`: ร้านผู้ส่งคำขอ อ้างอิง `shops.id`
- `market_id INT UNSIGNED NOT NULL`: ตลาดที่ขอจอง อ้างอิง `markets.id`
- `booth_id INT UNSIGNED NOT NULL`: แผงที่ขอจอง อ้างอิง `booths.id`
- `status ENUM('confirmed','cancelled','completed') NOT NULL DEFAULT 'confirmed'`: ยืนยันและมีผลทันทีเมื่อจองสำเร็จ, ยกเลิก หรือสิ้นสุดการจอง
- `booking_date DATE NOT NULL`: วันที่จอง (รายวันตามเวลาท้องถิ่นของตลาด)
- Unique แบบมีเงื่อนไขในเชิงตรรกะ: หนึ่ง booking ที่ยังมีผลต่อ booth ต่อวัน; MariaDB ไม่มี unique partial index ทั่วไป จึงบังคับด้วย transaction และการล็อก booth ก่อน insert
- `shop_name_snapshot VARCHAR(150) NOT NULL`: ชื่อร้าน ณ เวลาส่งคำขอเพื่อเก็บประวัติ
- `category_name_snapshot VARCHAR(80) NULL`: หมวดสินค้า ณ เวลาส่งคำขอ
- `description_snapshot TEXT NULL`: รายละเอียดร้านที่ส่งพร้อมคำขอ
- `contact_snapshot VARCHAR(255) NULL`: ช่องทางติดต่อที่ส่งพร้อมคำขอ
- `shop_note VARCHAR(500) NULL`: หมายเหตุจากร้าน
- `review_note VARCHAR(500) NULL`: หมายเหตุการพิจารณา (รองรับผู้ดูแลในอนาคต)
- `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`: วันเวลาส่งคำขอ
- `updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`: วันเวลาแก้ไขสถานะล่าสุด
- Index ที่ควรมี: (`shop_id`,`created_at`), (`booth_id`,`booking_date`,`status`), (`market_id`,`booking_date`,`status`)
- Foreign key: `shop_id` ไป `shops.id`, `market_id` ไป `markets.id`, `booth_id` ไป `booths.id`; ใช้ `ON DELETE RESTRICT` เพื่อรักษาประวัติการจอง
- ตรวจสอบว่าตลาดของ `booth_id` ตรงกับ `market_id` ก่อนบันทึก

### กติกาความถูกต้องและการจอง
- กำหนด unique/index และ foreign key ตามรายการข้างต้น; `booking_date` ต้องเป็นวันที่ถูกต้องตามปฏิทิน และตลาดกำหนด timezone เพื่อระบุวันท้องถิ่น
- การจองเป็นรายวันตาม `booking_date` ของตลาด; หนึ่งแผงจองได้ไม่เกินหนึ่งร้านต่อวัน
- ก่อนรับ booking ให้เริ่ม transaction และล็อกแถวแผง จากนั้นตรวจว่ามี booking `confirmed` ของแผงเดียวกันในวันนั้นหรือไม่; ถ้ามีให้ปฏิเสธด้วย conflict เพื่อป้องกันคำขอพร้อมกัน
- ร้านหนึ่งจองหลายแผงได้ในวันเดียวกัน แต่ห้ามสร้าง booking ซ้ำสำหรับแผงเดียวกัน/วันเดียวกัน
- การจองที่สร้างสำเร็จเป็น `confirmed` ทันที ไม่ต้องรอ Admin; `available` คำนวณเมื่อไม่มี booking confirmed ในวันนั้นและ `base_status='available'`
- เจ้าของร้านยกเลิก booking ของตนได้ทุก booking ที่ยังไม่ `cancelled`/`completed`; เปลี่ยนสถานะเป็น `cancelled` แทนการลบแถว เพื่อเก็บประวัติ
- ห้ามลบผู้ใช้/ร้าน/ตลาดที่มีประวัติ booking โดยไม่กำหนดนโยบายเก็บรักษาข้อมูล
- `shops.is_published` และข้อมูล snapshot ใช้ควบคุมข้อมูลที่เผยแพร่แก่ลูกค้า; ไม่ส่งอีเมลหรือเบอร์ส่วนตัวจาก `users` ไปหน้าแผนผัง

## API (REST, JSON)

API ใช้ prefix `/api/v1`, JSON แบบ UTF-8 และวันที่จองแบบ `YYYY-MM-DD` ตาม timezone ของตลาด ใช้ `Content-Type: application/json`; endpoints สาธารณะไม่ต้องล็อกอิน ส่วน endpoints ร้านค้าต้องใช้ cookie session ที่ปลอดภัยผ่าน HTTPS และตรวจสิทธิ์ฝั่งเซิร์ฟเวอร์ทุกครั้ง

### รูปแบบคำตอบและข้อผิดพลาด
- สำเร็จ: `{ "data": { ... } }`; รายการแบบแบ่งหน้า: `{ "data": [...], "meta": { "page": 1, "limit": 20, "total": 45 } }`
- ผิดพลาด: `{ "error": { "code": "VALIDATION_ERROR", "message": "ตรวจสอบข้อมูลที่กรอก", "fields": { "email": "รูปแบบอีเมลไม่ถูกต้อง" } } }`
- HTTP ที่ใช้: `200` สำเร็จ, `201` สร้างข้อมูล, `204` สำเร็จไม่มี body, `400` รูปแบบคำขอผิด, `401` ยังไม่เข้าสู่ระบบ, `403` ไม่มีสิทธิ์, `404` ไม่พบ, `409` ข้อมูลขัดแย้ง/แผงไม่ว่าง, `422` validation ไม่ผ่าน, `429` จำกัดคำขอ, `500` ข้อผิดพลาดระบบ
- ห้ามส่ง `password_hash`, รหัสผ่าน หรือข้อมูลบัญชีส่วนตัวใน response; ข้อความ error ไม่เปิดเผย SQL หรือรายละเอียดภายใน

### Authentication และ Shop

| Method | Path | สิทธิ์ | รายละเอียด |
|---|---|---|---|
| `POST` | `/auth/register` | สาธารณะ | สมัครบัญชีและข้อมูลร้าน พร้อมสร้าง `users` และ `shops` ใน transaction |
| `POST` | `/auth/login` | สาธารณะ | ตรวจอีเมล/รหัสผ่านและสร้าง cookie session ที่ปลอดภัย |
| `POST` | `/auth/logout` | Shop | ทำลาย cookie session ปัจจุบัน |
| `GET` | `/auth/me` | Shop | คืนข้อมูลบัญชีและร้านของผู้ใช้ปัจจุบัน |
| `GET` | `/shop/profile` | Shop | อ่านโปรไฟล์ร้านของตน |
| `PATCH` | `/shop/profile` | Shop | แก้ข้อมูลติดต่อ/ร้านและสถานะเผยแพร่ โดยไม่รับ `user_id` จาก client |

ตัวอย่างสมัคร:
```json
{
  "contact_name": "สมใจ ใจดี",
  "email": "shop@example.com",
  "phone": "0812345678",
  "password": "รหัสผ่านที่ผู้ใช้กำหนด",
  "shop": {
    "name": "ร้านขนมบ้านสวน",
    "category_id": 2,
    "description": "ขนมทำสด",
    "public_phone": "0812345678",
    "public_contact": "@baansuan"
  }
}
```
`201` ตอบข้อมูลผู้ใช้แบบไม่รวมรหัสผ่านและข้อมูลร้าน; ตรวจอีเมลซ้ำด้วย `409 EMAIL_ALREADY_EXISTS`, ยืนยันนโยบายความยาว/ความแข็งแรงของรหัสผ่าน, hash ฝั่ง server และจำกัดอัตราคำขอ login/register

ตัวอย่าง login: `{ "email": "shop@example.com", "password": "..." }`; เมื่อสำเร็จให้สร้าง cookie session โดยตั้ง `HttpOnly`, `Secure` (บน HTTPS), `SameSite` และป้องกัน CSRF ในคำขอเปลี่ยนข้อมูล; session ต้องมีอายุหมดอายุและ logout ต้องทำลาย session ฝั่ง server

ตัวอย่างแก้โปรไฟล์:
```json
{
  "name": "ร้านขนมบ้านสวน",
  "category_id": 2,
  "description": "ขนมทำสดทุกวัน",
  "public_phone": "0812345678",
  "public_contact": "@baansuan",
  "is_published": true
}
```

### ข้อมูลสาธารณะสำหรับ Customer และ QR Code

| Method | Path | สิทธิ์ | รายละเอียด |
|---|---|---|---|
| `GET` | `/public/markets` | สาธารณะ | รายชื่อตลาดที่ `is_active=1` |
| `GET` | `/public/markets/{public_code}` | สาธารณะ | รายละเอียดตลาดและข้อมูล QR code ปลายทาง |
| `GET` | `/public/markets/{public_code}/map` | สาธารณะ | ผังแผง/ทางเดิน/โซน และตำแหน่งสิ่งอำนวยความสะดวกตามวันที่ระบุ |
| `GET` | `/public/markets/{public_code}/facilities` | สาธารณะ | รายละเอียดลานจอดรถและโซนนั่งกิน พร้อมความจุ/จำนวนว่าง |
| `GET` | `/public/markets/{public_code}/recommendations` | สาธารณะ | ร้านอาหารแนะนำพร้อมรูป ราคาโดยประมาณ และรหัสแผงสำหรับนำทางไปยังแผนผัง |
| `GET` | `/public/markets/{public_code}/shops` | สาธารณะ | ค้นหา/กรองร้านและแบ่งหน้า |
| `GET` | `/public/markets/{public_code}/shops/{shop_id}` | สาธารณะ | รายละเอียดร้านที่เผยแพร่และแผงที่มี booking ยืนยัน |
| `GET` | `/public/categories` | สาธารณะ | หมวดหมู่ที่ใช้กรองร้าน |

`GET /public/markets/{public_code}/recommendations?booking_date=YYYY-MM-DD` คืนรายการแนะนำที่เปิดใช้งาน เรียงตาม `featured_order`; แต่ละรายการมี `name`, `cuisine`, `description`, `image_path`, `price_label`, `is_demo` และ `booth` (รหัส/พิกัด/สถานะของแผง) ภาพต้องเป็น path ภายในเว็บและรายการตัวอย่างต้องระบุ `is_demo=true` ชัดเจน ปุ่มจากการ์ดพาไปยังแผงเดียวกันบนแผนผัง

พารามิเตอร์รายการร้าน: `q` คำค้นชื่อร้าน, `category_id`, `page` เริ่มที่ 1, `limit` ค่าเริ่มต้น 20 และสูงสุด 100, `sort` เช่น `name`; ค้นหาและกรองเฉพาะข้อมูลที่เผยแพร่แล้ว

`GET /public/markets/{public_code}/map?booking_date=YYYY-MM-DD` รับวันที่ที่ลูกค้าต้องการดู; หากไม่ส่งให้ใช้วันที่ปัจจุบันตาม timezone ของตลาด

ตัวอย่าง `GET .../map`:
```json
{
  "data": {
    "market": { "public_code": "ตลาด-รหัสสุ่ม", "name": "ตลาดตัวอย่าง", "map_image_path": "/images/market-map.webp" },
    "booths": [
      { "id": 21, "booth_code": "A01", "map_x": 10.0, "map_y": 15.0, "map_width": 8.0, "map_height": 6.0, "status": "confirmed", "shop": { "id": 8, "name": "ร้านขนมบ้านสวน", "category": { "id": 2, "name": "อาหาร" } } },
      { "id": 22, "booth_code": "A02", "map_x": 20.0, "map_y": 15.0, "map_width": 8.0, "map_height": 6.0, "status": "available", "shop": null }
    ],
    "facilities": [
      { "id": 1, "facility_type": "parking_car", "name": "ลานจอดรถยนต์", "location_label": "ประตูเหนือ", "capacity": 48, "occupied_count": 17, "available_count": 31, "status": "open", "map_x": 5, "map_y": 82 },
      { "id": 3, "facility_type": "seating", "name": "ศูนย์อาหารกลางตลาด", "location_label": "โซน F", "capacity": 64, "occupied_count": 28, "available_count": 36, "status": "open", "map_x": 46, "map_y": 80 }
    ]
  }
}
```
สถานะสาธารณะคำนวณเป็น `available` หรือ `confirmed` สำหรับวันที่ที่ลูกค้ากำลังดู; ไม่เปิดเผยข้อมูลส่วนตัวผู้ติดต่อ หรือ booking ที่ถูกยกเลิก

### จองแผงและประวัติ Shop

| Method | Path | สิทธิ์ | รายละเอียด |
|---|---|---|---|
| `GET` | `/markets/{market_id}/booths` | Shop | ดูแผงและสถานะว่างสำหรับวันที่เลือก |
| `POST` | `/bookings` | Shop | จองแผงรายวัน มีผลเป็น confirmed ทันที; สร้าง snapshot จากโปรไฟล์ฝั่ง server |
| `GET` | `/bookings` | Shop | ดูรายการจองของร้านตนเอง แบ่งหน้าและกรองสถานะ |
| `GET` | `/bookings/{booking_id}` | เจ้าของ booking | ดูรายละเอียด booking ของตน |
| `POST` | `/bookings/{booking_id}/cancel` | เจ้าของ booking | ยกเลิก booking ของตนที่ยังไม่ cancelled/completed ได้ทันที |

พารามิเตอร์ `GET booths`: `booking_date` จำเป็นในรูปแบบ `YYYY-MM-DD` ตาม timezone ตลาด; คืน `base_status` และสถานะการจองของวันนั้น

ตัวอย่างสร้าง booking:
```json
{
  "market_id": 3,
  "booth_id": 21,
  "booking_date": "2026-11-15",
  "shop_note": "ขอพื้นที่ใกล้ทางเข้า"
}
```
`201` คืนรายการพร้อม `status: "confirmed"` ซึ่งมีผลทันที; `409 BOOTH_UNAVAILABLE` เมื่อแผงปิดหรือมีผู้จองแล้วในวันนั้น, `422 INVALID_BOOKING_DATE` เมื่อวันที่ไม่ถูกต้อง, `404` เมื่อไม่พบตลาด/แผง; ใช้ `Idempotency-Key` เพื่อป้องกันการสร้าง booking ซ้ำจากการส่งซ้ำ

ตัวอย่างรายการจอง: `GET /api/v1/bookings?status=confirmed&page=1&limit=20`; response มี `id`, ตลาด, หมายเลขแผง, `booking_date`, `status`, `shop_name_snapshot`, `created_at`, `updated_at`; query ต้องจำกัดด้วย `shop_id` ที่ได้จาก session ไม่ใช้ shop id ที่ client ระบุ

การยกเลิก booking ใช้ `POST /bookings/{id}/cancel`; ตรวจ ownership และสถานะภายใน transaction แล้วเปลี่ยนเป็น `cancelled` โดยไม่ลบประวัติ, `409 BOOKING_NOT_CANCELLABLE` หากเป็น cancelled/completed อยู่แล้ว

### ขอบเขต Admin และพฤติกรรม API
- ไม่มี API สำหรับ Admin ในเวอร์ชันแรก; การดูแลข้อมูลตลาด/แผงและอนุมัติ booking เป็นงานหลังบ้านนอกขอบเขตปัจจุบัน ต้องเพิ่มระบบยืนยันตัวตนและสิทธิ์ Admin ก่อนเปิด endpoints เหล่านั้น
- การสมัครร้านสร้าง `users`/`shops`; ระบบเตรียมหมวดหมู่และข้อมูลตลาด/แผงตัวอย่างเพื่อทดลองใช้งาน โดยข้อมูลตลาดตัวอย่างต้องแทนด้วยข้อมูลจริงก่อนเปิดใช้งานจริง
- ใช้ parameterized queries, validate ชนิด/ความยาว/ช่วงค่าทุก field, จำกัดขนาด body, ใช้ pagination และเลือกเฉพาะคอลัมน์ที่ต้องส่งออก
- ทุก endpoint ที่แก้ booking ใช้ transaction; ตรวจการจอง booth เดิมใน booking_date เดียวกันและล็อกแถวแผงก่อน insert/update
- status transition ในระยะแรก: booking สร้างเป็น `confirmed` ทันที; Shop เจ้าของ booking เปลี่ยน `confirmed -> cancelled` ได้; `confirmed -> completed` จัดการภายหลัง; ไม่ใช้สถานะ pending/rejected ใน flow ปัจจุบัน
- ใช้ `409` สำหรับความขัดแย้งด้านสถานะ/ความพร้อม, `422` สำหรับข้อมูลไม่ผ่าน validation; บันทึก log โดยไม่ใส่รหัสผ่าน/token หรือข้อมูลส่วนบุคคลเกินจำเป็น

## ฟีเจอร์ขั้นต่ำ

### Shop
- สมัครสมาชิก เข้าสู่ระบบ และจัดการข้อมูลร้าน
- ดูแผนผังตลาดพร้อมสถานะแผงว่างและไม่ว่าง
- เลือกวันที่และแผงเพื่อจอง; รายการที่สำเร็จมีผลทันที
- ดูรายการจองรายวันและยกเลิก booking ของตนได้
- ดูรายละเอียดแผงที่ได้รับการยืนยัน

### Customer
- สแกน QR Code เพื่อเปิดแผนผังตลาดบนมือถือ
- ดูตำแหน่งร้าน ชื่อร้าน และประเภทสินค้า
- ค้นหาหรือกรองร้านตามชื่อหรือหมวดหมู่
- ดูรายละเอียดร้านและตำแหน่งบนแผนผัง

## ฟีเจอร์ในอนาคต (ยังไม่อยู่ในขอบเขตปัจจุบัน)

### Admin ผู้ดูแลตลาด
- จัดการแผงและผังตลาด
- ตรวจสอบ อนุมัติ หรือปฏิเสธคำขอจอง
- จัดการข้อมูลร้านและสร้าง QR Code สำหรับตลาด

## ขอบเขตและข้อกำหนดเบื้องต้น
- คำว่า `Shop` หมายถึงพ่อค้าแม่ค้าหรือผู้ดูแลร้านค้า
- คำว่า `Customer` หมายถึงลูกค้าหรือผู้เข้าชมตลาด
- ฟีเจอร์ Admin บันทึกไว้สำหรับพัฒนาภายหลัง และยังไม่รวมในขอบเขตเวอร์ชันปัจจุบัน
- ข้อมูลแผงและร้านค้าที่แสดงต่อสาธารณะควรเป็นข้อมูลที่ได้รับการยืนยันแล้ว
- รองรับหน้าจอมือถือเป็นหลัก โดยเฉพาะหน้าสำหรับเปิดจาก QR Code
