import json
from pathlib import Path

ROOT = Path(r"C:\Users\merve.arslan\IdeaProjects\aviation-platform")
src = ROOT / "src/main/resources/data/aircraft/c172.json"
out = ROOT / "src/main/resources/db/migration/V14__c172_user_dataset.sql"
data = json.loads(src.read_text(encoding="utf-8"))


def esc(s: str) -> str:
    return s.replace("'", "''")


lines = [
    "-- Cessna 172: kullanici dataseti (Classic + G1000), 40 parca.",
    "-- Eski C172 parca kodlari degisti; soğuk start ve kisa ucus config guncellenir.",
    "",
    "ALTER TABLE cockpit_parts ADD COLUMN IF NOT EXISTS variant VARCHAR(16) NOT NULL DEFAULT 'Both';",
    "ALTER TABLE cockpit_parts DROP CONSTRAINT IF EXISTS ck_cockpit_parts_variant;",
    "ALTER TABLE cockpit_parts ADD CONSTRAINT ck_cockpit_parts_variant CHECK (variant IN ('Classic','G1000','Both'));",
    "",
    "UPDATE aircraft SET name = 'Cessna 172 Skyhawk (Classic / G1000)',"
    f" philosophy = '{esc(data['control_philosophy'])}' WHERE code = 'C172';",
    "",
    "DELETE FROM user_part_progress WHERE part_id IN (SELECT id FROM cockpit_parts WHERE code LIKE 'C172-%');",
    "DELETE FROM cockpit_parts WHERE code LIKE 'C172-%';",
    "",
]

for i, part in enumerate(data["parts"]):
    lines.append(
        "INSERT INTO cockpit_parts (aircraft_id, code, panel, name_en, name_tr, location, function_tr, category, variant, sort_index) "
        f"SELECT id, '{esc(part['id'])}', '{esc(part['panel'])}', '{esc(part['part_name_en'])}', "
        f"'{esc(part['part_name_tr'])}', '{esc(part['location'])}', '{esc(part['function_tr'])}', "
        f"'{esc(part['category'])}', '{esc(part.get('variant') or 'Both')}', {i} FROM aircraft WHERE code = 'C172';"
    )

lines += [
    "",
    "UPDATE training_simulations",
    "SET description = 'Eğitim uçağı: master, yakıt, karışım, primer, magneto. Yanlış sıra motoru öldürür veya kazaya götürür.',",
    "    config = $json${",
    '  "controls": {"C172-037":"ON","C172-017":"CUTOFF","C172-018":"OFF","C172-034":"OFF"},',
    '  "flight": {"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":270,"gear":"FIXED","onGround":true,"n1":0},',
    '  "expected": [',
    '    {"part":"C172-033","value":"ON","hint":"Önce Master BAT/ALT aç.","flight":{"n1":0}},',
    '    {"part":"C172-019","value":"BOTH","hint":"Yakıt seçici BOTH."},',
    '    {"part":"C172-017","value":"RICH","hint":"Karışım tam zengin (ileri)."},',
    '    {"part":"C172-018","value":"OFF","hint":"Karbüratör ısı şimdilik OFF."},',
    '    {"part":"C172-035","value":"IN","hint":"Soğuk motorda primer (Classic)."},',
    '    {"part":"C172-034","value":"BOTH","hint":"Magneto BOTH, sonra START.","flight":{"n1":22}}',
    "  ],",
    '  "crash": [',
    '    {"when":{"C172-037":"ON","C172-016":"FULL"},"message":"Park freni açıkken tam gaz. Lastik dumanı — CRASH.","flight":{"phase":"CRASHED","ias":0,"altitude":0,"pitch":0,"onGround":true,"n1":100}},',
    '    {"when":{"C172-017":"CUTOFF","C172-034":"BOTH"},"message":"Karışım IDLE CUT-OFF iken magneto BOTH. Motor ölür.","flight":{"phase":"CRASHED","n1":0,"onGround":true}}',
    "  ]",
    "}$json$::jsonb",
    "WHERE code = 'C172-COLD-START';",
    "",
    "UPDATE training_simulations",
    "SET description = 'Park freni, taksi, flap, tam gaz, rotate, tırmanış, final, flare. Yanlış flap/hızda stall.',",
    "    config = $json${",
    '  "controls": {"C172-037":"ON","C172-020":"0","C172-016":"IDLE"},',
    '  "flight": {"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":270,"gear":"FIXED","onGround":true,"n1":18},',
    '  "expected": [',
    '    {"part":"C172-037","value":"OFF","hint":"Park frenini bırak, taksiye hazır ol.","flight":{"phase":"TAXI","ias":12,"n1":28,"heading":280}},',
    '    {"part":"C172-024","value":"CENTER","hint":"Taksi: dümen ile merkeze al, hold short cizgisine ilerle.","flight":{"phase":"TAXI","ias":14,"heading":270}},',
    '    {"part":"C172-020","value":"10","hint":"Pist hizasında kalkış flap 10.","flight":{"phase":"LINEUP","ias":0,"n1":22,"heading":270}},',
    '    {"part":"C172-016","value":"FULL","hint":"Tam gaz — kalkış koşusu, hız artsın.","flight":{"phase":"TAKEOFF_ROLL","ias":55,"n1":100,"heading":270}},',
    '    {"part":"C172-022","value":"BACK","hint":"Vr: yoke hafif geri — rotate.","flight":{"phase":"ROTATE","ias":60,"altitude":15,"pitch":8,"onGround":false,"vs":400,"n1":100}},',
    '    {"part":"C172-020","value":"0","hint":"Pozitif tırmanışta flap yukarı.","flight":{"phase":"CLIMB","ias":75,"altitude":800,"pitch":7,"vs":700,"n1":90}},',
    '    {"part":"C172-020","value":"20","hint":"Final: flap 20, hızı düşür.","flight":{"phase":"APPROACH","ias":70,"altitude":400,"pitch":2,"vs":-450,"n1":45,"heading":270}},',
    '    {"part":"C172-016","value":"IDLE","hint":"Yere yakın gaz kes, flare.","flight":{"phase":"FLARE","ias":52,"altitude":15,"pitch":6,"vs":-150,"n1":18}},',
    '    {"part":"C172-022","value":"HOLD","hint":"Burun yukarı tut, teker koy, iniş.","flight":{"phase":"LANDING","ias":0,"altitude":0,"pitch":2,"vs":0,"onGround":true,"n1":18}}',
    "  ],",
    '  "crash": [',
    '    {"when":{"C172-016":"IDLE","C172-020":"0"},"message":"Finalde flapsız ve gaz kesik. Stall — uçak düştü.","flight":{"phase":"CRASHED","ias":40,"altitude":80,"pitch":-22,"roll":-18,"vs":-1800,"onGround":false,"n1":18}},',
    '    {"when":{"C172-037":"ON","C172-016":"FULL"},"message":"Park freni açıkken tam gaz. Lastik dumanı — CRASH.","flight":{"phase":"CRASHED","ias":0,"altitude":0,"pitch":0,"onGround":true,"n1":100}}',
    "  ]",
    "}$json$::jsonb",
    "WHERE code = 'C172-SHORT-CIRCUIT';",
    "",
]

out.write_text("\n".join(lines), encoding="utf-8")
print(f"wrote {out} ({len(lines)} lines, {len(data['parts'])} parts)")
