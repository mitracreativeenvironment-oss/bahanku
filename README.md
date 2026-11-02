# 📦 Bahanku

[![Versi](https://img.shields.io/badge/version-v1.0.0-blue.svg)](file:///d:/bahanku/VERSION)
[![GitHub Release](https://img.shields.io/github/v/release/mitracreativeenvironment-oss/bahanku?color=success&label=GitHub%20Release)](https://github.com/mitracreativeenvironment-oss/bahanku/releases)
[![Changelog Otomatis](https://img.shields.io/badge/changelog-automated-orange.svg)](#-riwayat-perubahan-changelog-otomatis)

Repositori proyek **Bahanku**.

---

## 📌 Deskripsi Proyek
Repositori ini digunakan untuk pengelolaan dan penyimpanan berkas/kode proyek **Bahanku**. Dilengkapi dengan:
- **Sistem Versi Semantik (SemVer):** Manajemen versi standar industri (`MAJOR.MINOR.PATCH`).
- **Sistem Rilis Otomatis ke GitHub:** Pembuatan rilis GitHub resmi dan catatan rilis otomatis.
- **Pencatatan Perubahan Otomatis:** Pembaruan riwayat commit pada `README.md` secara real-time.

---

## 🏷️ Sistem Versi & Rilis Otomatis

Proyek ini mengadopsi standar **Semantic Versioning (vMAJOR.MINOR.PATCH)**:
- **`PATCH`** (misal `1.0.0` ➔ `1.0.1`): Perbaikan bug, refactor kecil, atau pembaruan dokumentasi.
- **`MINOR`** (misal `1.0.0` ➔ `1.1.0`): Penambahan fitur baru yang kompatibel ke belakang.
- **`MAJOR`** (misal `1.0.0` ➔ `2.0.0`): Perubahan besar yang memiliki breaking changes.

### 1. Cara Membuat Rilis dari Komputer Lokal:
Gunakan script rilis yang telah disediakan:
```bash
# Lihat versi saat ini:
python scripts/release.py show

# Naikkan versi PATCH (1.0.0 -> 1.0.1) & buat tag git:
python scripts/release.py patch

# Atau naikkan versi MINOR (1.0.0 -> 1.1.0):
python scripts/release.py minor

# Atau naikkan versi MAJOR (1.0.0 -> 2.0.0):
python scripts/release.py major

# Kirim branch dan tag rilis ke GitHub (ini otomatis memicu GitHub Release):
git push origin main --tags
```
> 💡 *Atau tambahkan argumen `--push` untuk langsung push otomatis: `python scripts/release.py patch --push`*

### 2. Cara Membuat Rilis Langsung dari Web GitHub (Tanpa Terminal):
1. Buka tab **Actions** di repositori GitHub Anda.
2. Pilih workflow **Automated GitHub Release** di menu sebelah kiri.
3. Klik tombol **Run workflow**.
4. Pilih tingkat kenaikan versi (`patch`, `minor`, atau `major`), lalu klik **Run workflow**.
5. GitHub Actions akan otomatis menaikkan versi, membuat commit rilis, membuat tag, dan mempublikasikan **GitHub Release** lengkap dengan *release notes*!

---

## 🚀 Fitur Otomatisasi Perubahan (Changelog)
README ini secara otomatis mencatat setiap perubahan kode (commit) yang dilakukan, baik:
1. **Secara Lokal (Git Hook):** Berjalan otomatis sebelum perintah `git push` dijalankan.
2. **Di GitHub (GitHub Actions):** Berjalan otomatis setiap kali ada perubahan yang di-push ke branch `main`.

---

## 📝 Riwayat Perubahan (Changelog Otomatis)

<!-- CHANGELOG:START -->
| Tanggal | Commit | Penulis | Deskripsi Perubahan |
| :--- | :--- | :--- | :--- |
| 2026-11-02 | [`1d3fb57`](https://github.com/mitracreativeenvironment-oss/bahanku/commit/1d3fb57bdba109469e56a561bbadabb21177dd52) | gelon2 | feat(3d): implementasi landing page Schroling Horizontal 3D dan dashboard manajemen dengan Vue 3 & Three.js |
| 2026-11-02 | [`be6898f`](https://github.com/mitracreativeenvironment-oss/bahanku/commit/be6898fa29c74fb356d9a9818f79d0d7333b4d70) | gelon2 | feat: tambahkan direktori 3d untuk penyimpanan aset dan model 3D |
| 2026-11-02 | [`7132eb4`](https://github.com/mitracreativeenvironment-oss/bahanku/commit/7132eb4a324f0276011c902360f52f3f6ed5489b) | gelon2 | feat: sertakan tabel changelog langsung ke dalam deskripsi GitHub Release |
| 2026-11-02 | [`dca09bc`](https://github.com/mitracreativeenvironment-oss/bahanku/commit/dca09bc31b985dcf58f9ed2e7800983096e2d57b) | gelon2 | fix: pastikan kompatibilitas UTF-8 terminal Windows pada script release dan changelog |
| 2026-11-02 | [`bea50b2`](https://github.com/mitracreativeenvironment-oss/bahanku/commit/bea50b2edd5f72452117ac6d19cfca8624e4cf40) | gelon2 | feat: tambahkan sistem versi SemVer dan otomatisasi rilis GitHub |
| 2026-11-02 | [`9c794c7`](https://github.com/mitracreativeenvironment-oss/bahanku/commit/9c794c7fc6f79dba38269af632e1710a8b304582) | gelon2 | feat: inisialisasi repositori dan sistem otomatisasi changelog README.md |
<!-- CHANGELOG:END -->

---

## ⚙️ Panduan Penggunaan Hook Lokal
Untuk memastikan changelog otomatis diperbarui sebelum push:
```bash
# Aktifkan hooks repository (cukup sekali):
git config core.hooksPath .githooks

# Atau jalankan script manual jika diperlukan:
python scripts/update_readme_changelog.py
```
