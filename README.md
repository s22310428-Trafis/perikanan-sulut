# SIPROKAN SULUT - Sistem Informasi Hasil Produksi Perikanan Sulawesi Utara

Sistem Informasi Hasil Produksi Perikanan di Sulawesi Utara Berbasis Web (**SIPROKAN SULUT**) dirancang untuk mencatat, mengelola, menganalisis, dan memantau data hasil tangkapan laut dan pendaratan ikan di berbagai Pelabuhan Perikanan Samudera (PPS) dan Tempat Pelelangan Ikan (TPI) se-Provinsi Sulawesi Utara (Bitung, Manado, Minahasa Utara, Sangihe, Talaud, dan sekitarnya).

---

## 🏛️ Arsitektur Sistem

Aplikasi ini menggunakan arsitektur **Three-Tier decoupled**:

```
+-------------------------------------------------------+
|                 Frontend (React + Vite)               |
|      Tailwind CSS - Recharts - Lucide - Axios Client  |
|               Port: 5173 (http://localhost:5173)      |
+---------------------------▲---------------------------+
                            │ REST API (JSON)
                            │ CORS Enabled
+---------------------------▼---------------------------+
|               Backend (Spring Boot Web)               |
|        Controller ➔ Service ➔ Repository ➔ Firestore  |
|               Port: 8080 (http://localhost:8080)      |
+---------------------------▲---------------------------+
                            │ Firebase Admin SDK (gRPC)
                            │ Secure Service Account Key
+---------------------------▼---------------------------+
|              Database (Cloud Firestore)               |
|             Collection: "hasil_produksi"              |
+-------------------------------------------------------+
```

### Prinsip Utama & Batasan Sistem:
1. **Frontend Tidak Terhubung Langsung ke Firebase**: Seluruh manipulasi data wajib melalui REST API Spring Boot.
2. **Kalkulasi Total Nilai Otomatis di Backend**:
   $$\text{totalNilai} = \text{jumlahProduksi} \times \text{hargaPerKg}$$
   Backend selalu menghitung ulang nilai ini secara independen untuk menjamin konsistensi data.
3. **Database Cloud Firestore murni**: Tidak menggunakan MySQL, JPA, atau Hibernate.
4. **Keamanan Kredensial**: `serviceAccountKey.json` dilindungi penuh oleh `.gitignore` dan tidak boleh di-commit ke Git.

---

## 👥 Sistem Multi-Peran (Role-Based Access Control)

Aplikasi memiliki dua mode pengguna yang dapat diubah secara instan melalui switcher di Navbar & Sidebar:

### 1. Mode Administrator (DKP Sulut)
- **CRUD Produksi Penuh**:
  - `Create`: Tambah data pendaratan ikan baru ke Cloud Firestore.
  - `Read`: Meninjau seluruh katalog hasil produksi dengan filter dan pencarian.
  - `Update`: Mengubah data produksi dengan perhitungan ulang otomatis.
  - `Delete`: Menghapus data dengan dialog konfirmasi aman.
- **Dashboard**: Ringkasan metrik, grafik tren tangkapan, aksi cepat pencatatan baru.
- **Laporan**: Analisis menyeluruh dan ekspor dokumen (PDF, Excel, CSV).
- **Statistik**: Visualisasi KPI, sebaran komoditas perikanan, rasio alat tangkap, dan evaluasi ekonomi.

### 2. Mode Pengguna / Publik (Read-Only)
- **Akses Hanya Baca (Read-Only)**:
  - Tombol "+ Tambah Produksi", Edit, dan Hapus disembunyikan.
  - Proteksi form: Mencegah perubahan data pendaratan ikan.
- **Dashboard**: Meninjau ringkasan statistik dan pendaratan terbaru.
- **Data Produksi**: Katalog terbuka hasil tangkapan nelayan dengan detail lengkap.
- **Statistik**: Visualisasi terbuka tren perikanan maritim Sulawesi Utara.
- **Laporan**: Membaca rekapitulasi data dan mengunduh laporan publik.

---

## 💻 Tech Stack

### Frontend (`/frontend`)
- **Framework**: React 19 + Vite 8
- **Styling & Tema**: Tailwind CSS dengan nuansa Deep Ocean & Maritime Wave
- **Chart**: Recharts (Grafik Tren, Sebaran Pelabuhan, Donut Alat Tangkap, Komposisi Komoditas)
- **Icons**: Lucide React (Fish, Waves, Anchor, Compass, Ship, Shield, Eye)
- **HTTP Client**: Axios (dengan bidirectional mapper, error handling, & offline fallback)
- **Routing**: React Router DOM v7

### Backend (`/backend`)
- **Runtime & Framework**: Java 21, Spring Boot 3.4.x
- **Database Driver**: Firebase Admin SDK 9.4.3 (Google Cloud Firestore)
- **Validation**: Jakarta Bean Validation (`@NotBlank`, `@Positive`, `@NotNull`)
- **Dokumentasi API**: Springdoc OpenAPI 3 / Swagger UI 2.8.5
- **Testing**: JUnit 5, Mockito, Spring WebMvcTest

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- Java JDK 21+
- Node.js 18+ & npm
- File `serviceAccountKey.json` dari Firebase diletakkan di `backend/firebase/serviceAccountKey.json`

### 2. Menjalankan Backend (Spring Boot - Port 8080)
Buka terminal di folder `backend`:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
Atau menjalankan file JAR:
```powershell
cd backend
java -jar target/perikanan-sulut-0.0.1-SNAPSHOT.jar
```
Backend aktif di: **`http://localhost:8080`**

### 3. Menjalankan Frontend (React Vite - Port 5173)
Buka terminal baru di folder `frontend`:
```powershell
cd frontend
npm install
npm run dev
```
Buka browser di: **`http://localhost:5173`**

---

## 📖 Dokumentasi REST API

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/produksi` | Menambahkan data produksi baru (hitung otomatis totalNilai) |
| `GET` | `/api/produksi` | Mengambil seluruh daftar hasil produksi dari Cloud Firestore |
| `GET` | `/api/produksi/{id}` | Mengambil detail 1 data produksi berdasarkan ID |
| `PUT` | `/api/produksi/{id}` | Memperbarui data produksi (hitung ulang totalNilai) |
| `DELETE` | `/api/produksi/{id}` | Menghapus data produksi dari Firestore |
| `GET` | `/api/produksi/search` | Pencarian multi-parameter (ikan, nelayan, lokasi) |
| `GET` | `/api/dashboard/summary` | Ringkasan metrik statistik dashboard |
| `GET` | `/api/dashboard/produksi-per-ikan` | Agregasi volume & nilai per komoditas ikan |
| `GET` | `/api/dashboard/produksi-periode` | Agregasi tren hasil tangkapan per tanggal/periode |
| `GET` | `/api/laporan/summary` | Rekapitulasi komprehensif untuk modul laporan |

### Dokumentasi Interaktif Swagger UI
Akses Swagger UI melalui browser saat backend aktif:
- **`http://localhost:8080/swagger-ui/index.html`**
- **`http://localhost:8080/v3/api-docs`** (Spesifikasi OpenAPI JSON)

---

## 🧪 Pengujian & Verifikasi

### Backend Tests
```powershell
cd backend
.\mvnw.cmd test
```
Hasil: **22 tests run, 0 failures, 0 errors, BUILD SUCCESS**.

### Frontend Lint & Build
```powershell
cd frontend
npm run lint
npm run build
```
Hasil: **0 warnings, 0 errors**, build selesai dalam < 1 detik.
