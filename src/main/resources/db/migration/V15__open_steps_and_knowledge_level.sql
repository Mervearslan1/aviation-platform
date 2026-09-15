-- Adımlar kilitli değil: bakılabilir, sıra öneridir. Bilgi seviyesi kullanıcı + adım + uçakta görünür.

ALTER TABLE users ADD COLUMN IF NOT EXISTS knowledge_level VARCHAR(20) NOT NULL DEFAULT 'BEGINNER';
ALTER TABLE users DROP CONSTRAINT IF EXISTS ck_users_knowledge_level;
ALTER TABLE users ADD CONSTRAINT ck_users_knowledge_level
    CHECK (knowledge_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED'));

ALTER TABLE learning_steps ADD COLUMN IF NOT EXISTS knowledge_level VARCHAR(20) NOT NULL DEFAULT 'BEGINNER';
ALTER TABLE learning_steps DROP CONSTRAINT IF EXISTS ck_learning_steps_knowledge_level;
ALTER TABLE learning_steps ADD CONSTRAINT ck_learning_steps_knowledge_level
    CHECK (knowledge_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED'));

ALTER TABLE learning_paths ADD COLUMN IF NOT EXISTS related_aircraft VARCHAR(120);

ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS difficulty VARCHAR(20) NOT NULL DEFAULT 'BEGINNER';
ALTER TABLE aircraft DROP CONSTRAINT IF EXISTS ck_aircraft_difficulty;
ALTER TABLE aircraft ADD CONSTRAINT ck_aircraft_difficulty
    CHECK (difficulty IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED'));

UPDATE user_step_progress SET status = 'AVAILABLE' WHERE status = 'LOCKED';

UPDATE learning_steps s
SET knowledge_level = CASE
    WHEN s.order_index <= 2 THEN 'BEGINNER'
    WHEN s.order_index <= 5 THEN 'INTERMEDIATE'
    ELSE 'ADVANCED'
END
FROM learning_paths p
WHERE s.path_id = p.id AND p.track = 'TOWER';

UPDATE learning_steps s
SET knowledge_level = CASE
    WHEN s.order_index <= 3 THEN 'BEGINNER'
    WHEN s.order_index <= 7 THEN 'INTERMEDIATE'
    ELSE 'ADVANCED'
END
FROM learning_paths p
WHERE s.path_id = p.id AND p.track = 'PILOT';

UPDATE learning_paths SET related_aircraft = 'C172' WHERE track = 'TOWER' AND (related_aircraft IS NULL OR related_aircraft = '');
UPDATE learning_paths SET related_aircraft = 'C172,B737,A350' WHERE track = 'PILOT' AND (related_aircraft IS NULL OR related_aircraft = '');

UPDATE aircraft SET difficulty = 'BEGINNER' WHERE code = 'C172';
UPDATE aircraft SET difficulty = 'INTERMEDIATE' WHERE code = 'B737';
UPDATE aircraft SET difficulty = 'ADVANCED' WHERE code = 'A350';

INSERT INTO cockpit_parts (aircraft_id, code, panel, name_en, name_tr, location, function_tr, category, variant, sort_index)
SELECT id, 'C172-041', 'Switch Panel', 'Beacon / Nav / Strobe / Landing / Taxi Lights', 'Dış Işıklar',
       'Sol alt şalter sırası', 'Beacon motor çalışırken, strobe uçuşta, landing/taxi iniş ve takside.',
       'Lighting', 'Both', 40 FROM aircraft WHERE code = 'C172'
AND NOT EXISTS (SELECT 1 FROM cockpit_parts WHERE code = 'C172-041');

INSERT INTO cockpit_parts (aircraft_id, code, panel, name_en, name_tr, location, function_tr, category, variant, sort_index)
SELECT id, 'C172-042', 'Switch Panel', 'Pitot Heat', 'Pitot Isıtma',
       'Sol şalterler', 'Hava hızı hortumunu buzdan korur. IMC ve görünür nemde ON.',
       'Anti-Ice', 'Both', 41 FROM aircraft WHERE code = 'C172'
AND NOT EXISTS (SELECT 1 FROM cockpit_parts WHERE code = 'C172-042');

INSERT INTO training_simulations (aircraft_id, code, title, description, sim_type, config)
SELECT id, 'C172-BEFORE-TAKEOFF', 'C172 kalkış öncesi checklist',
       'Yakıt, yağ, flap, trim, park freni, ışık. Sıra önerilir; atlamak checklist kaçırmaktır.',
       'TUTORIAL',
       $json$
{
  "controls": {"C172-037":"ON","C172-020":"0","C172-041":"OFF","C172-042":"OFF"},
  "flight": {"phase":"PARKED","ias":0,"altitude":0,"pitch":0,"roll":0,"vs":0,"heading":270,"gear":"FIXED","onGround":true,"n1":18},
  "expected": [
    {"part":"C172-013","value":"CHECK","hint":"Yakıt miktarını görsel kontrol et.","flight":{"phase":"PARKED"}},
    {"part":"C172-011","value":"CHECK","hint":"Yağ basıncı yeşil yayda mı?","flight":{"phase":"PARKED"}},
    {"part":"C172-020","value":"10","hint":"Kalkış flap 10.","flight":{"phase":"LINEUP"}},
    {"part":"C172-021","value":"TAKEOFF","hint":"Trim kalkış konumuna.","flight":{"phase":"LINEUP"}},
    {"part":"C172-041","value":"ON","hint":"Landing/taxi ışıkları ON.","flight":{"phase":"LINEUP"}},
    {"part":"C172-042","value":"ON","hint":"Pitot heat, özellikle nemde ON.","flight":{"phase":"LINEUP"}},
    {"part":"C172-037","value":"OFF","hint":"Park frenini bırak, taksiye hazır.","flight":{"phase":"TAXI","ias":10,"n1":28}}
  ],
  "crash": [
    {"when":{"C172-037":"ON","C172-016":"FULL"},"message":"Park freni açık, tam gaz. Lastik — CRASH.","flight":{"phase":"CRASHED","onGround":true,"n1":100}}
  ]
}$json$::jsonb
FROM aircraft WHERE code = 'C172'
AND NOT EXISTS (SELECT 1 FROM training_simulations WHERE code = 'C172-BEFORE-TAKEOFF');
