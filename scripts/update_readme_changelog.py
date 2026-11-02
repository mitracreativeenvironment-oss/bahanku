#!/usr/bin/env python3
"""
Script untuk memperbarui tabel riwayat perubahan (changelog) pada README.md secara otomatis
berdasarkan riwayat commit Git.
"""

import os
import re
import subprocess
import sys

# Memastikan output konsol selalu mendukung UTF-8 di Windows
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")
    sys.stderr.reconfigure(encoding="utf-8")

README_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "README.md"))
REPO_BASE_URL = "https://github.com/mitracreativeenvironment-oss/bahanku"

START_MARKER = "<!-- CHANGELOG:START -->"
END_MARKER = "<!-- CHANGELOG:END -->"


def get_git_commits():
    """Mengambil daftar commit dari git log."""
    try:
        # Format: hash|short_hash|date|author|subject
        cmd = ["git", "log", "--pretty=format:%H|%h|%ad|%an|%s", "--date=short", "-n", "30"]
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        lines = result.stdout.strip().splitlines()
        commits = []
        for line in lines:
            if not line.strip():
                continue
            parts = line.split("|", 4)
            if len(parts) == 5:
                full_hash, short_hash, date_str, author, subject = parts
                # Lewati commit otomatis pembaruan changelog untuk menghindari perulangan
                if "[skip ci]" in subject.lower() or "auto-update changelog" in subject.lower():
                    continue
                commits.append({
                    "full_hash": full_hash,
                    "short_hash": short_hash,
                    "date": date_str,
                    "author": author,
                    "subject": subject
                })
        return commits
    except subprocess.CalledProcessError:
        return []
    except Exception as e:
        print(f"Error reading git log: {e}", file=sys.stderr)
        return []


def generate_changelog_table(commits):
    """Menghasilkan teks tabel markdown dari daftar commit."""
    if not commits:
        return "*Belum ada riwayat perubahan yang dicatat.*"

    table_lines = [
        "| Tanggal | Commit | Penulis | Deskripsi Perubahan |",
        "| :--- | :--- | :--- | :--- |"
    ]

    for c in commits:
        commit_link = f"[`{c['short_hash']}`]({REPO_BASE_URL}/commit/{c['full_hash']})"
        # Sanitasi karakter pipe (|) pada deskripsi commit agar tabel markdown tidak rusak
        safe_subject = c['subject'].replace("|", "\\|")
        table_lines.append(f"| {c['date']} | {commit_link} | {c['author']} | {safe_subject} |")

    return "\n".join(table_lines)


def update_readme():
    """Memperbarui section changelog di README.md."""
    if not os.path.exists(README_PATH):
        print(f"README.md tidak ditemukan di: {README_PATH}", file=sys.stderr)
        sys.exit(1)

    with open(README_PATH, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = re.compile(
        rf"({re.escape(START_MARKER)})(.*?)({re.escape(END_MARKER)})",
        re.DOTALL
    )

    if not pattern.search(content):
        print(f"Penanda {START_MARKER} dan {END_MARKER} tidak ditemukan di README.md", file=sys.stderr)
        sys.exit(1)

    commits = get_git_commits()
    table_content = generate_changelog_table(commits)
    new_section = f"{START_MARKER}\n{table_content}\n{END_MARKER}"

    updated_content = pattern.sub(new_section, content)

    if updated_content != content:
        with open(README_PATH, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print("README.md berhasil diperbarui dengan perubahan terbaru.")
        return True
    else:
        print("README.md sudah yang paling mutakhir (tidak ada perubahan baru).")
        return False


if __name__ == "__main__":
    update_readme()
