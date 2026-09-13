# Software Requirements Specification (SRS)
## AnemiaSense – Aplikasi Skrining Risiko Anemia Berbasis Data Wearable dan Siklus Menstruasi

**Versi:** 1.0  
**Tanggal:** September 2026  
**Status:** Draft

---

# 1. Pendahuluan

## 1.1 Tujuan

Dokumen Software Requirements Specification (SRS) ini mendefinisikan kebutuhan perangkat lunak untuk **AnemiaSense**, yaitu aplikasi yang membantu pengguna memantau kondisi tubuh dan melakukan **skrining awal risiko anemia** dengan memanfaatkan data fisiologis dari wearable device serta informasi siklus menstruasi.

Aplikasi tidak dimaksudkan untuk menggantikan pemeriksaan medis atau memberikan diagnosis anemia. Sistem memberikan **indikasi tingkat risiko** berdasarkan pola data yang tersedia dan memberikan rekomendasi kepada pengguna untuk melakukan pemeriksaan lebih lanjut apabila diperlukan.

## 1.2 Ruang Lingkup

AnemiaSense merupakan aplikasi mobile yang mengintegrasikan:

1. Data siklus menstruasi pengguna.
2. Data fisiologis dari wearable device.
3. Pemantauan Heart Rate (HR).
4. Pemantauan Heart Rate Variability (HRV), apabila tersedia.
5. Data temperatur tubuh, apabila tersedia.
6. Analisis pola data fisiologis.
7. Analisis hubungan antara menstruasi dan perubahan kondisi fisiologis.
8. Skrining risiko anemia.
9. Visualisasi hasil dalam bentuk yang mudah dipahami.
10. Pemberian rekomendasi tindakan selanjutnya.

Sistem berfokus pada **early screening**, bukan diagnosis medis.

### Batasan Sistem

AnemiaSense tidak:

- Menentukan diagnosis anemia secara definitif.
- Menggantikan pemeriksaan hemoglobin (Hb).
- Menggantikan pemeriksaan laboratorium.
- Memberikan resep obat.
- Menentukan dosis suplemen atau obat.
- Menyatakan bahwa pengguna pasti mengalami anemia hanya berdasarkan data wearable.

---

# 2. Gambaran Umum Produk

## 2.1 Perspektif Produk

AnemiaSense berada pada posisi antara aplikasi **cycle tracking** dan aplikasi **fitness/wearable monitoring**.

Aplikasi cycle tracking umumnya berfokus pada pencatatan dan prediksi menstruasi, sedangkan aplikasi wearable umumnya berfokus pada data fisiologis seperti HR, HRV, tidur, dan aktivitas.

AnemiaSense menghubungkan:

> **Siklus menstruasi + data fisiologis + perubahan pola tubuh → skrining risiko anemia**

Contoh alur:

```text
Data Menstruasi
       +
Data Wearable
       +
Gejala yang Dilaporkan
       ↓
Personal Baseline
       ↓
Analisis Pola
       ↓
Anemia Risk Screening
       ↓
Risk Score
       ↓
Rekomendasi
```

---

# 3. Kelas dan Karakteristik Pengguna

| Pengguna | Karakteristik | Kebutuhan |
|---|---|---|
| Pengguna umum | Pengguna smartphone dan wearable | Monitoring kesehatan sederhana |
| Pengguna menstruasi | Melakukan pencatatan siklus | Mengetahui hubungan siklus dengan kondisi tubuh |
| Pengguna dengan wearable | Memiliki smartwatch/ring/fitness tracker | Sinkronisasi data otomatis |
| Pengguna berisiko | Memiliki pola menstruasi berat atau perubahan fisiologis | Mendapatkan peringatan risiko |
| Tenaga kesehatan* | Membaca hasil jika pengguna memilih membagikannya | Informasi tambahan untuk konsultasi |

> *Integrasi tenaga kesehatan dapat menjadi pengembangan tahap berikutnya dan bukan bagian dari MVP.*

