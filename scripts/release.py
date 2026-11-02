#!/usr/bin/env python3
"""
Sistem Manajemen Versi & Rilis Otomatis (Semantic Versioning)
Mendukung kenaikan versi patch, minor, major, atau versi kustom,
memperbarui berkas versi, README, changelog, membuat commit rilis, dan git tag.
"""

import argparse
import datetime
import json
import os
import re
import subprocess
import sys

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
VERSION_FILE = os.path.join(BASE_DIR, "VERSION")
VERSION_JSON = os.path.join(BASE_DIR, "version.json")
README_FILE = os.path.join(BASE_DIR, "README.md")
CHANGELOG_SCRIPT = os.path.join(BASE_DIR, "scripts", "update_readme_changelog.py")


def read_current_version():
    """Membaca versi saat ini dari file VERSION."""
    if os.path.exists(VERSION_FILE):
        with open(VERSION_FILE, "r", encoding="utf-8") as f:
            v = f.read().strip()
            if v.startswith("v"):
                v = v[1:]
            return v
    return "1.0.0"


def parse_semver(version_str):
    """Memvalidasi dan memisahkan string semantic versioning (MAJOR.MINOR.PATCH)."""
    match = re.match(r"^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$", version_str)
    if not match:
        raise ValueError(f"Format versi tidak valid: '{version_str}'. Gunakan format SemVer (misal: 1.0.0)")
    major, minor, patch = int(match.group(1)), int(match.group(2)), int(match.group(3))
    prerelease = match.group(4)
    return major, minor, patch, prerelease


def calculate_next_version(current_ver, bump_type):
    """Menghitung versi berikutnya berdasarkan jenis bump (patch, minor, major) atau versi baru."""
    major, minor, patch, _ = parse_semver(current_ver)

    bump_lower = bump_type.lower()
    if bump_lower == "patch":
        return f"{major}.{minor}.{patch + 1}"
    elif bump_lower == "minor":
        return f"{major}.{minor + 1}.0"
    elif bump_lower == "major":
        return f"{major + 1}.0.0"
    else:
        # Asumsikan input adalah versi kustom spesifik (misal: 2.1.0)
        custom_v = bump_type[1:] if bump_type.startswith("v") else bump_type
        parse_semver(custom_v)  # validasi
        return custom_v


def update_version_files(new_version):
    """Menulis versi baru ke VERSION dan version.json."""
    today = datetime.date.today().isoformat()

    # 1. Update VERSION
    with open(VERSION_FILE, "w", encoding="utf-8") as f:
        f.write(f"{new_version}\n")

    # 2. Update version.json
    metadata = {
        "version": new_version,
        "updated_at": today,
        "channel": "stable"
    }
    with open(VERSION_JSON, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    # 3. Update README.md (badge versi jika ada)
    if os.path.exists(README_FILE):
        with open(README_FILE, "r", encoding="utf-8") as f:
            content = f.read()

        # Update teks badge versi atau indikator versi jika ada
        pattern = re.compile(r"(\!\[Versi\]\(https:\/\/img\.shields\.io\/badge\/version-v)([0-9A-Za-z.-]+)(-[^)]+\))")
        if pattern.search(content):
            content = pattern.sub(rf"\g<1>{new_version}\g<3>", content)
            with open(README_FILE, "w", encoding="utf-8") as f:
                f.write(content)


def run_command(cmd, check=True):
    """Menjalankan perintah shell di direktori proyek."""
    result = subprocess.run(cmd, cwd=BASE_DIR, capture_output=True, text=True)
    if check and result.returncode != 0:
        print(f"Error executing command: {' '.join(cmd)}\n{result.stderr}", file=sys.stderr)
        sys.exit(result.returncode)
    return result


def main():
    parser = argparse.ArgumentParser(description="Otomatisasi Versi & Rilis Bahanku")
    parser.add_argument(
        "action",
        nargs="?",
        default="show",
        help="Aksi: show (lihat versi), patch, minor, major, atau versi spesifik (misal: 1.2.0)"
    )
    parser.add_argument("--push", action="store_true", help="Otomatis push commit dan tag ke remote origin")
    parser.add_argument("--dry-run", action="store_true", help="Hanya simulasikan tanpa mengubah git atau file")
    parser.add_argument("--ci", action="store_true", help="Mode otomatis non-interaktif untuk CI/CD")

    args = parser.parse_args()

    current_ver = read_current_version()

    if args.action in ["show", "current", "status"]:
        print(f"Versi saat ini: v{current_ver}")
        return

    next_ver = calculate_next_version(current_ver, args.action)
    tag_name = f"v{next_ver}"

    print(f"🚀 Mempersiapkan Rilis:")
    print(f"   Versi saat ini : v{current_ver}")
    print(f"   Versi baru     : v{next_ver} (Tag: {tag_name})")

    if args.dry_run:
        print("🔍 [Dry Run] Tidak ada perubahan yang ditulis.")
        return

    # Perbarui berkas versi
    update_version_files(next_ver)
    print("✅ Berkas VERSION dan version.json berhasil diperbarui.")

    # Sinkronisasi changelog pada README.md jika script ada
    if os.path.exists(CHANGELOG_SCRIPT):
        subprocess.run([sys.executable, CHANGELOG_SCRIPT], cwd=BASE_DIR)

    # Git commit dan git tag
    run_command(["git", "add", "VERSION", "version.json", "README.md"])
    commit_msg = f"chore(release): bump version to {tag_name}"
    run_command(["git", "commit", "-m", commit_msg])
    print(f"✅ Git commit dibuat: '{commit_msg}'")

    # Buat git tag
    tag_msg = f"Release {tag_name}"
    run_command(["git", "tag", "-a", tag_name, "-m", tag_msg])
    print(f"✅ Git tag dibuat: {tag_name}")

    if args.push:
        print(f"📤 Mendorong branch main dan tag {tag_name} ke origin...")
        run_command(["git", "push", "origin", "main"])
        run_command(["git", "push", "origin", tag_name])
        print("🎉 Rilis berhasil di-push ke GitHub!")
    else:
        print("\n✨ Untuk mempublikasikan rilis ke GitHub, jalankan:")
        print(f"   git push origin main && git push origin {tag_name}")


if __name__ == "__main__":
    main()
