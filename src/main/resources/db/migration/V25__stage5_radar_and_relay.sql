-- Asama 2: trafik uyarisi + 7700 aktarma. Asama 5: IGA radar oyunu (85 puan).

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: trafik uyarısı', 'twr2-tcas', 'İki uçak yakın, TCAS.', 'LISTEN',
'<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru Türkçe.</p>',
'{"stage":2,"promptText":"AJet 221, traffic alert, TCAS climb, SunExpress 773 opposite.","question":"Kule ne yapmalı?","options":["Ayrımı koru, birine climb birine maintain","İkisine de cleared to land"," squawk 2000 ver"],"correctOption":"Ayrımı koru, birine climb birine maintain"}'::jsonb,
201, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr2-tcas');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: TCAS', 'twr2-tcas-sc', 'Trafik alert, iki çağrı.', 'SCENARIO',
'<p>Durumu oku. Şıklar İngilizce kule konuşması.</p>',
'{"stage":2,"situation":"AJet 221 TCAS climb. SunExpress 773 800 ft below, opposite.","options":["AJet 221, climb 5000. SunExpress 773, maintain 4000, turn left heading 270","Both aircraft, cleared to land","Ignore TCAS, continue"],"correctOption":"AJet 221, climb 5000. SunExpress 773, maintain 4000, turn left heading 270","expectedPhrase":"AJet 221 climb 5000 SunExpress maintain 4000","replyText":"Climbing, AJet. Maintaining, SunExpress."}'::jsonb,
202, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr2-tcas-sc');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: 7700, radyo yok', 'twr4-nordo', 'Squawk 7700, cevap yok.', 'LISTEN',
'<p>Uçak 7700 basmış, seni duymuyor. Başka uçaktan aktarma isteyeceksin.</p>',
'{"stage":4,"promptText":"Turkish 777 squawking 7700, no reply.","question":"Ne yaparsın?","options":["Başka uçaktan relay iste"," squawk 2000 söyle, kapat","Taksi ver"],"correctOption":"Başka uçaktan relay iste"}'::jsonb,
203, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr4-nordo');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: relay', 'twr4-relay', '7700, sen duyamıyorsun.', 'SCENARIO',
'<p>Başka uçak senin talimatı iletecek; gelen cevaba göre yeni komut ver.</p>',
'{"stage":4,"situation":"Turkish 777 MAYDAY, squawk 7700, no radio. SunExpress 773 is nearby.","options":["SunExpress 773, relay to Turkish 777: squawk ident if you read, runway 16 Left is yours","Turkish 777, taxi via Alpha","All aircraft, continue as filed"],"correctOption":"SunExpress 773, relay to Turkish 777: squawk ident if you read, runway 16 Left is yours","expectedPhrase":"SunExpress 773 relay Turkish 777 squawk ident runway 16 Left is yours","replyText":"SunExpress 773, he idented, runway in sight."}'::jsonb,
204, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr4-relay');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: relay sonrası', 'twr4-relay-say', 'Aktarma geldi, yeni talimat.', 'SPEAK',
'<p>Mikrofonu aç. Kalıp İngilizce. SunExpress aktardı: ident görüldü, pist görünüyor.</p>',
'{"stage":4,"promptText":"SunExpress 773, Turkish 777 idented, runway in sight.","expectedPhrase":"Turkish 777 runway 16 Left is yours services rolling","acceptedPhrases":["runway 16 left is yours","triple seven runway is yours"],"replyText":"Runway 16 Left, Turkish 777."}'::jsonb,
205, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr4-relay-say');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Aşama 5: IGA radar', 'twr5-intro', 'Kule olma oyunu. 85 puan.', 'CONTENT',
'<p>Gerçek kule gibi: yaklaşma, kule veya yer seç. IGA (LTFM) pistleri, METAR, ATIS sağda. Radarda uçağa tıkla, komutu tablodan seç, <strong>İngilizce söyle</strong>. Yüzde 50 yeterse uçak cevaplar; yetmezse say again der. MAYDAY, PAN, hold, take-off karışık gelir — sen önceden bilmezsin. İlerleme kaydolur; sıfırlayabilirsin. Hata olursa admin’e bildir.</p>',
'{"stage":5,"titleEn":"Stage 5: IGA radar"}'::jsonb,
220, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr5-intro');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Radar: kule ol', 'twr5-radar', 'Yaklaşma / kule / yer. IGA.', 'LIVE_PRACTICE',
'<p>Uçağı seç, pilotu dinle (yazı yok), komutu söyle. Triple seven = 777. Beş = fife, dokuz = niner.</p>',
'{"stage":5,"game":"radar","titleEn":"Radar: be the tower"}'::jsonb,
221, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr5-radar');
