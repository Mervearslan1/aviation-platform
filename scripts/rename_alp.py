"""Rename alp identifiers to aviation-platform. Does not touch postgres:16-alpine."""
from pathlib import Path

ROOT = Path(r"C:\Users\merve.arslan\IdeaProjects\aviation-learning-platform")

TEXT_EXTS = {".java", ".yml", ".yaml", ".xml", ".md", ".html", ".sql", ".properties", ".gitignore"}

REPLACEMENTS = [
    ("com.alp", "com.aviation.platform"),
    ("AlpProperties", "AviationProperties"),
    ("admin@alp.local", "admin@aviation-platform.local"),
    ("admin@alp.test", "admin@aviation-platform.test"),
    ("ALP_DB_URL", "AVIATION_DB_URL"),
    ("ALP_DB_USERNAME", "AVIATION_DB_USERNAME"),
    ("ALP_DB_PASSWORD", "AVIATION_DB_PASSWORD"),
    ("ALP_JWT_SECRET", "AVIATION_JWT_SECRET"),
    ("ALP_ADMIN_EMAIL", "AVIATION_ADMIN_EMAIL"),
    ("ALP_ADMIN_PASSWORD", "AVIATION_ADMIN_PASSWORD"),
    ("ALP_ADMIN_USERNAME", "AVIATION_ADMIN_USERNAME"),
    ("ALP_MEDIA_DIR", "AVIATION_MEDIA_DIR"),
    ("alpToken", "aviationToken"),
    ("alp-postgres-data", "aviation-platform-postgres-data"),
]


def rewrite_text(text: str) -> str:
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    return text


def main() -> None:
    for path in ROOT.rglob("*"):
        if not path.is_file():
            continue
        if "target" in path.parts or ".git" in path.parts or ".idea" in path.parts:
            continue
        if path.suffix.lower() not in TEXT_EXTS and path.name not in {"Dockerfile"}:
            continue
        if path.name == "rename_alp.py":
            continue
        raw = path.read_text(encoding="utf-8")
        updated = rewrite_text(raw)
        # yaml prefix `alp:` at line start / after newline
        updated = updated.replace("\nalp:\n", "\naviation:\n")
        if updated.startswith("alp:\n"):
            updated = "aviation:\n" + updated[4:]
        # docker credentials, not alpine
        if path.name == "docker-compose.yml":
            updated = updated.replace("POSTGRES_DB: alp", "POSTGRES_DB: aviation")
            updated = updated.replace("POSTGRES_USER: alp", "POSTGRES_USER: aviation")
            updated = updated.replace("POSTGRES_PASSWORD: alp", "POSTGRES_PASSWORD: aviation")
            updated = updated.replace("pg_isready -U alp -d alp", "pg_isready -U aviation -d aviation")
        if path.name == "application.yml" and "src/main/resources" in str(path).replace("\\", "/"):
            updated = updated.replace("jdbc:postgresql://localhost:5433/alp", "jdbc:postgresql://localhost:5433/aviation")
            updated = updated.replace("${AVIATION_DB_USERNAME:alp}", "${AVIATION_DB_USERNAME:aviation}")
            updated = updated.replace("${AVIATION_DB_PASSWORD:alp}", "${AVIATION_DB_PASSWORD:aviation}")
        if path.suffix == ".java":
            updated = updated.replace('@ConfigurationProperties(prefix = "alp")', '@ConfigurationProperties(prefix = "aviation")')
        if updated != raw:
            path.write_text(updated, encoding="utf-8")
            print("updated", path.relative_to(ROOT))

    src_roots = [
        ROOT / "src/main/java/com/alp",
        ROOT / "src/test/java/com/alp",
    ]
    for old_root in src_roots:
        if not old_root.exists():
            continue
        new_root = old_root.parent / "aviation" / "platform"
        new_root.parent.mkdir(parents=True, exist_ok=True)
        if new_root.exists():
            raise SystemExit(f"already exists: {new_root}")
        old_root.rename(new_root)
        print("moved", old_root, "->", new_root)
        # remove empty com/ if possible
        try:
            old_root.parent.rmdir()
        except OSError:
            pass


if __name__ == "__main__":
    main()