---

# 4. Kebutuhan Fungsional

## 4.1 Registrasi dan Autentikasi

### FR-01 – Registrasi

Sistem harus memungkinkan pengguna membuat akun menggunakan:

- Email
- Password
- Metode autentikasi pihak ketiga apabila tersedia.

### FR-02 – Login

Sistem harus memungkinkan pengguna masuk menggunakan kredensial yang telah terdaftar.

### FR-03 – Logout

Pengguna harus dapat keluar dari akun.

### FR-04 – Pemulihan Password

Sistem harus menyediakan mekanisme pemulihan password.

---

# 5. User Onboarding

### FR-05 – Informasi Pengguna

Pada penggunaan pertama, sistem harus meminta informasi yang diperlukan, seperti:

- Usia
- Siklus menstruasi rata-rata
- Durasi menstruasi
- Informasi umum aktivitas fisik
- Perangkat wearable yang digunakan

Informasi yang tidak diperlukan untuk analisis tidak boleh dikumpulkan.

### FR-06 – Health Disclaimer

Sistem harus menampilkan informasi bahwa hasil aplikasi merupakan **skrining risiko dan bukan diagnosis medis**.

Pengguna harus menyetujui disclaimer sebelum menggunakan fitur analisis.

---

# 6. Menstrual Cycle Tracking

### FR-07 – Pencatatan Menstruasi

Pengguna dapat mencatat:

- Tanggal mulai menstruasi
- Tanggal selesai menstruasi
- Durasi menstruasi
- Intensitas perdarahan

### FR-08 – Intensitas Perdarahan

Sistem menyediakan kategori:

- Ringan
- Sedang
- Berat
- Sangat berat

### FR-09 – Gejala Menstruasi

Pengguna dapat mencatat gejala seperti:

- Kelelahan
- Pusing
- Sakit kepala
- Sesak
- Jantung berdebar
- Lemah
- Nyeri menstruasi

Gejala digunakan sebagai informasi tambahan dan tidak boleh digunakan sendirian untuk menentukan diagnosis.

### FR-10 – Prediksi Siklus

Sistem dapat memperkirakan periode menstruasi berikutnya berdasarkan data historis pengguna.

---

# 7. Integrasi Wearable

Data fisiologis kontinu menjadi salah satu fitur utama aplikasi.

### FR-11 – Koneksi Wearable

Sistem harus memungkinkan pengguna menghubungkan wearable yang didukung, misalnya:

- Apple Watch
- Samsung Galaxy Watch
- Fitbit
- Garmin
- Oura
- WHOOP

Ketersediaan aktual bergantung pada API atau platform yang dapat diakses.

### FR-12 – Heart Rate

Sistem dapat mengambil:

- Resting Heart Rate
- Average Heart Rate
- Heart Rate saat tidur
- Heart Rate saat aktivitas

### FR-13 – Heart Rate Variability

Jika tersedia dari perangkat, sistem mengambil:

- HRV
- Perubahan HRV terhadap baseline pengguna.

### FR-14 – Temperatur

Jika perangkat menyediakan data temperatur, sistem dapat mengambil:

- Temperatur kulit/tubuh
- Perubahan temperatur relatif terhadap baseline.

### FR-15 – Sinkronisasi

Sistem harus dapat melakukan sinkronisasi data secara berkala.

### FR-16 – Data Tidak Tersedia

Jika data wearable tidak tersedia, sistem harus memberi tahu pengguna dan tidak menganggap data yang hilang sebagai kondisi abnormal.

Contoh:

> "Data HR hari ini belum tersedia. Hubungkan wearable untuk mendapatkan analisis yang lebih lengkap."

---

# 8. Analisis Personal Baseline

### FR-17 – Personal Baseline

Sistem harus membentuk baseline berdasarkan data historis pengguna.

Contoh:

- HR normal pengguna
- HRV normal pengguna
- Temperatur normal pengguna

