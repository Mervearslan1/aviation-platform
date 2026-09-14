CREATE TABLE learning_step_terms (
    id          BIGSERIAL PRIMARY KEY,
    step_id     BIGINT NOT NULL REFERENCES learning_steps (id) ON DELETE CASCADE,
    term        VARCHAR(120) NOT NULL,
    meaning     TEXT NOT NULL,
    sort_index  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_learning_step_terms_step ON learning_step_terms (step_id);

DELETE FROM user_step_progress
 WHERE step_id IN (SELECT id FROM learning_steps WHERE path_id IN (SELECT id FROM learning_paths WHERE slug = 'kule-ol'));
DELETE FROM learning_steps WHERE path_id IN (SELECT id FROM learning_paths WHERE slug = 'kule-ol');

UPDATE learning_paths
   SET description = 'Rehbere dayalı kule hattı: kimdir, meslek yolu, IVAO rating, fraseoloji, senaryo, canlı pratik. Her adımda terim sözlüğü vardır.'
 WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Kule kimdir?', 'kule-kimdir', 'TWR / GND / DEL ne iş yapar?', 'CONTENT',
'<p>Kule kontrolörü (TWR / ADC) pist ve manevra alanındaki trafiği yönetir.</p><ul><li><strong>GND</strong> apron ve taxiway: push-back, taksi.</li><li><strong>TWR</strong> pist: kalkış, iniş, crossing.</li><li><strong>DEL</strong> büyük meydanlarda rota izni (clearance).</li></ul><p>Temel iş: ayrım, akış, bilgi, acil durum.</p>',
NULL, 0, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Türkiye''de ATC olmak', 'turkiyede-atc', 'DHMİ, sınav, OJT, SHGM lisansı', 'CONTENT',
'<p>Devlet meydanlarında DHMİ. Süreç: mezuniyet + İngilizce (ICAO 4) + sağlık → sınav → temel eğitim (12-18 ay) → rating (ADC/APP/ACC) → OJT → SHGM ATCO lisansı ve unit rating.</p><p>IVAO rating resmi lisansa sayılmaz; terminoloji için değerlidir.</p>',
NULL, 1, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'IVAO rating merdiveni', 'ivao-rating', 'Hedef: ADC', 'CONTENT',
'<p>IVAO rating atlanmaz. Kule için hedef <strong>ADC</strong> (50 saat + teorik + pratik).</p><ol><li>Kayıt, observer dinle</li><li>AS3 teorik</li><li>ADC materyal + mentor</li><li>ADC pratik sınav</li></ol>',
NULL, 2, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: genel RT', 'dinle-genel-rt', 'Roger onay değildir.', 'LISTEN',
'<p>Kule kısa ve net konuşur. Dinle, doğru anlamı seç.</p>',
'{"promptText":"Turkish 123, standby.","question":"Standby ne demek?","options":["Bekle, birazdan döneceğim","Evet, onayladım","Talimatı uygula"],"correctOption":"Bekle, birazdan döneceğim"}'::jsonb,
3, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Ground', 'konus-ground', 'Push and start kule cevabı', 'SPEAK',
'<p>Uçak stand 12''den push and start istiyor. Kule gibi cevapla.</p>',
'{"promptText":"Istanbul Ground, Turkish 123, stand 12, request push and start.","expectedPhrase":"Turkish 123 push and start approved","acceptedPhrases":["turkish 123 push start approved","thy 123 push and start approved"]}'::jsonb,
4, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Kalkış: line up vs take-off', 'kalkis-line-up', 'Bu iki kalıbı asla karıştırma.', 'LISTEN',
'<p>Pist ihlalinin en sık nedeni line up ile cleared for take-off karışmasıdır.</p>',
'{"promptText":"Turkish 123, line up and wait runway 03.","question":"Uçak kalkış izni aldı mı?","options":["Hayır, piste girip bekleyecek","Evet, kalkabilir","Pistten geçiş izni aldı"],"correctOption":"Hayır, piste girip bekleyecek"}'::jsonb,
5, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: iniş', 'senaryo-inis', 'Pist müsait, rüzgar uygun.', 'SCENARIO',
'<p>Pist 05 müsait. Rüzgar 040/8. Downwind''teki uçak iniş istiyor.</p>',
'{"situation":"THY 45C downwind runway 05, request landing.","youAre":"TWR","options":["Turkish 45C, runway 05, cleared to land, wind 040 degrees 8 knots","Turkish 45C, go around","Turkish 45C, hold position"],"correctOption":"Turkish 45C, runway 05, cleared to land, wind 040 degrees 8 knots"}'::jsonb,
6, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Kalkış diyaloğu', 'kalkis-diyalogu', 'Push → taxi → line up → take-off', 'SCENARIO',
'<p>THY123 Ankara Tower. Sıradaki doğru kule cevabı nedir? Pilot: ready for departure.</p>',
'{"situation":"THY123 holding point runway 03, ready for departure.","youAre":"TWR","options":["THY123, line up and wait runway 03","THY123, cleared for take-off","THY123, taxi via Alpha"],"correctOption":"THY123, line up and wait runway 03"}'::jsonb,
7, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Canlı pratik: IVAO', 'canli-pratik-ivao', 'Observer olarak dinle.', 'LIVE_PRACTICE',
'<p>Standart kalıp kullan. Read-back kontrol et. Division SOP oku. Observer mode en hızlı öğrenmedir.</p>',
'{"platform":"IVAO","url":"https://www.ivao.aero","instruction":"IVAO''ya gir. Bir kule frekansını dinle. En az bir çağrı-cevap duyunca tamamla."}'::jsonb,
8, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'TWR / ADC', 'Tower / Aerodrome Controller — pist, kalkış, iniş.', 0 FROM learning_steps WHERE slug = 'kule-kimdir';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'GND', 'Ground — apron ve taxiway, push-back ve taksi.', 1 FROM learning_steps WHERE slug = 'kule-kimdir';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'DEL', 'Clearance Delivery — kalkış öncesi rota izni.', 2 FROM learning_steps WHERE slug = 'kule-kimdir';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Separation', 'Ayrım — çarpışmayı önlemek için mesafe/zaman.', 3 FROM learning_steps WHERE slug = 'kule-kimdir';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'DHMİ', 'Devlet Hava Meydanları İşletmesi.', 0 FROM learning_steps WHERE slug = 'turkiyede-atc';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'SHGM', 'Sivil Havacılık Genel Müdürlüğü — ATCO lisansı verir.', 1 FROM learning_steps WHERE slug = 'turkiyede-atc';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'OJT / OJTI', 'On-the-Job Training / eğitmen kontrolör.', 2 FROM learning_steps WHERE slug = 'turkiyede-atc';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Unit rating', 'Belirli bir havalimanına özel yetki.', 3 FROM learning_steps WHERE slug = 'turkiyede-atc';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'AS1', 'ATC Applicant — kayıtta gelir.', 0 FROM learning_steps WHERE slug = 'ivao-rating';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'AS3', 'Advanced trainee — ilk teorik sınav.', 1 FROM learning_steps WHERE slug = 'ivao-rating';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'ADC', 'Aerodrome Controller — kule açma hedefi (50 saat + sınav).', 2 FROM learning_steps WHERE slug = 'ivao-rating';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'APC / ACC', 'Approach / Area control — sonraki rating''ler.', 3 FROM learning_steps WHERE slug = 'ivao-rating';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Roger', 'Aldım, anladım — onay değildir.', 0 FROM learning_steps WHERE slug = 'dinle-genel-rt';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Wilco', 'Will comply — uygulayacağım.', 1 FROM learning_steps WHERE slug = 'dinle-genel-rt';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Standby', 'Bekle, birazdan döneceğim.', 2 FROM learning_steps WHERE slug = 'dinle-genel-rt';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Read back', 'Talimatı aynen tekrar et.', 3 FROM learning_steps WHERE slug = 'dinle-genel-rt';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Pushback approved', 'Geri itiş onaylandı.', 0 FROM learning_steps WHERE slug = 'konus-ground';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Taxi to holding point', 'Bekleme noktasına taksi et.', 1 FROM learning_steps WHERE slug = 'konus-ground';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Hold short', 'O noktanın önünde dur, geçme.', 2 FROM learning_steps WHERE slug = 'konus-ground';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Line up and wait', 'Piste gir, kalkış izni bekle.', 0 FROM learning_steps WHERE slug = 'kalkis-line-up';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Cleared for take-off', 'Kalkış izni.', 1 FROM learning_steps WHERE slug = 'kalkis-line-up';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Runway incursion', 'Pist ihlali.', 2 FROM learning_steps WHERE slug = 'kalkis-line-up';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Cleared to land', 'İniş izni.', 0 FROM learning_steps WHERE slug = 'senaryo-inis';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Go around', 'Pisti terk et, tur at.', 1 FROM learning_steps WHERE slug = 'senaryo-inis';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Continue approach', 'Yaklaşmaya devam, henüz iniş izni yok.', 2 FROM learning_steps WHERE slug = 'senaryo-inis';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'QNH', 'Deniz seviyesine göre altimetre basıncı.', 0 FROM learning_steps WHERE slug = 'kalkis-diyalogu';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'RWY / TWY', 'Runway / Taxiway.', 1 FROM learning_steps WHERE slug = 'kalkis-diyalogu';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'ATIS', 'Otomatik terminal bilgi yayını.', 2 FROM learning_steps WHERE slug = 'kalkis-diyalogu';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Observer', 'Frekansı dinle, henüz konuşma.', 0 FROM learning_steps WHERE slug = 'canli-pratik-ivao';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'SOP', 'Division standart operasyon prosedürü.', 1 FROM learning_steps WHERE slug = 'canli-pratik-ivao';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'MAYDAY / PAN PAN', 'Hayati tehlike / aciliyet.', 2 FROM learning_steps WHERE slug = 'canli-pratik-ivao';

INSERT INTO learning_paths (title, slug, description, difficulty, status, track) VALUES
    (
        'Pilot ol',
        'pilot-ol',
        'Uçmak isteyenler için ayrı hat. Adımlar ve terim sözlüğü kule ile aynı omurgada; içerik sonra detaylandırılacak.',
        'BEGINNER',
        'PUBLISHED',
        'PILOT'
    );

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, order_index, required, status)
SELECT id, 'Pilot hattı açılıyor', 'pilot-hatti-aciliyor', 'İskelet hazır, müfredat sonra.', 'CONTENT',
'<p>Pilot eğitimi kule gibi adım adım ve etkileşimli olacak. Bu adım yer tutucudur. Kule hattını bitirebilirsin; pilot içeriği ayrı pakette gelecek.</p>',
0, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'PPL', 'Private Pilot Licence — özel pilot lisansı (sonraki müfredat).', 0 FROM learning_steps WHERE slug = 'pilot-hatti-aciliyor';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'VFR / IFR', 'Görerek / aletli uçuş kuralları.', 1 FROM learning_steps WHERE slug = 'pilot-hatti-aciliyor';
