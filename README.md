# Omise Payment Gateway Integration

โปรเจกต์นี้เป็นระบบเชื่อมต่อ Omise Payment Gateway สำหรับชำระเงินผ่านบัตรเครดิต และ QR Code (PromptPay)

---

## โครงสร้างโปรเจกต์

ประกอบด้วย 2 ส่วนหลัก:

- 🖥 Backend (/BE) – ใช้ Node.js + Express  
- 💻 Frontend (/FE) – ใช้ Vue.js

---

## Backend (/BE)

### ติดตั้ง package 

```bash
cd BE
npm install
````

### สร้างไฟล์ .env
```bash
PORT=8001
BASE_URL=http://localhost:8001
FE_BASE_URL=http://localhost:8080/
OMISE_PUBLIC_KEY=<your_omise_public_key>
OMISE_SECRET_KEY=<your_omise_secret_key>
OMISE_VERSION=2019-05-29
OMISE_CHECKOUT=https://cdn.omise.co/pay.html
OMISE_LIBRARY=https://cdn.omise.co/omise.js
````

### คำสั่ง run
```bash
npm run dev
````

---

## Frontend (/FE)

### ติดตั้ง package และสร้างไฟล์ .env

```bash
cd FE
npm install
````

### สร้างไฟล์ .env
```bash
VUE_APP_BE_BASE_URL=http://localhost:8001
VUE_APP_FE_BASE_URL=http://localhost:8080
VUE_APP_OMISE_PUBLIC_KEY=<your_omise_public_key>
VUE_APP_OMISE_LIBRARY=https://cdn.omise.co/omise.js
VUE_APP_OMISE_SOURCES_URL=https://api.omise.co/sources
````

### คำสั่ง run
```bash
npm run serve
````

---

## Setting Omise
1. สมัครสมาชิก omise
    https://dashboard.omise.co/v2/signup
2. เปลี่ยน config ใน file .env
3. ใช้การ์ดสำหรับ test
    https://docs.omise.co/api-testing

---

## Setting ngrok
1. สมัครสมาชิก ngrok
2. ติดตั้ง ngrok
3. run ngrok
4. นำ URL ที่ได้มาใช้ในการ set webhook omise


---
[![▶️ Watch the video]((./public/shoping-web-prevideo.png))](https://github.com/RocketGoose008/repo/raw/main/public/shoping-web-prevideo.mp4)


[▶️ Watch the video](./shoping-web-prevideo.mp4)