### FR-18 – Deteksi Tren

Sistem harus mendeteksi perubahan terhadap baseline pengguna.

Contoh:

> HR istirahat pengguna meningkat secara konsisten dibandingkan baseline beberapa hari sebelumnya.

### FR-19 – Kualitas Data

Sistem harus mempertimbangkan kualitas dan kelengkapan data sebelum melakukan analisis.

---

# 9. Skrining Risiko Anemia

## FR-20 – Risk Score

Sistem menghasilkan **Anemia Risk Score** berdasarkan kombinasi data yang tersedia.

Contoh kategori rancangan:

| Score | Kategori |
|---:|---|
| 0–30 | Rendah |
| 31–60 | Perlu diperhatikan |
| 61–80 | Tinggi |
| 81–100 | Sangat tinggi |

> **Catatan:** Threshold di atas merupakan contoh rancangan sistem/UI dan bukan threshold medis tervalidasi. Nilai final harus ditentukan melalui penelitian dan validasi klinis.

## FR-21 – Faktor Risiko

Sistem dapat mempertimbangkan:

### Faktor Menstruasi

- Durasi menstruasi
- Intensitas perdarahan
- Frekuensi menstruasi
- Riwayat pola menstruasi

### Faktor Fisiologis

- Resting HR
- HRV
- Temperatur
- Pola tidur
- Aktivitas fisik

### Faktor Gejala

- Kelelahan
- Pusing
- Lemah
- Sesak
- Jantung berdebar

---

# 10. Analisis Risiko

Sistem harus menampilkan alasan mengapa skor risiko berubah.

Contoh:

> **Risiko meningkat**
>
> Beberapa perubahan terdeteksi:
> - Resting HR meningkat dibandingkan baseline.
> - HRV menurun dibandingkan pola normal.
> - Anda mencatat perdarahan menstruasi berat.
> - Keluhan kelelahan dilaporkan selama beberapa hari.

Sistem tidak boleh hanya memberikan skor tanpa penjelasan.

---

# 11. Dashboard

### FR-22 – Health Dashboard

Dashboard utama menampilkan:

- Status risiko
- Siklus menstruasi
- HR
- HRV
- Temperatur
- Sleep
- Trend kesehatan

Contoh:

```text
┌─────────────────────────────┐
│        AnemiaSense          │
├─────────────────────────────┤
│                             │
│       Risk Level            │
│         MODERATE            │
│                             │
│       Score: 54/100         │
│                             │
├─────────────────────────────┤
│ Resting HR       78 bpm     │
│ HRV              42 ms      │
│ Temperature      +0.2°C     │
│                             │
├─────────────────────────────┤
│ Menstrual Cycle             │
│ Day 3 • Heavy Flow          │
└─────────────────────────────┘
```

---

# 12. Sistem Notifikasi

### FR-23 – Notifikasi Risiko

Sistem dapat memberikan notifikasi apabila ditemukan pola yang perlu diperhatikan.

Contoh:

> "Kami menemukan perubahan pada beberapa indikator tubuh Anda selama beberapa hari terakhir."

### FR-24 – Rekomendasi Pemeriksaan

Jika risiko berada pada tingkat tinggi secara konsisten, sistem memberikan rekomendasi untuk mempertimbangkan konsultasi dengan tenaga kesehatan dan pemeriksaan seperti hemoglobin (Hb).

Sistem tidak boleh menyatakan pengguna pasti mengalami anemia.

---

# 13. Riwayat Kesehatan

### FR-25 – Data Historis

Pengguna dapat melihat histori:

- Siklus menstruasi
- HR
- HRV
- Temperatur
- Risk Score

### FR-26 – Visualisasi Tren

Data dapat ditampilkan dalam bentuk grafik untuk melihat perubahan dari waktu ke waktu.

---

# 14. Edukasi Kesehatan

### FR-27 – Konten Edukasi

Sistem menyediakan edukasi mengenai:

