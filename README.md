# 📦 Bahanku

Repositori proyek **Bahanku**.

---

## 📌 Deskripsi Proyek
Repositori ini digunakan untuk pengelolaan dan penyimpanan berkas/kode proyek **Bahanku**. Proyek ini dilengkapi dengan sistem pencatatan riwayat perubahan (changelog) secara otomatis pada berkas `README.md`.

---

## 🚀 Fitur Otomatisasi Perubahan
README ini secara otomatis mencatat setiap perubahan kode (commit) yang dilakukan, baik:
1. **Secara Lokal (Git Hook):** Berjalan otomatis sebelum perintah `git push` dijalankan.
2. **Di GitHub (GitHub Actions):** Berjalan otomatis setiap kali ada perubahan yang di-push ke branch `main`.

---

## 📝 Riwayat Perubahan (Changelog Otomatis)

<!-- CHANGELOG:START -->
| Tanggal | Commit | Penulis | Deskripsi Perubahan |
| :--- | :--- | :--- | :--- |
| 2026-11-02 | [`ff549a4`](https://github.com/mitracreativeenvironment-oss/bahanku/commit/ff549a464e27678096b797cda19da64e62ff4149) | gelon2 | feat: inisialisasi repositori dan sistem otomatisasi changelog README.md |
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
