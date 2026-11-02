# 🌐 Schroling Horizontal 3D

Aplikasi Web 3D interaktif berbasis **Vue 3 (Composition API)**, **Three.js**, dan **Vite** dengan navigasi rel horizontal spasial (*horizontal 3D scrolling*) serta **Dashboard Manajemen** terintegrasi.

---

## ✨ Fitur Utama
1. **Horizontal Rail 3D Journey:**
   - Navigasi mulus di sepanjang sumbu X (*rail track*) dengan efek lerping kamera sinematik.
   - Didukung interaksi mouse wheel, touch swipe, drag kursor, keyboard `[←]` `[→]`, dan tombol navigasi HUD.
2. **Geometri 3D Interaktif:**
   - Torus Knot kinetik, Quantum Icosahedron, Cyber Monolith, Liquid Chrome Sphere, Spatial Portal Ring, dan Hypercube Matrix.
   - Respon hover dinamis (raycasting), rotasi otomatis, pencahayaan multi-titik per stasiun.
3. **Atmospheric FX & Audio Synth:**
   - Ribuan partikel stardust mengambang 3D dan grid highway futuristik.
   - Sintesis audio Web Audio API prosedural (tanpa file mp3 eksternal).
4. **Dashboard Manajemen Lengkap:**
   - **Ringkasan & Metrik:** Telemetri interaksi pengguna dan status stasiun.
   - **Stasiun & Konten:** Tambah, edit teks/badge/CTA, ubah bentuk 3D, atur warna, dan urutkan stasiun (*drag/reorder*).
   - **Pengaturan 3D:** Slider FOV, jarak kamera, intensitas cahaya, kerapatan partikel, dan kabut (fog).
   - **Preset & Cadangan:** Preset visual instan (*Cyberpunk*, *Deep Space*, *Emerald*), serta ekspor/impor JSON dan reset bawaan.
   - **Live Sync & Persistent:** Perubahan langsung terlihat di layar dan tersimpan otomatis ke `localStorage`.

---

## 🚀 Menjalankan Proyek Secara Lokal

```bash
# 1. Masuk ke direktori 3d
cd 3d

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Bangun untuk produksi
npm run build
```
Akses di browser pada: `http://localhost:5175/` (atau port yang ditampilkan oleh Vite).