- Anemia
- Hemoglobin
- Zat besi
- Menstruasi dan kehilangan darah
- Gejala anemia
- Pentingnya pemeriksaan medis

### FR-28 – Edukasi Personal

Konten dapat disesuaikan dengan kondisi pengguna.

Contoh:

> "Anda mencatat menstruasi dengan perdarahan berat. Pelajari bagaimana kehilangan darah dapat berkaitan dengan risiko kekurangan zat besi."

---

# 15. Privasi dan Manajemen Data

### FR-29 – Persetujuan Data

Sistem harus meminta persetujuan sebelum mengambil data kesehatan dari wearable.

### FR-30 – Penghapusan Data

Pengguna harus dapat menghapus data mereka.

### FR-31 – Penghapusan Akun

Pengguna harus dapat menghapus akun.

### FR-32 – Berbagi Data

Pengguna harus dapat menentukan apakah data boleh dibagikan kepada pihak lain.

---

# 16. Kebutuhan Non-Fungsional

## 16.1 Performance

### NFR-01

Dashboard harus dapat ditampilkan dalam waktu maksimal **3 detik** pada kondisi jaringan normal.

### NFR-02

Sinkronisasi data wearable harus berjalan secara asynchronous sehingga tidak menghambat penggunaan aplikasi.

---

## 16.2 Usability

### NFR-03

Pengguna baru harus dapat memahami fungsi utama aplikasi tanpa tutorial panjang.

### NFR-04

Pencatatan menstruasi harus dapat dilakukan dalam beberapa langkah.

### NFR-05

Informasi kesehatan harus menggunakan bahasa sederhana dan tidak terlalu teknis.

---

## 16.3 Accessibility

### NFR-06

Aplikasi harus menggunakan:

- Font yang mudah dibaca
- Kontras warna yang memadai
- Icon dengan label
- Ukuran tombol yang cukup besar

---

# 17. Security Requirements

### NFR-07

Data pengguna harus disimpan secara aman.

### NFR-08

Password tidak boleh disimpan dalam bentuk plaintext.

### NFR-09

Komunikasi antara aplikasi dan server harus menggunakan koneksi terenkripsi.

### NFR-10

Data kesehatan pengguna hanya dapat diakses oleh pihak yang memiliki otorisasi.

### NFR-11

Sistem harus menerapkan prinsip **data minimization**, yaitu hanya menyimpan data yang diperlukan.

---

# 18. Reliability

### NFR-12

Jika wearable gagal melakukan sinkronisasi, aplikasi tetap dapat digunakan untuk fitur yang tidak membutuhkan data wearable.

### NFR-13

Kegagalan sinkronisasi tidak boleh menyebabkan data menstruasi pengguna hilang.

### NFR-14

Sistem harus memberi status yang jelas ketika data tidak cukup untuk melakukan analisis.

Contoh:

> **Data belum cukup**
>
> "Kami membutuhkan lebih banyak data untuk memberikan analisis yang lebih akurat."

---

# 19. Arsitektur Sistem

```text
                  ┌─────────────────┐
                  │     Wearable    │
                  │ Apple/Samsung/  │
                  │ Fitbit/Oura/etc │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │ Health API /    │
                  │ Wearable API    │
                  └────────┬────────┘
                           │
                           ▼
┌──────────────┐    ┌─────────────────┐
│  Mobile App  │───▶│  Backend Server │
│              │    │                 │
│ Cycle Data   │    │ User Data       │
│ Dashboard    │    │ Health Data     │
│ Risk Result  │    │ Analysis        │
└──────────────┘    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Risk Analysis   │
                    │ Engine          │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ Risk Score &    │
                    │ Recommendation  │
                    └─────────────────┘
```

---

# 20. Use Case

## UC-01 – Mencatat Menstruasi

**Actor:** User

**Precondition:** User telah login.

### Main Flow

