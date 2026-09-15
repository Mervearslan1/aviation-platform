"""Generate V11 aircraft + parts SQL from cockpit JSON datasets."""
import json
from pathlib import Path

ROOT = Path(r"C:\Users\merve.arslan\IdeaProjects\aviation-platform")
DATA = ROOT / "src/main/resources/data/aircraft"
OUT = ROOT / "src/main/resources/db/migration/V11__aircraft_cockpit.sql"

AIRCRAFT = [
    ("B737", "Boeing 737 NG/MAX", "BOEING", "b737.json", 1),
    ("A350", "Airbus A350-900/-1000", "AIRBUS", "a350.json", 2),
    ("C172", "Cessna 172 Skyhawk", "CESSNA", "c172.json", 3),
]


def esc(s: str) -> str:
    return s.replace("'", "''")


def main() -> None:
    lines = [
        "CREATE TABLE aircraft (",
        "    id              BIGSERIAL PRIMARY KEY,",
        "    code            VARCHAR(16) NOT NULL,",
        "    name            VARCHAR(120) NOT NULL,",
        "    manufacturer    VARCHAR(40) NOT NULL,",
        "    philosophy      TEXT,",
        "    sort_index      INTEGER NOT NULL DEFAULT 0,",
        "    CONSTRAINT uk_aircraft_code UNIQUE (code)",
        ");",
        "",
        "CREATE TABLE cockpit_parts (",
        "    id              BIGSERIAL PRIMARY KEY,",
        "    aircraft_id     BIGINT NOT NULL REFERENCES aircraft (id) ON DELETE CASCADE,",
        "    code            VARCHAR(32) NOT NULL,",
        "    panel           VARCHAR(80) NOT NULL,",
        "    name_en         VARCHAR(200) NOT NULL,",
        "    name_tr         VARCHAR(200) NOT NULL,",
        "    location        VARCHAR(240) NOT NULL,",
        "    function_tr     TEXT NOT NULL,",
        "    category        VARCHAR(64) NOT NULL,",
        "    sort_index      INTEGER NOT NULL DEFAULT 0,",
        "    CONSTRAINT uk_cockpit_parts_code UNIQUE (code)",
        ");",
        "CREATE INDEX idx_cockpit_parts_aircraft ON cockpit_parts (aircraft_id);",
        "CREATE INDEX idx_cockpit_parts_panel ON cockpit_parts (aircraft_id, panel);",
        "",
        "CREATE TABLE user_part_progress (",
        "    id              BIGSERIAL PRIMARY KEY,",
        "    user_id         BIGINT NOT NULL REFERENCES users (id),",
        "    part_id         BIGINT NOT NULL REFERENCES cockpit_parts (id) ON DELETE CASCADE,",
        "    status          VARCHAR(20) NOT NULL,",
        "    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),",
        "    CONSTRAINT uk_user_part_progress UNIQUE (user_id, part_id),",
        "    CONSTRAINT ck_user_part_progress_status CHECK (status IN ('LEARNED'))",
        ");",
        "",
        "CREATE TABLE training_simulations (",
        "    id              BIGSERIAL PRIMARY KEY,",
        "    aircraft_id     BIGINT NOT NULL REFERENCES aircraft (id) ON DELETE CASCADE,",
        "    code            VARCHAR(40) NOT NULL,",
        "    title           VARCHAR(200) NOT NULL,",
        "    description     TEXT NOT NULL,",
        "    sim_type        VARCHAR(24) NOT NULL,",
        "    config          JSONB NOT NULL,",
        "    CONSTRAINT uk_training_simulations_code UNIQUE (code),",
        "    CONSTRAINT ck_training_simulations_type CHECK (sim_type IN ('TUTORIAL','SHORT_FLIGHT','FAILURE','CRASH_DRILL'))",
        ");",
        "",
        "CREATE TABLE simulation_sessions (",
        "    id              BIGSERIAL PRIMARY KEY,",
        "    user_id         BIGINT NOT NULL REFERENCES users (id),",
        "    simulation_id   BIGINT NOT NULL REFERENCES training_simulations (id),",
        "    status          VARCHAR(20) NOT NULL,",
        "    state           JSONB NOT NULL,",
        "    last_message    TEXT,",
        "    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),",
        "    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),",
        "    CONSTRAINT ck_simulation_sessions_status CHECK (status IN ('IN_PROGRESS','PASSED','CRASHED','FAILED'))",
        ");",
        "",
    ]

    for code, name, mfr, filename, sort in AIRCRAFT:
        data = json.loads((DATA / filename).read_text(encoding="utf-8"))
        phil = esc(data.get("control_philosophy", ""))
        lines.append(
            f"INSERT INTO aircraft (code, name, manufacturer, philosophy, sort_index) "
            f"VALUES ('{code}', '{esc(name)}', '{mfr}', '{phil}', {sort});"
        )
        lines.append("")
        for i, part in enumerate(data["parts"]):
            lines.append(
                "INSERT INTO cockpit_parts (aircraft_id, code, panel, name_en, name_tr, location, function_tr, category, sort_index) "
                f"SELECT id, '{esc(part['id'])}', '{esc(part['panel'])}', '{esc(part['part_name_en'])}', "
                f"'{esc(part['part_name_tr'])}', '{esc(part['location'])}', '{esc(part['function_tr'])}', "
                f"'{esc(part['category'])}', {i} FROM aircraft WHERE code = '{code}';"
            )
        lines.append("")

    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("wrote", OUT, "parts", sum(len(json.loads((DATA / f).read_text(encoding="utf-8"))["parts"]) for *_, f, _ in AIRCRAFT))


if __name__ == "__main__":
    main()
