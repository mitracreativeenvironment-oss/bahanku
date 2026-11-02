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