1. User membuka aplikasi.
2. User memilih menu "Cycle".
3. User memilih tanggal menstruasi.
4. User memilih intensitas perdarahan.
5. User dapat menambahkan gejala.
6. Sistem menyimpan data.
7. Sistem memperbarui informasi siklus.
8. Sistem memperbarui analisis risiko.

### Postcondition

Data menstruasi tersimpan.

---

## UC-02 – Menghubungkan Wearable

**Actor:** User

### Main Flow

1. User membuka Settings.
2. User memilih "Connect Wearable".
3. Sistem menampilkan wearable yang didukung.
4. User memilih perangkat.
5. Sistem meminta permission.
6. User memberikan permission.
7. Sistem melakukan sinkronisasi.
8. Data fisiologis masuk ke sistem.

### Postcondition

Wearable berhasil terhubung.

---

## UC-03 – Melihat Risiko Anemia

**Actor:** User

### Main Flow

1. User membuka dashboard.
2. Sistem mengambil data terbaru.
3. Sistem memeriksa kualitas data.
4. Sistem membandingkan data dengan baseline pengguna.
5. Sistem melakukan analisis.
6. Sistem menghasilkan Risk Score.
7. Sistem menampilkan faktor yang berkontribusi.
8. Sistem memberikan rekomendasi.

---

# 21. Use Case Diagram Sederhana

```text
                         ┌──────────────────────┐
                         │      AnemiaSense      │
                         │                      │
       ┌───────┐         │ ┌─────────────────┐ │
       │       │─────────┼▶│ Register/Login  │ │
       │       │         │ └─────────────────┘ │
       │       │         │                     │
       │       │─────────┼▶ Record Menstruation│
       │ User  │         │                     │
       │       │─────────┼▶ Connect Wearable  │
       │       │         │                     │
       │       │─────────┼▶ View Dashboard    │
       │       │         │                     │
       │       │─────────┼▶ View Risk Score   │
       │       │         │                     │
       │       │─────────┼▶ View History      │
       └───────┘         │                     │
                         │ ┌─────────────────┐ │
                         │ │ Risk Analysis   │ │
                         │ └─────────────────┘ │
                         └──────────────────────┘
                                   ▲
                                   │
                            ┌──────┴──────┐
                            │   Wearable  │
                            └─────────────┘
```

---

# 22. Kebutuhan Data

| Data | Sumber | Kegunaan |
|---|---|---|
| Usia | User | Informasi pengguna |
| Menstrual date | User | Cycle tracking |
| Menstrual flow | User | Faktor risiko |
| Symptoms | User | Faktor tambahan |
| Heart Rate | Wearable | Analisis fisiologis |
| HRV | Wearable | Analisis fisiologis |
| Temperature | Wearable | Analisis perubahan tubuh |
| Sleep | Wearable | Faktor pendukung |
| Activity | Wearable | Konteks fisiologis |
| Risk Score | System | Hasil skrining |

---

# 23. Batasan Medis

Bagian ini merupakan komponen penting dalam SRS.

Sistem sebaiknya tidak mendefinisikan fungsi sebagai:

> "Aplikasi mendeteksi anemia."

Definisi yang lebih tepat:

> **"Aplikasi melakukan skrining risiko anemia berdasarkan pola data fisiologis dan informasi siklus menstruasi."**

Wearable tidak secara langsung mengukur kadar hemoglobin. Oleh karena itu, hasil aplikasi harus diposisikan sebagai **risk screening**, bukan diagnosis.

Alur sistem:

```text
Wearable Data
    │
    ├── HR
    ├── HRV
    ├── Temperature
    ├── Sleep
    └── Activity
             +
Menstrual Data
    │
    ├── Durasi
    ├── Flow
    └── Frekuensi
             +
Reported Symptoms
    │
    ├── Fatigue
    ├── Dizziness
    └── Weakness
             │
             ▼
      Risk Analysis
             │
             ▼
       Risk Score
             │
       ┌─────┴─────┐
       ▼           ▼
      Low       Elevated
                  Risk
                   │
                   ▼
          Medical Examination
```

