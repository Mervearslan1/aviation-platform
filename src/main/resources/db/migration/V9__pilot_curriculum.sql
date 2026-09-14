DELETE FROM user_step_progress
 WHERE step_id IN (SELECT id FROM learning_steps WHERE path_id IN (SELECT id FROM learning_paths WHERE slug = 'pilot-ol'));
DELETE FROM learning_step_terms
 WHERE step_id IN (SELECT id FROM learning_steps WHERE path_id IN (SELECT id FROM learning_paths WHERE slug = 'pilot-ol'));
DELETE FROM learning_steps WHERE path_id IN (SELECT id FROM learning_paths WHERE slug = 'pilot-ol');

UPDATE learning_paths
   SET description = 'Pilot hattı: kimdir, SHGM lisans basamakları, IVAO PP hedefi, ATC ile konuşma, senaryo, canlı pratik. Her adımda terim sözlüğü. Uçak sistemleri sonraki faz.'
 WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Pilot kimdir?', 'pilot-kimdir', 'PIC, FO, PF, PM', 'CONTENT',
'<p>Pilot, kalkıştan inişe operasyondan sorumludur: planlama, performans, ATC, uçuş, acil durum.</p><ul><li><strong>Kaptan (PIC)</strong> — sol koltuk, nihai sorumlu.</li><li><strong>FO</strong> — ikinci pilot, sağ koltuk.</li><li><strong>PF / PM</strong> — kim uçuruyor / kim izliyor; koltukla bağlı değil, dönüşümlü.</li></ul>',
NULL, 0, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Türkiye''de lisans yolu', 'turkiyede-lisans', 'PPL, CPL, ATPL — SHGM / EASA', 'CONTENT',
'<p>Lisanslar SHGM tarafından EASA uyumlu düzenlenir.</p><ol><li>Medical Class 1 (en başta)</li><li>ATO seçimi</li><li>ATPL teorisi (14 modül)</li><li>PPL + solo</li><li>CPL + IR</li><li>MCC</li><li>Type Rating</li><li>Line Training</li></ol><p>IVAO rating resmi lisans yerine geçmez; fraseoloji ve ATC alışkanlığı kazandırır.</p>',
NULL, 1, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'IVAO pilot rating', 'ivao-pilot-rating', 'Hedef: PP', 'CONTENT',
'<p>Rating atlanmaz. ATC ile tam konuşma için hedef <strong>PP</strong> (50 saat + teorik + pratik), sonra SPP.</p><ol><li>Kayıt, C172 ile VFR circuit</li><li>FS3 teorik</li><li>Uçuş planı + ATC pratik</li><li>PP pratik sınav</li><li>IFR ve karmaşık tipe geç</li></ol>',
NULL, 2, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: ilk çağrı', 'dinle-ilk-cagri-pilot', 'Standart format: birim, çağrı işareti, durum, talep', 'LISTEN',
'<p>Pilot ilk temasta sırayı bozmaz. Dinle, ne istendiğini seç.</p>',
'{"promptText":"Ankara Tower, Turkish 123, stand 12, request pushback and start-up","question":"Pilot ne istiyor?","options":["Pushback and start-up","Landing clearance","Taxi to gate"],"correctOption":"Pushback and start-up"}'::jsonb,
3, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: pushback talebi', 'konus-pushback', 'Sen pilotsun, kuleyi ara.', 'SPEAK',
'<p>Stand 12''desin. Ankara Tower''ı ara, push and start iste.</p>',
'{"promptText":"Sen THY123, stand 12. Kuleyi ara.","expectedPhrase":"Ankara Tower Turkish 123 request pushback and start","acceptedPhrases":["ankara tower thy 123 request push and start","tower turkish 123 request pushback"]}'::jsonb,
4, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Read-back: taksi', 'readback-taksi', 'Talimatı çağrı işaretiyle tekrarla.', 'LISTEN',
'<p>Kule taksi verdi. Doğru read-back hangisi?</p>',
'{"promptText":"Turkish 123, taxi to holding point runway 03 via Alpha, Bravo.","question":"Pilot nasıl cevaplar?","options":["Taxi to holding point runway 03 via Alpha, Bravo, Turkish 123","Roger","Taxi via Alpha, out"],"correctOption":"Taxi to holding point runway 03 via Alpha, Bravo, Turkish 123"}'::jsonb,
5, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: line up read-back', 'konus-line-up', 'Piste gir, kalkış izni değil.', 'SPEAK',
'<p>Kule: line up and wait runway 03. Tekrarla.</p>',
'{"promptText":"Turkish 123, line up and wait runway 03.","expectedPhrase":"line up and wait runway 03 Turkish 123","acceptedPhrases":["line up and wait runway 03 thy 123","lining up runway 03 turkish 123"]}'::jsonb,
6, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: kalkış izni', 'senaryo-kalkis-izni', 'Cleared for take-off gelince read-back.', 'SCENARIO',
'<p>Pist 03, rüzgar 030/8. Kule kalkış izni verdi. Ne dersin?</p>',
'{"situation":"THY123, wind 030 degrees 8 knots, runway 03, cleared for take-off.","youAre":"PILOT","options":["Cleared for take-off runway 03, THY123","Line up and wait runway 03, THY123","Roger, THY123"],"correctOption":"Cleared for take-off runway 03, THY123"}'::jsonb,
7, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: iniş', 'senaryo-inis-pilot', 'ILS, final, cleared to land', 'SCENARIO',
'<p>ILS 03 üzerinde kurulduun. Kule continue approach, report final dedi. Finaldesin. Sonra iniş izni geldi.</p>',
'{"situation":"THY123, wind 030 degrees 6 knots, runway 03, cleared to land.","youAre":"PILOT","options":["Cleared to land runway 03, THY123","Going around, THY123","Wilco"],"correctOption":"Cleared to land runway 03, THY123"}'::jsonb,
8, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Acil durum kalıpları', 'acil-durum', 'MAYDAY vs PAN PAN', 'LISTEN',
'<p>Hayati tehlike = MAYDAY (üç kez). Aciliyet ama hayat yok = PAN PAN.</p>',
'{"promptText":"Mayday, mayday, mayday, Turkish 123, engine failure.","question":"Bu çağrı ne anlama gelir?","options":["Hayati tehlike, öncelik istenir","Sadece yakıt az, bilgi","Rutin pozisyon raporu"],"correctOption":"Hayati tehlike, öncelik istenir"}'::jsonb,
9, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Canlı pratik: IVAO pilot', 'canli-pratik-ivao-pilot', 'C172 ile circuit, ATC ile konuş', 'LIVE_PRACTICE',
'<p>Uçuş planını doldur. Read-back eksiksiz. Standart dışı "tamam/peki" yok. Frekansı dinle. Checklist kullan.</p>',
'{"platform":"IVAO","url":"https://www.ivao.aero","instruction":"IVAO uçuş istemcisini aç. Basit bir uçakla (ör. C172) bir meydanda circuit dene veya observer ol. En az bir ATC çağrısı yaptıysan veya dinlediysen tamamla."}'::jsonb,
10, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'PIC', 'Pilot in Command — kaptan, nihai sorumlu.', 0 FROM learning_steps WHERE slug = 'pilot-kimdir';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'FO', 'First Officer — ikinci pilot.', 1 FROM learning_steps WHERE slug = 'pilot-kimdir';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'PF', 'Pilot Flying — uçağı o an uçuran.', 2 FROM learning_steps WHERE slug = 'pilot-kimdir';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'PM', 'Pilot Monitoring — sistem ve ATC takibi.', 3 FROM learning_steps WHERE slug = 'pilot-kimdir';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'PPL', 'Private Pilot Licence — özel uçuş, ticari taşıma yok.', 0 FROM learning_steps WHERE slug = 'turkiyede-lisans';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'CPL', 'Commercial Pilot Licence — ücretli uçuş hakkı.', 1 FROM learning_steps WHERE slug = 'turkiyede-lisans';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'ATPL / fATPL', 'Airline Transport / frozen ATPL (1500 saat öncesi).', 2 FROM learning_steps WHERE slug = 'turkiyede-lisans';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'ATO', 'Approved Training Organization — onaylı uçuş okulu.', 3 FROM learning_steps WHERE slug = 'turkiyede-lisans';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'IR / MCC', 'Instrument Rating / Multi-Crew Cooperation.', 4 FROM learning_steps WHERE slug = 'turkiyede-lisans';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Type Rating', 'Belirli uçak tipine (A320, B737) intibak.', 5 FROM learning_steps WHERE slug = 'turkiyede-lisans';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'FS1 / FS3', 'Flight Student basamakları; FS3 ilk teorik sınav.', 0 FROM learning_steps WHERE slug = 'ivao-pilot-rating';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'PP', 'Private Pilot rating — IVAO hedefi (50 saat + sınav).', 1 FROM learning_steps WHERE slug = 'ivao-pilot-rating';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'SPP / CP / ATP', 'İleri VFR-IFR, ticari, havayolu tipi rating''ler.', 2 FROM learning_steps WHERE slug = 'ivao-pilot-rating';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Request', 'Talep: pushback, taxi, start-up, climb...', 0 FROM learning_steps WHERE slug = 'dinle-ilk-cagri-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'İlk çağrı sırası', 'Birim + çağrı işareti + pozisyon + talep.', 1 FROM learning_steps WHERE slug = 'dinle-ilk-cagri-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Unable', 'Talimatı yerine getiremiyorum.', 2 FROM learning_steps WHERE slug = 'dinle-ilk-cagri-pilot';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Pushback and start-up', 'Geri itiş ve motor çalıştırma talebi.', 0 FROM learning_steps WHERE slug = 'konus-pushback';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Read-back', 'Talimat + çağrı işareti ile tekrar.', 1 FROM learning_steps WHERE slug = 'konus-pushback';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Holding point', 'Pist öncesi bekleme noktası.', 0 FROM learning_steps WHERE slug = 'readback-taksi';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Via Alpha, Bravo', 'Taksi yolu sırası.', 1 FROM learning_steps WHERE slug = 'readback-taksi';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Holding short', 'Pist önünde durduğunu bildir.', 2 FROM learning_steps WHERE slug = 'readback-taksi';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Line up and wait', 'Piste gir, kalkış izni bekle.', 0 FROM learning_steps WHERE slug = 'konus-line-up';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Cleared for take-off', 'Kalkış izni — line up değildir.', 1 FROM learning_steps WHERE slug = 'konus-line-up';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Ready for departure', 'Kalkışa hazırım.', 0 FROM learning_steps WHERE slug = 'senaryo-kalkis-izni';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Rolling', 'Kalkış koşusuna başladım (bazı yerlerde).', 1 FROM learning_steps WHERE slug = 'senaryo-kalkis-izni';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Positive rate, gear up', 'Kokpit: tırmanış pozitif, takım yukarı.', 2 FROM learning_steps WHERE slug = 'senaryo-kalkis-izni';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'ILS / localizer', 'Aletli yaklaşma hattı.', 0 FROM learning_steps WHERE slug = 'senaryo-inis-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Final', 'Son yaklaşma ayağı.', 1 FROM learning_steps WHERE slug = 'senaryo-inis-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Cleared to land', 'İniş izni — read-back zorunlu.', 2 FROM learning_steps WHERE slug = 'senaryo-inis-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Going around', 'Tur atıyorum.', 3 FROM learning_steps WHERE slug = 'senaryo-inis-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Runway vacated', 'Pisti boşalttım.', 4 FROM learning_steps WHERE slug = 'senaryo-inis-pilot';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'MAYDAY', 'Hayati tehlike — üç kez.', 0 FROM learning_steps WHERE slug = 'acil-durum';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'PAN PAN', 'Aciliyet, hayati tehlike yok — üç kez.', 1 FROM learning_steps WHERE slug = 'acil-durum';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Minimum fuel', 'Yakıt kritik, öncelik gerekebilir.', 2 FROM learning_steps WHERE slug = 'acil-durum';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'SID / STAR', 'Standart kalkış / varış rotası.', 0 FROM learning_steps WHERE slug = 'canli-pratik-ivao-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Squawk', 'Transponder kodu.', 1 FROM learning_steps WHERE slug = 'canli-pratik-ivao-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Flight plan', 'Rota, irtifa, tip, yakıt — gerçek formata uy.', 2 FROM learning_steps WHERE slug = 'canli-pratik-ivao-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'FOB', 'Fuel on board.', 3 FROM learning_steps WHERE slug = 'canli-pratik-ivao-pilot';
