-- Kule + pilot ek RT diyalogları (hedef ~30 konuşma adımı).

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: hold short', 'twr-hold-short', 'Pist çizgisinde bekle.', 'SPEAK',
'<p>Uçak holding point''te. Hold short kalıbını söyle.</p>',
'{"promptText":"Ground, Turkish 123, approaching holding point runway 03.","expectedPhrase":"Turkish 123 hold short runway 03","acceptedPhrases":["thy 123 hold short runway 03"],"replyText":"Holding short runway 03, Turkish 123."}'::jsonb,
9, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: taxi via', 'twr-dinle-taxi', 'Taksi rotası', 'LISTEN',
'<p>Taksi talimatını dinle.</p>',
'{"promptText":"Turkish 123, taxi to holding point runway 03 via Alpha.","question":"Uçak nereye taksi yapacak?","options":["Holding point 03, Alpha","Apron stand 12","Runway 21"],"correctOption":"Holding point 03, Alpha"}'::jsonb,
10, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: contact tower', 'twr-contact-tower', 'Frekans değişimi', 'SPEAK',
'<p>Ground işi bitti, kuleye geçir.</p>',
'{"promptText":"Turkish 123, ready for departure.","expectedPhrase":"Turkish 123 contact tower 118.1","acceptedPhrases":["contact tower 118 decimal 1"],"replyText":"Contacting tower 118.1, Turkish 123."}'::jsonb,
11, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: go around', 'twr-go-around', 'Pist meşgul', 'SCENARIO',
'<p>Pistte hâlâ bir uçak var. Downwind''teki uçağa ne dersin?</p>',
'{"situation":"Runway occupied. THY 88 on final.","youAre":"TWR","options":["Turkish 88, go around","Turkish 88, cleared to land","Turkish 88, line up and wait"],"correctOption":"Turkish 88, go around","expectedPhrase":"Turkish 88 go around","replyText":"Going around, Turkish 88."}'::jsonb,
12, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: cleared to land', 'twr-cleared-land', 'İniş izni', 'SPEAK',
'<p>Pist müsait, rüzgar uygun.</p>',
'{"promptText":"Turkish 45C, final runway 05.","expectedPhrase":"Turkish 45C runway 05 cleared to land","acceptedPhrases":["cleared to land runway 05"],"replyText":"Cleared to land runway 05, Turkish 45C."}'::jsonb,
13, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: wind', 'twr-dinle-wind', 'Rüzgar bilgisi', 'LISTEN',
'<p>Rüzgarı dinle.</p>',
'{"promptText":"Wind 040 degrees 8 knots.","question":"Rüzgar nedir?","options":["040 derece, 8 knot","220 derece, 18 knot","Pist kapalı"],"correctOption":"040 derece, 8 knot"}'::jsonb,
14, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: cross runway', 'twr-cross', 'Pist crossing', 'SPEAK',
'<p>Taksi için pistten geçiş.</p>',
'{"promptText":"Turkish 123, request cross runway 03.","expectedPhrase":"Turkish 123 cross runway 03","acceptedPhrases":["cross runway 03 turkish 123"],"replyText":"Crossing runway 03, Turkish 123."}'::jsonb,
15, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: number 2', 'twr-number-two', 'Sıra bilgisi', 'SCENARIO',
'<p>Finalde bir uçak var, ikinciyi nasıl çağırırsın?</p>',
'{"situation":"One on final, another on base.","options":["Turkish 77, number 2, continue approach","Turkish 77, cleared to land","Turkish 77, hold short"],"correctOption":"Turkish 77, number 2, continue approach","expectedPhrase":"Turkish 77 number 2 continue approach","replyText":"Number 2, Turkish 77."}'::jsonb,
16, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: vacate', 'twr-vacate', 'Pisti terk et', 'SPEAK',
'<p>İniş sonrası.</p>',
'{"promptText":"Turkish 123, vacated runway 03.","expectedPhrase":"Turkish 123 contact ground 121.7","acceptedPhrases":["contact ground 121 decimal 7"],"replyText":"Contacting ground, Turkish 123."}'::jsonb,
17, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: report downwind', 'twr-downwind', 'Pozisyon raporu', 'LISTEN',
'<p>Downwind çağrısı.</p>',
'{"promptText":"Turkish 123, report downwind runway 05.","question":"Uçaktan ne istenir?","options":["Downwind raporu","Kalkış izni","Apron park"],"correctOption":"Downwind raporu"}'::jsonb,
18, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: extend downwind', 'twr-extend', 'Trafik aralığı', 'SPEAK',
'<p>Aralık lazım.</p>',
'{"promptText":"Turkish 123, downwind runway 05.","expectedPhrase":"Turkish 123 extend downwind","acceptedPhrases":["extend downwind turkish 123"],"replyText":"Extending downwind, Turkish 123."}'::jsonb,
19, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: orbit', 'twr-orbit', 'Bekleme turu', 'SCENARIO',
'<p>Pist meşgul, kısa gecikme.</p>',
'{"situation":"Need two minutes, traffic on the runway.","options":["Turkish 12, orbit left","Turkish 12, cleared to land","Turkish 12, take-off"],"correctOption":"Turkish 12, orbit left","expectedPhrase":"Turkish 12 orbit left","replyText":"Orbiting left, Turkish 12."}'::jsonb,
20, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: ident', 'twr-ident', 'Radar doğrulama', 'SPEAK',
'<p>Radar kimliği.</p>',
'{"promptText":"Turkish 123, squawk ident.","expectedPhrase":"Ident Turkish 123","acceptedPhrases":["squawk ident turkish 123"],"replyText":"Ident, Turkish 123."}'::jsonb,
21, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: climb', 'twr-climb', 'İrtifa', 'LISTEN',
'<p>Tırmanış talimatı.</p>',
'{"promptText":"Turkish 123, climb altitude 5000 feet.","question":"Ne yapacak?","options":["5000 fite tırman","5000 fite alçal","Pistte bekle"],"correctOption":"5000 fite tırman"}'::jsonb,
22, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: after departure', 'twr-after-dep', 'Kalkış sonrası', 'SPEAK',
'<p>Kalkış izni + ilk irtifa.</p>',
'{"promptText":"Turkish 123, ready.","expectedPhrase":"Turkish 123 cleared for take-off runway 03","acceptedPhrases":["cleared for takeoff runway 03"],"replyText":"Cleared for take-off, Turkish 123."}'::jsonb,
23, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol';