---

# 24. MVP Requirements

Untuk tahap MVP, fitur diprioritaskan sebagai berikut.

## Must Have

- Register/Login
- Menstrual tracking
- Menstrual flow tracking
- Symptom tracking
- Wearable integration
- HR data
- HRV data
- Personal baseline
- Risk score
- Risk explanation
- Dashboard
- Health disclaimer

## Should Have

- Temperature
- Sleep analysis
- Notification
- Educational content
- Historical graphs

## Could Have

- AI health assistant
- Doctor sharing
- PDF health report
- Multi-device synchronization
- Personalized recommendations

## Won't Have in MVP

- Diagnosis anemia
- Prescription
- Automatic medical treatment
- Penggantian pemeriksaan laboratorium

---

# 25. Acceptance Criteria

## Risk Screening

Fitur dianggap berhasil apabila:

1. Pengguna memiliki data yang cukup.
2. Sistem berhasil memperoleh data fisiologis.
3. Sistem dapat menggabungkan data fisiologis dan menstrual tracking.
4. Sistem menghasilkan Risk Score.
5. Sistem menampilkan kategori risiko.
6. Sistem menampilkan faktor yang berkontribusi terhadap hasil.
7. Sistem tidak menyatakan hasil sebagai diagnosis.
8. Sistem memberikan rekomendasi pemeriksaan medis ketika diperlukan.

---

# 26. Diferensiasi Produk

Berdasarkan analisis kompetitor, posisi AnemiaSense dapat dirumuskan sebagai berikut:

| Produk | Cycle Tracking | Wearable | Analisis Fisiologis | Fokus Anemia |
|---|---:|---:|---:|---:|
| Flo | ✓ | ✓ | Terbatas | Terbatas |
| Clue | ✓ | ✓ | ✓ | Tidak spesifik |
| Natural Cycles | ✓ | ✓ | ✓ | Tidak spesifik |
| Ovia | ✓ | ✓ | Terbatas | Tidak spesifik |
| Apple Health | ✓ | ✓ | ✓ | Tidak |
| Samsung Health | ✓ | ✓ | ✓ | Tidak |
| WHOOP/Garmin/Fitbit | — | ✓ | ✓ | Tidak |
| **AnemiaSense** | **✓** | **✓** | **✓** | **✓** |

## Unique Value Proposition

> **"AnemiaSense menghubungkan pola menstruasi dengan perubahan data fisiologis wearable untuk memberikan skrining awal risiko anemia secara personal dan mudah dipahami."**

---

# 27. Prioritas Fitur – MoSCoW

### Must Have

- Cycle tracking
- Wearable integration
- HR/HRV
- Risk analysis
- Risk score
- Dashboard
- Privacy

### Should Have

- Temperature
- Sleep
- Symptom tracking
- Notification
- Educational content

### Could Have

- AI assistant
- Doctor sharing
- PDF report
- Advanced visualization

### Won't Have

- Diagnosis
- Prescription
- Replacement for laboratory testing

---

# 28. Kesimpulan

AnemiaSense dirancang sebagai **personalized anemia-risk screening system**, bukan sebagai sistem diagnosis anemia.

Keunikan utama sistem adalah menggabungkan tiga sumber informasi:

> **Menstrual Pattern + Wearable Physiological Data + User-Reported Symptoms**

Data tersebut dianalisis terhadap **personal baseline** pengguna untuk menghasilkan **Risk Score** dan rekomendasi tindak lanjut.

Pendekatan ini menjawab celah yang terlihat pada produk kompetitor: aplikasi cycle tracking umumnya kuat dalam pencatatan siklus tetapi terbatas dalam analisis fisiologis, sedangkan aplikasi wearable kuat dalam pengumpulan data fisiologis tetapi tidak secara spesifik menghubungkannya dengan risiko anemia.
