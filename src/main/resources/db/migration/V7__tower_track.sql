ALTER TABLE learning_paths
    ADD COLUMN track VARCHAR(20) NOT NULL DEFAULT 'TOWER';

ALTER TABLE learning_paths
    ADD CONSTRAINT ck_learning_paths_track CHECK (track IN ('TOWER', 'PILOT'));

ALTER TABLE learning_steps DROP CONSTRAINT ck_learning_steps_type;
ALTER TABLE learning_steps
    ADD CONSTRAINT ck_learning_steps_type CHECK (step_type IN (
        'CONTENT', 'PRACTICE', 'SIMULATION', 'LISTEN', 'SPEAK', 'SCENARIO', 'LIVE_PRACTICE'
    ));

UPDATE learning_paths SET track = 'PILOT', status = 'ARCHIVED' WHERE slug = 'temel-havacilik';

INSERT INTO learning_paths (title, slug, description, difficulty, status, track) VALUES
    (
        'Kule ol',
        'kule-ol',
        'Duolingo gibi: dinle, konuş, senaryoya cevap ver. Sertifika izle değil; kule gibi etkileşime gir. Canlı pratik için IVAO yönlendirmesi var. Pilot hattı sonra gelir.',
        'BEGINNER',
        'PUBLISHED',
        'TOWER'
    );

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: ilk çağrı', 'dinle-ilk-cagri', 'Uçak kuleyi arıyor. Dinle, doğru cevabı seç.',
       'LISTEN',
       '<p>Kulaklık tak. Çağrıyı dinle. Sen kulesin.</p>',
       '{"promptText":"Istanbul Ground, Turkish 123, stand 12, request push and start","question":"Uçak ne istiyor?","options":["Push and start","Landing clearance","Taxi to gate"],"correctOption":"Push and start"}'::jsonb,
       0, TRUE, 'PUBLISHED'
FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: kule cevabı', 'konus-kule-cevabi', 'Kule gibi sesli cevap ver.',
       'SPEAK',
       '<p>Mikrofonu aç. Kule phrasingi ile cevapla. Beklenen anahtar: Turkish 123, push and start approved.</p>',
       '{"promptText":"Uçak: Istanbul Ground, Turkish 123, stand 12, request push and start. Sen kulesin. Cevapla.","expectedPhrase":"Turkish 123 push and start approved","acceptedPhrases":["turkish 123 push start approved","thy 123 push and start approved"]}'::jsonb,
       1, TRUE, 'PUBLISHED'
FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: iniş', 'senaryo-inis', 'Acil değil, standart iniş isteği. Kule kararını seç.',
       'SCENARIO',
       '<p>Pist 05 müsait. Rüzgar 040/8. Bir uçak downwind''te iniş istiyor.</p>',
       '{"situation":"THY 45C downwind runway 05, request landing.","youAre":"TWR","options":["Turkish 45C, runway 05, cleared to land, wind 040 degrees 8 knots","Turkish 45C, go around","Turkish 45C, hold position"],"correctOption":"Turkish 45C, runway 05, cleared to land, wind 040 degrees 8 knots"}'::jsonb,
       2, TRUE, 'PUBLISHED'
FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Canlı pratik: IVAO', 'canli-pratik-ivao', 'Sitede öğrendin. Şimdi gerçek ağa çık.',
       'LIVE_PRACTICE',
       '<p>IVAO üzerinde observer veya ATC training ile dinle. Amaç eğitmen videosu izlemek değil; kule dilini canlı duymak.</p>',
       '{"platform":"IVAO","url":"https://www.ivao.aero","instruction":"IVAO''ya üye ol veya gir. Bir havalimanı kulesini dinle. En az bir çağrı-cevap duyunca bu adımı tamamla."}'::jsonb,
       3, TRUE, 'PUBLISHED'
FROM learning_paths WHERE slug = 'kule-ol';