-- Pilot ek diyaloglar
INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: request taxi', 'plt-taxi', 'Taksi talebi', 'SPEAK',
'<p>Stand 12, pist 03.</p>',
'{"promptText":"You are Turkish 123, stand 12. Call ground.","expectedPhrase":"Ground Turkish 123 request taxi","acceptedPhrases":["istanbul ground turkish 123 taxi"],"replyText":"Turkish 123, taxi via Alpha."}'::jsonb,
11, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: taxi route', 'plt-dinle-taxi', 'Rotayı anla', 'LISTEN',
'<p>Taksi rotası.</p>',
'{"promptText":"Turkish 123, taxi holding point 03 via Alpha, hold short.","question":"Ne yapacaksın?","options":["Alpha ile 03 holding, hold short","Direkt piste gir kalk","Stand 12''ye dön"],"correctOption":"Alpha ile 03 holding, hold short"}'::jsonb,
12, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: ready for departure', 'plt-ready', 'Kalkışa hazır', 'SPEAK',
'<p>Holding point, checks bitti.</p>',
'{"promptText":"Tower is waiting.","expectedPhrase":"Turkish 123 ready for departure","acceptedPhrases":["ready for departure turkish 123"],"replyText":"Turkish 123, line up and wait."}'::jsonb,
13, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: take-off read-back', 'plt-to-rb', 'Kalkış iznini tekrarla', 'SCENARIO',
'<p>Cleared for take-off geldi.</p>',
'{"situation":"Turkish 123, runway 03, cleared for take-off.","options":["Cleared for take-off runway 03, Turkish 123","Line up and wait Turkish 123","Hold short runway 03"],"correctOption":"Cleared for take-off runway 03, Turkish 123","expectedPhrase":"cleared for take-off runway 03 Turkish 123","replyText":"Roger."}'::jsonb,
14, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: downwind', 'plt-downwind', 'Pozisyon', 'SPEAK',
'<p>Trafik paterni.</p>',
'{"promptText":"You are on downwind runway 05.","expectedPhrase":"Turkish 123 downwind runway 05","acceptedPhrases":["downwind 05 turkish 123"],"replyText":"Turkish 123, number 2, report final."}'::jsonb,
15, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: number 2', 'plt-number2', 'Sıra', 'LISTEN',
'<p>Number 2 ne demek?</p>',
'{"promptText":"Turkish 123, number 2, continue approach.","question":"Ne yapıyorsun?","options":["İkinci sıradasın, yaklaşmaya devam","Kalkış izni aldın","Pistte bekle"],"correctOption":"İkinci sıradasın, yaklaşmaya devam"}'::jsonb,
16, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: final', 'plt-final', 'Final raporu', 'SPEAK',
'<p>Finalde kuleyi ara.</p>',
'{"promptText":"Turning final runway 05.","expectedPhrase":"Turkish 123 final runway 05","acceptedPhrases":["final 05 turkish 123"],"replyText":"Turkish 123, cleared to land."}'::jsonb,
17, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: landing read-back', 'plt-land-rb', 'İniş iznini tekrarla', 'SCENARIO',
'<p>Cleared to land.</p>',
'{"situation":"Turkish 123, runway 05, cleared to land, wind 040/8.","options":["Cleared to land runway 05, Turkish 123","Go around Turkish 123","Hold short 05"],"correctOption":"Cleared to land runway 05, Turkish 123","expectedPhrase":"cleared to land runway 05 Turkish 123","replyText":"Roger."}'::jsonb,
18, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: vacated', 'plt-vacated', 'Pist boş', 'SPEAK',
'<p>İniş sonrası.</p>',
'{"promptText":"You left the runway on Bravo.","expectedPhrase":"Turkish 123 vacated runway 05","acceptedPhrases":["runway vacated turkish 123"],"replyText":"Turkish 123, contact ground."}'::jsonb,
19, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: go around', 'plt-ga-listen', 'Pas geç', 'LISTEN',
'<p>Go around talimatı.</p>',
'{"promptText":"Turkish 123, go around, I say again, go around.","question":"Ne yapacaksın?","options":["Pas geç, tırman","İnişe devam","Pistte dur"],"correctOption":"Pas geç, tırman"}'::jsonb,
20, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: going around', 'plt-going-around', 'Pas geç read-back', 'SPEAK',
'<p>Go around geldi.</p>',
'{"promptText":"Turkish 123, go around.","expectedPhrase":"Going around Turkish 123","acceptedPhrases":["go around turkish 123"],"replyText":"Roger, Turkish 123."}'::jsonb,
21, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Senaryo: MAYDAY', 'plt-mayday', 'Acil durum', 'SCENARIO',
'<p>Motor kaybı, iniş şart.</p>',
'{"situation":"Engine failure, need the field.","options":["MAYDAY MAYDAY MAYDAY Turkish 123 engine failure","PAN PAN request taxi","Roger, continue"],"correctOption":"MAYDAY MAYDAY MAYDAY Turkish 123 engine failure","expectedPhrase":"mayday turkish 123 engine failure","replyText":"Turkish 123, roger MAYDAY, runway 03 is yours."}'::jsonb,
22, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol';
