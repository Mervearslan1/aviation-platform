-- Kule/pilot metinleri Türkçe; frekans konuşması İngilizce kalır.
UPDATE learning_paths SET description = 'Dört aşama: zemin, trafik, PAN, MAYDAY. Konuşmalar İngilizce; açıklama Türkçe. Giriş yapan puan biriktirir.' WHERE slug = 'kule-ol';
UPDATE learning_paths SET description = 'Dört aşama: yer, patern, PAN, MAYDAY. Read-back İngilizce. Giriş yapan puan biriktirir.' WHERE slug = 'pilot-ol';

UPDATE learning_steps SET
  title = 'Aşama 1: Zemin',
  description = 'Geri itiş, taksi, kalkış ve iniş izni.',
  content_html = '<p>Bu aşama yer konuşması: geri itiş, taksi, çizgide bekleme, piste girme, kalkış ve iniş izni. <strong>Frekanstaki cümleler İngilizce</strong>; açıklama ve sorular Türkçe. Turkish, SunExpress, AJet (Anadolu), Pegasus karışık gelir. Doğru şık her zaman birinci değil.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-intro';
UPDATE learning_steps SET
  title = 'Dinle: AJet geri itiş',
  description = 'AJet, frekansta Anadolu diye okunur.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Uçak ne istiyor?","options":["Taxi to gate","Push and start","Landing clearance"],"correctOption":"Push and start"}'::jsonb
 WHERE slug = 'twr1-push-q';
UPDATE learning_steps SET
  title = 'Konuş: geri itiş onayı',
  description = 'Turkish 941 için kule cevabı.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-push';
UPDATE learning_steps SET
  title = 'Dinle: SunExpress taksi',
  description = 'Taksi rotasını seç.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Nereye taksi?","options":["Direkt piste gir","Stand 12''ye dön","Alpha ile 03 holding, hold short"],"correctOption":"Alpha ile 03 holding, hold short"}'::jsonb
 WHERE slug = 'twr1-sxs-taxi';
UPDATE learning_steps SET
  title = 'Konuş: AJet taksi',
  description = 'Anadolu 221 — Bravo, hold short.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-ajet-taxi';
UPDATE learning_steps SET
  title = 'Senaryo: Pegasus taksi',
  description = 'Aprondan holding’e.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-ready-taxi';
UPDATE learning_steps SET
  title = 'Dinle: hold short',
  description = 'Çizgiyi geçme.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Uçak ne yapacak?","options":["Pisti geçip taksi","Pist çizgisinde bekleyecek","Kalkış izni aldı"],"correctOption":"Pist çizgisinde bekleyecek"}'::jsonb
 WHERE slug = 'twr1-hold-q';
UPDATE learning_steps SET
  title = 'Konuş: hold short',
  description = 'Turkish 102J çizgide beklesin.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-hold';
UPDATE learning_steps SET
  title = 'Dinle: line up',
  description = 'Kalkış izni değildir.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Kalkış izni var mı?","options":["Evet, kalkabilir","Pistten geçiş","Hayır, piste girip bekleyecek"],"correctOption":"Hayır, piste girip bekleyecek"}'::jsonb
 WHERE slug = 'twr1-lineup-q';
UPDATE learning_steps SET
  title = 'Konuş: line up',
  description = 'SunExpress piste girip bekler.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-lineup';
UPDATE learning_steps SET
  title = 'Senaryo: henüz kalkış yok',
  description = 'Finalde trafik varken line up.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-not-to';
UPDATE learning_steps SET
  title = 'Konuş: kalkış izni',
  description = 'Pist müsait.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-to';
UPDATE learning_steps SET
  title = 'Konuş: ground’a geçir',
  description = '121.7',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-ground';
UPDATE learning_steps SET
  title = 'Dinle: rüzgâr',
  description = 'İniş bilgisi.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Rüzgar nedir?","options":["Pist kapalı","040 derece, 8 knot","220 derece, 18 knot"],"correctOption":"040 derece, 8 knot"}'::jsonb
 WHERE slug = 'twr1-wind';
UPDATE learning_steps SET
  title = 'Konuş: iniş izni',
  description = 'Turkish 1452, pist 05.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-land';
UPDATE learning_steps SET
  title = 'Senaryo: iniş izni',
  description = 'Pist müsait, rüzgâr uygun.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-land-rb';
UPDATE learning_steps SET
  title = 'Dinle: Charlie',
  description = 'Taxiway C.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Hangi taxiway?","options":["Charlie","Alpha","Bravo"],"correctOption":"Charlie"}'::jsonb
 WHERE slug = 'twr1-charlie-q';
UPDATE learning_steps SET
  title = 'Konuş: Charlie',
  description = 'Havacılık alfabesi.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-charlie';
UPDATE learning_steps SET
  title = 'Konuş: Alpha Bravo Charlie',
  description = 'A B C — aksanla da yeter.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-abc';
UPDATE learning_steps SET
  title = 'Dinle: AJet okunuşu',
  description = 'Sözlü çağrı: Anadolu.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Bu uçak hangi şirket?","options":["SunExpress","Pegasus","AJet (Anadolu)"],"correctOption":"AJet (Anadolu)"}'::jsonb
 WHERE slug = 'twr1-anadolu';
UPDATE learning_steps SET
  title = 'Senaryo: ilk çağrı',
  description = 'Sıra: birim, çağrı, konum, talep.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-first-call';
UPDATE learning_steps SET
  title = 'Konuş: kuleye geçir',
  description = '118.1',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-tower-freq';
UPDATE learning_steps SET
  title = 'Dinle: ident',
  description = 'Radar doğrulama.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Uçak ne yapacak?","options":["Ident basacak","Mayday açacak","Pisti terk edecek"],"correctOption":"Ident basacak"}'::jsonb
 WHERE slug = 'twr1-ident-q';
UPDATE learning_steps SET
  title = 'Konuş: ident',
  description = 'Turkish 941 ident versin.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'twr1-ident';
UPDATE learning_steps SET
  title = 'Dinle: number 2',
  description = 'Önünde bir uçak var.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Ne anlama gelir?","options":["Pistte bekle","İkinci sırada, yaklaşmaya devam","Kalkış izni"],"correctOption":"İkinci sırada, yaklaşmaya devam"}'::jsonb
 WHERE slug = 'twr2-num2-q';
UPDATE learning_steps SET
  title = 'Konuş: number 2',
  description = 'AJet yaklaşmaya devam.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-num2';
UPDATE learning_steps SET
  title = 'Senaryo: iki uçak',
  description = 'Biri finalde, biri downwind.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-two';
UPDATE learning_steps SET
  title = 'Konuş: downwind uzat',
  description = 'Aralık lazım.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-extend';
UPDATE learning_steps SET
  title = 'Dinle: go around',
  description = 'Pist meşgul.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Neden pas geçiyor?","options":["Pistte trafik var","Yakıt bitti","Rüzgar sıfır"],"correctOption":"Pistte trafik var"}'::jsonb
 WHERE slug = 'twr2-ga-q';
UPDATE learning_steps SET
  title = 'Konuş: go around',
  description = 'SunExpress’e pas geç.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-ga';
UPDATE learning_steps SET
  title = 'Senaryo: yol ver',
  description = 'Apron çıkışı.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-giveway';
UPDATE learning_steps SET
  title = 'Konuş: orbit',
  description = 'İki dakikalık tur.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-orbit';
UPDATE learning_steps SET
  title = 'Dinle: report final',
  description = 'Finalde bildir.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Uçak ne zaman konuşur?","options":["Kalkışta","Apronda","Finalde"],"correctOption":"Finalde"}'::jsonb
 WHERE slug = 'twr2-final-q';
UPDATE learning_steps SET
  title = 'Konuş: continue approach',
  description = 'Henüz iniş izni yok.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-continue';
UPDATE learning_steps SET
  title = 'Senaryo: sıra 1–2',
  description = 'Üç uçak, bir pist.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-seq';
UPDATE learning_steps SET
  title = 'Konuş: trafik bilgisi',
  description = 'Finaldeki Airbus.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-traffic';
UPDATE learning_steps SET
  title = 'Dinle: behind landing',
  description = 'İnenin ardından kalkış.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Ne bekliyor?","options":["Hold short sadece","İnen A320''nin ardından kalkış","Go around"],"correctOption":"İnen A320''nin ardından kalkış"}'::jsonb
 WHERE slug = 'twr2-behind';
UPDATE learning_steps SET
  title = 'Konuş: expedite',
  description = 'Pisti çabuk boşalt.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-expedite';
UPDATE learning_steps SET
  title = 'Senaryo: pist crossing',
  description = 'Finalde uçak varken geçiş yok.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-cross';
UPDATE learning_steps SET
  title = 'Konuş: cross',
  description = 'Final boş, geçebilir.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-cross-ok';
UPDATE learning_steps SET
  title = 'Dinle: delay',
  description = 'Yoğun trafik.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Ne olacak?","options":["5 dakika gecikme","Hemen iniş izni","Mayday"],"correctOption":"5 dakika gecikme"}'::jsonb
 WHERE slug = 'twr2-delay';
UPDATE learning_steps SET
  title = 'Konuş: number 1',
  description = 'Sıra onda.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-num1';
UPDATE learning_steps SET
  title = 'Senaryo: iki çağrı birden',
  description = 'Önce finaldekine cevap.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-same-time';
UPDATE learning_steps SET
  title = 'Konuş: standby',
  description = 'Frekans dolu.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-standby';
UPDATE learning_steps SET
  title = 'Dinle: unable',
  description = 'Hemen kalkış yok.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Kule neden bekletiyor?","options":["Hava kapalı","Yakıt","Gelen trafik"],"correctOption":"Gelen trafik"}'::jsonb
 WHERE slug = 'twr2-unable';
UPDATE learning_steps SET
  title = 'Konuş: inenin ardından',
  description = 'Sıralı kalkış.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-after';
UPDATE learning_steps SET
  title = 'Senaryo: iz türbülansı',
  description = 'Ağır uçağın arkası.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-wake';
UPDATE learning_steps SET
  title = 'Konuş: low approach',
  description = 'Alçak geçiş.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'twr2-low';
UPDATE learning_steps SET
  title = 'Aşama 3: PAN ve yoğun trafik',
  description = 'PAN PAN, gecikme, kısa kule konuşması.',
  content_html = '<p>PAN PAN üç kez: acil vardır, hayati tehlike yoktur. Yoğun saatte kule kısa konuşur, sıra verir, delay söyler. MAYDAY henüz değil. Frekans İngilizce.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-intro';
UPDATE learning_steps SET
  title = 'Dinle: PAN PAN',
  description = 'Acil, hayati tehlike yok.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"Bu çağrı ne?","options":["Rutin taksi","Uçak düşüyor","Acil, hayati tehlike yok"],"correctOption":"Acil, hayati tehlike yok"}'::jsonb
 WHERE slug = 'twr3-pan-q';
UPDATE learning_steps SET
  title = 'Konuş: PAN aldım',
  description = 'AJet’e öncelik.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-pan-ack';
UPDATE learning_steps SET
  title = 'Senaryo: PAN öncelik',
  description = 'Final dolu, PAN iner.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-pan-priority';
UPDATE learning_steps SET
  title = 'Konuş: PAN yakıt',
  description = 'Minimum fuel.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-pan-fuel';
UPDATE learning_steps SET
  title = 'Dinle: kuş çarpması',
  description = 'PAN, dönüş talebi.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"Kule ne bekler?","options":["Donus ve öncelikli iniş","Normal taksi","Squawk 2000"],"correctOption":"Donus ve öncelikli iniş"}'::jsonb
 WHERE slug = 'twr3-bird';
UPDATE learning_steps SET
  title = 'Konuş: geri dön',
  description = 'Pist 03, iniş izni.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-return';
UPDATE learning_steps SET
  title = 'Senaryo: yoğun saat',
  description = 'Dört uçak, bir PAN.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-busy';
UPDATE learning_steps SET
  title = 'Konuş: delay',
  description = 'On dakika trafik.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-delay';
UPDATE learning_steps SET
  title = 'Dinle: unable',
  description = 'Şimdilik kalkış yok.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"Ne yapamaz?","options":["Taksi","Hemen kalkış","İniş"],"correctOption":"Hemen kalkış"}'::jsonb
 WHERE slug = 'twr3-unable-q';
UPDATE learning_steps SET
  title = 'Konuş: unable',
  description = 'Pozisyonda bekle.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-unable';
UPDATE learning_steps SET
  title = 'Senaryo: kırık radyo',
  description = 'Say again.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-radio';
UPDATE learning_steps SET
  title = 'Konuş: say again',
  description = 'Anlaşılmadı.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-sayagain';
UPDATE learning_steps SET
  title = 'Dinle: 7600',
  description = 'Radyo arızası, henüz MAYDAY değil.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"Ne anlama gelir?","options":["Kacirma","Yakıt bitti","Radyo arızası"],"correctOption":"Radyo arızası"}'::jsonb
 WHERE slug = 'twr3-7600';
UPDATE learning_steps SET
  title = 'Konuş: ışık işareti',
  description = 'NORDO, yeşil ışık.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-light';
UPDATE learning_steps SET
  title = 'Senaryo: ambulans',
  description = 'PAN medical, iniş sonrası.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-medical';
UPDATE learning_steps SET
  title = 'Konuş: ambulans yolda',
  description = 'Bravo’da ekip.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-ambulance';
UPDATE learning_steps SET
  title = 'Dinle: hold',
  description = 'Golf’ta bekleme.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"Nerede bekler?","options":["Golf","Pist ortası","Apron kapalı"],"correctOption":"Golf"}'::jsonb
 WHERE slug = 'twr3-hold';
UPDATE learning_steps SET
  title = 'Konuş: Golf’ta bekle',
  description = 'Yoğun akış.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-holdgolf';
UPDATE learning_steps SET
  title = 'Senaryo: herkesi hızlandır',
  description = 'PAN inişte, arkadakiler boşaltsın.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-expedite-all';
UPDATE learning_steps SET
  title = 'Konuş: ıslak pist',
  description = 'Dikkat uyarısı.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-caution';
UPDATE learning_steps SET
  title = 'Dinle: priority',
  description = 'PAN sırası birinci.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"Sıra?","options":["Taksi","Birinci, öncelik","Sonuncu"],"correctOption":"Birinci, öncelik"}'::jsonb
 WHERE slug = 'twr3-priority';
UPDATE learning_steps SET
  title = 'Konuş: number 1 priority',
  description = 'PAN’e iniş izni.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-num1-pan';
UPDATE learning_steps SET
  title = 'Senaryo: break break',
  description = 'Çakışan çağrılar.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-break';
UPDATE learning_steps SET
  title = 'Konuş: break break',
  description = 'Frekansı kes, PAN’e yer aç.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'twr3-break-say';
UPDATE learning_steps SET
  title = 'Aşama 4: MAYDAY',
  description = 'Motor, basınç, hidrolik. Yolcu, yakıt, kargo. İtfaiye.',
  content_html = '<p>MAYDAY üç kez: hayati tehlike. Kule pisti verir, acil ekipleri çağırır; <em>souls on board</em>, kalan yakıt ve tehlikeli madde sorar. Sen de İngilizce sor, Türkçe düşün.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-intro';
UPDATE learning_steps SET
  title = 'Dinle: MAYDAY',
  description = 'Hayati tehlike.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Ne anlama gelir?","options":["Sadece gecikme","Rutin","Hayati tehlike, öncelik"],"correctOption":"Hayati tehlike, öncelik"}'::jsonb
 WHERE slug = 'twr4-mayday-q';
UPDATE learning_steps SET
  title = 'Konuş: MAYDAY aldım',
  description = 'Pist senin.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-mayday-ack';
UPDATE learning_steps SET
  title = 'Senaryo: motor kaybı',
  description = 'Öteki finalde, MAYDAY öncelikli.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-engine';
UPDATE learning_steps SET
  title = 'Konuş: yolcu sayısı',
  description = 'Souls, yakıt, tehlikeli madde sor.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-souls';
UPDATE learning_steps SET
  title = 'Dinle: souls',
  description = 'Canlı sayısı.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Kule ne öğrenir?","options":["Yolcu+ekip sayısı 148","Yakıt 148 ton","Pist 148"],"correctOption":"Yolcu+ekip sayısı 148"}'::jsonb
 WHERE slug = 'twr4-souls-q';
UPDATE learning_steps SET
  title = 'Konuş: kalan yakıt',
  description = 'Fuel remaining.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-fuel';
UPDATE learning_steps SET
  title = 'Senaryo: hidrolik',
  description = 'Takım inmeyebilir, köpük hazır.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-hydro';
UPDATE learning_steps SET
  title = 'Konuş: köpük hazır',
  description = 'İtfaiye pistte.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-foam';
UPDATE learning_steps SET
  title = 'Dinle: tehlikeli madde',
  description = 'Kargo sorusu neden?',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Kule neden sorar?","options":["Squawk","Acil ekip neyle mücadele edecek","Rutin check-in"],"correctOption":"Acil ekip neyle mücadele edecek"}'::jsonb
 WHERE slug = 'twr4-cargo';
UPDATE learning_steps SET
  title = 'Konuş: dangerous goods',
  description = 'Kargo var mı diye sor.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-goods';
UPDATE learning_steps SET
  title = 'Senaryo: basınç kaybı',
  description = 'Acil alçalma.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-press';
UPDATE learning_steps SET
  title = 'Konuş: emergency descent',
  description = 'Alçal, pist senin.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-descend';
UPDATE learning_steps SET
  title = 'Dinle: 7700',
  description = 'Genel acil transponder.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Kod ne?","options":["Radyo arızası 7600","Korsanlik 7500","Genel acil durum"],"correctOption":"Genel acil durum"}'::jsonb
 WHERE slug = 'twr4-7700';
UPDATE learning_steps SET
  title = 'Konuş: squawk 7700',
  description = 'Acil kodu.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-squawk';
UPDATE learning_steps SET
  title = 'Senaryo: acil ekipler',
  description = 'Kule itfaiye ve ambulansı çağırır.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-services';
UPDATE learning_steps SET
  title = 'Konuş: acil ekipler',
  description = 'Pist 03, motor arızası.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-services-say';
UPDATE learning_steps SET
  title = 'Dinle: tahliye',
  description = 'Pistte boşaltma.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Pilot ne yapabilir?","options":["Pistte tahliye","Tekrar kalkış","IVAO kapat"],"correctOption":"Pistte tahliye"}'::jsonb
 WHERE slug = 'twr4-evac';
UPDATE learning_steps SET
  title = 'Konuş: tahliye',
  description = 'Ekipler yanında.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-evac-say';
UPDATE learning_steps SET
  title = 'Senaryo: düşmek üzere',
  description = 'Her trafik dursun, pist onun.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-crash';
UPDATE learning_steps SET
  title = 'Konuş: pist senin',
  description = 'Ekipler yolda.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-yours';
UPDATE learning_steps SET
  title = 'Dinle: iniş takımı',
  description = 'Hidrolik teyidi.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Kule neyi teyit eder?","options":[" squawk 2000","İniş takımları","Yolcu yemegi"],"correctOption":"İniş takımları"}'::jsonb
 WHERE slug = 'twr4-gear';
UPDATE learning_steps SET
  title = 'Konuş: takım aşağıda mı',
  description = 'Confirm gear down.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-gear-say';
UPDATE learning_steps SET
  title = 'Senaryo: tam MAYDAY listesi',
  description = 'Pist, 7700, yolcu, yakıt, kargo, ekipler.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-full';
UPDATE learning_steps SET
  title = 'Konuş: tam MAYDAY paketi',
  description = 'Hepsini bir nefeste sor.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-full-say';
UPDATE learning_steps SET
  title = 'Canlı: IVAO sektör',
  description = 'Hattı bitirince sektör dene.',
  content_html = '<p>Bu adım IVAO. Giriş yapanlar hattı bitirince sektör veya gerçek ATC deneyebilir. Önce dinle.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'twr4-ivao';
UPDATE learning_steps SET
  title = 'Aşama 1: Yer ve izinler',
  description = 'Taksi, line up, kalkış ve iniş read-back.',
  content_html = '<p>Pilot tarafı: kuleyi ara, talimatı İngilizce tekrarla (read-back). AJet sözlü olarak Anadolu’dur. Yüzde 50 yakınlık yeter.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-intro';
UPDATE learning_steps SET
  title = 'Dinle: ilk çağrı',
  description = 'Birim, çağrı, konum, talep.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Pilot ne istiyor?","options":["Go around","Pushback and start-up","Landing"],"correctOption":"Pushback and start-up"}'::jsonb
 WHERE slug = 'plt1-who';
UPDATE learning_steps SET
  title = 'Konuş: geri itiş talebi',
  description = 'Anadolu 221 kuleyi arar.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-push';
UPDATE learning_steps SET
  title = 'Konuş: taksi talebi',
  description = 'SunExpress ground’u arar.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-taxi';
UPDATE learning_steps SET
  title = 'Dinle: taksi read-back',
  description = 'Talimatı çağrı ile tekrarla.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Dogru read-back?","options":["Roger","Cleared for take-off","Taxi holding point 03 via Bravo, hold short, AJet 221"],"correctOption":"Taxi holding point 03 via Bravo, hold short, AJet 221"}'::jsonb
 WHERE slug = 'plt1-rb-taxi';
UPDATE learning_steps SET
  title = 'Konuş: hold short',
  description = 'Çizgide bekle, tekrarla.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-hold';
UPDATE learning_steps SET
  title = 'Konuş: line up read-back',
  description = 'Pegasus piste girer.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-lineup';
UPDATE learning_steps SET
  title = 'Senaryo: henüz kalkma',
  description = 'Line up, take-off değil.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-not-to';
UPDATE learning_steps SET
  title = 'Konuş: kalkış read-back',
  description = 'AJet kalkış iznini tekrarla.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-to';
UPDATE learning_steps SET
  title = 'Dinle: iniş izni',
  description = 'Rüzgâr + pist + cleared to land.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Ne yapacaksin?","options":["Hold short","İniş iznini read-back","Go around hemen"],"correctOption":"İniş iznini read-back"}'::jsonb
 WHERE slug = 'plt1-land-q';
UPDATE learning_steps SET
  title = 'Konuş: iniş read-back',
  description = 'Turkish 1452.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-land';
UPDATE learning_steps SET
  title = 'Konuş: pist boş',
  description = 'Vacated raporu.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-vacate';
UPDATE learning_steps SET
  title = 'Konuş: Charlie',
  description = 'Taksi yolu C.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-charlie';
UPDATE learning_steps SET
  title = 'Senaryo: AJet söyle',
  description = 'Çağrı işareti Anadolu.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-anadolu';
UPDATE learning_steps SET
  title = 'Dinle: SunExpress',
  description = 'Şirketi tanı.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Sirket?","options":["SunExpress","Pegasus","THY"],"correctOption":"SunExpress"}'::jsonb
 WHERE slug = 'plt1-sxs';
UPDATE learning_steps SET
  title = 'Konuş: ready',
  description = 'Holding’de hazırım.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-ready';
UPDATE learning_steps SET
  title = 'Konuş: Alpha Bravo Charlie',
  description = 'Alfabe, aksanla yeter.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-abc';
UPDATE learning_steps SET
  title = 'Senaryo: rüzgârı al',
  description = 'İniş iznini tekrarla.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-wind';
UPDATE learning_steps SET
  title = 'Konuş: ground',
  description = '121.7’ye geç.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-ground';
UPDATE learning_steps SET
  title = 'Dinle: hold short',
  description = 'Pisti geçme.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":1,"question":"Ne yapmazsin?","options":["Hemen kalkarim","Go around","Pisti geçmem"],"correctOption":"Pisti geçmem"}'::jsonb
 WHERE slug = 'plt1-hold-q';
UPDATE learning_steps SET
  title = 'Konuş: 102 Juliet',
  description = 'Çağrı harfi Juliet.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":1}'::jsonb
 WHERE slug = 'plt1-juliet';
UPDATE learning_steps SET
  title = 'Konuş: downwind',
  description = 'Pozisyon raporu.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-downwind';
UPDATE learning_steps SET
  title = 'Dinle: number 2',
  description = 'Önünde biri var, yaklaşmaya devam.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Ne yaparsin?","options":["Yaklasmaya devam, İkinci sıradasin","Kalkış","Pistte dur"],"correctOption":"Yaklasmaya devam, İkinci sıradasin"}'::jsonb
 WHERE slug = 'plt2-n2';
UPDATE learning_steps SET
  title = 'Konuş: downwind uzatıyorum',
  description = 'Read-back.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-extend';
UPDATE learning_steps SET
  title = 'Konuş: final',
  description = 'Final raporu.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-final';
UPDATE learning_steps SET
  title = 'Senaryo: go around',
  description = 'Pist meşgul, pas geç.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-ga';
UPDATE learning_steps SET
  title = 'Konuş: going around',
  description = 'Pas geç read-back.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-ga-rb';
UPDATE learning_steps SET
  title = 'Konuş: orbit',
  description = 'Sol tur.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-orbit';
UPDATE learning_steps SET
  title = 'Dinle: iz türbülansı',
  description = '777’nin arkası.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Ne dikkat?","options":["Yakıt"," squawk","Iz turbulansi"],"correctOption":"Iz turbulansi"}'::jsonb
 WHERE slug = 'plt2-wake';
UPDATE learning_steps SET
  title = 'Konuş: trafiği gördüm',
  description = 'Traffic in sight.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-traffic-in-sight';
UPDATE learning_steps SET
  title = 'Senaryo: number 1',
  description = 'Sıra sende, final bildir.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-num1';
UPDATE learning_steps SET
  title = 'Konuş: continuing',
  description = 'Yaklaşmaya devam.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-continue';
UPDATE learning_steps SET
  title = 'Konuş: Whiskey Yankee Zulu',
  description = 'W Y Z.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-wyz';
UPDATE learning_steps SET
  title = 'Dinle: behind landing',
  description = 'İnenin ardından kalk.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":2,"question":"Ne zaman kalkarsin?","options":["Hicbir zaman","İnen A320''den sonra","Hemen şimdi uzerinden"],"correctOption":"İnen A320''den sonra"}'::jsonb
 WHERE slug = 'plt2-behind';
UPDATE learning_steps SET
  title = 'Konuş: behind landing',
  description = 'Kalkış iznini tekrarla.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-behind-rb';
UPDATE learning_steps SET
  title = 'Senaryo: kule iki uçağa',
  description = 'Sana extend dedi, ona iniş.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-two-hear';
UPDATE learning_steps SET
  title = 'Konuş: yol veriyorum',
  description = 'Giving way.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":2}'::jsonb
 WHERE slug = 'plt2-giveway-rb';
UPDATE learning_steps SET
  title = 'Aşama 3: PAN PAN',
  description = 'Tıbbi, yakıt, kuş, radyo.',
  content_html = '<p>PAN PAN üç kez, sonra çağrı, sonra sorun. Kule öncelik verir. Bu MAYDAY değildir. Cümleler İngilizce.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-intro';
UPDATE learning_steps SET
  title = 'Dinle: PAN',
  description = 'Acil, MAYDAY değil.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"Ne çağrı?","options":["Uçak dustu","PAN, öncelik istenir","Rutin"],"correctOption":"PAN, öncelik istenir"}'::jsonb
 WHERE slug = 'plt3-pan-q';
UPDATE learning_steps SET
  title = 'Konuş: PAN tıbbi',
  description = 'Öncelikli iniş iste.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-pan-med';
UPDATE learning_steps SET
  title = 'Konuş: PAN yakıt',
  description = 'Minimum fuel.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-pan-fuel';
UPDATE learning_steps SET
  title = 'Senaryo: kuş çarpması',
  description = 'Dönüş iste, PAN.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-bird';
UPDATE learning_steps SET
  title = 'Konuş: geri dönüyorum',
  description = 'İniş iznini tekrarla.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-return';
UPDATE learning_steps SET
  title = 'Konuş: say again',
  description = 'Kuleyi duymadın.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-sayagain';
UPDATE learning_steps SET
  title = 'Dinle: delay',
  description = 'On dakika bekle.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"Ne olur?","options":["Hemen in","Mayday","10 dakika gecikme"],"correctOption":"10 dakika gecikme"}'::jsonb
 WHERE slug = 'plt3-delay';
UPDATE learning_steps SET
  title = 'Senaryo: unable',
  description = 'Kule kalkış vermiyor.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-unable';
UPDATE learning_steps SET
  title = 'Konuş: Golf’ta bekliyorum',
  description = 'Yoğun trafik.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-hold';
UPDATE learning_steps SET
  title = 'Konuş: öncelik read-back',
  description = 'PAN cevabını tekrarla.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-priority-rb';
UPDATE learning_steps SET
  title = 'Dinle: 7600',
  description = 'Radyo arızası.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":3,"question":"7600 nedir?","options":["Radyo arızası","Genel acil 7700","Korsanlik"],"correctOption":"Radyo arızası"}'::jsonb
 WHERE slug = 'plt3-7600';
UPDATE learning_steps SET
  title = 'Senaryo: ambulans',
  description = 'İniş sonrası Bravo.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-medical-land';
UPDATE learning_steps SET
  title = 'Konuş: ident',
  description = 'Radar için ident.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-ident';
UPDATE learning_steps SET
  title = 'Konuş: ıslak pist',
  description = 'Caution’ı tekrarla.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-wet';
UPDATE learning_steps SET
  title = 'Senaryo: break',
  description = 'PAN varken konuşmayı kes.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-break';
UPDATE learning_steps SET
  title = 'Konuş: bekliyorum',
  description = 'Standby read-back.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":3}'::jsonb
 WHERE slug = 'plt3-standby-rb';
UPDATE learning_steps SET
  title = 'Aşama 4: MAYDAY',
  description = 'Motor, basınç, hidrolik. Kule yolcu, yakıt, kargo sorar.',
  content_html = '<p>MAYDAY üç kez, sonra niyet. Kule pist verir; yolcu sayısı, yakıt ve kargo sorar. Cevabın İngilizce olsun.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-intro';
UPDATE learning_steps SET
  title = 'Konuş: MAYDAY motor',
  description = 'Üç kez MAYDAY, sonra niyet.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-mayday';
UPDATE learning_steps SET
  title = 'Dinle: pist senin',
  description = 'Ekipler yolda.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Ne var?","options":["Delay 10","Pist ve acil ekipler","Taksi Golf"],"correctOption":"Pist ve acil ekipler"}'::jsonb
 WHERE slug = 'plt4-yours';
UPDATE learning_steps SET
  title = 'Konuş: yolcu–yakıt–kargo',
  description = 'Kule üçünü birden sorar.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-souls';
UPDATE learning_steps SET
  title = 'Senaryo: hidrolik',
  description = 'Köpük ve uzun pist iste.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-hydro';
UPDATE learning_steps SET
  title = 'Konuş: basınç kaybı',
  description = 'Acil alçalma.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-press';
UPDATE learning_steps SET
  title = 'Konuş: squawk 7700',
  description = 'Acil kodu.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-7700';
UPDATE learning_steps SET
  title = 'Dinle: kargo sorusu',
  description = 'Varsa madde, yoksa none.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Ne cevaplarsin?","options":["Varsa madde, yoksa none","Pist numarasi","Yemek siparisi"],"correctOption":"Varsa madde, yoksa none"}'::jsonb
 WHERE slug = 'plt4-goods-q';
UPDATE learning_steps SET
  title = 'Konuş: tehlikeli madde yok',
  description = 'No dangerous goods.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-none';
UPDATE learning_steps SET
  title = 'Senaryo: tahliye',
  description = 'Pistte duman, boşalt.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-evac';
UPDATE learning_steps SET
  title = 'Konuş: tahliye ediyorum',
  description = 'Evacuate read-back.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-evac-say';
UPDATE learning_steps SET
  title = 'Konuş: takım aşağıda',
  description = 'Gear down.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-gear';
UPDATE learning_steps SET
  title = 'Dinle: köpük',
  description = 'İtfaiye hazır.',
  content_html = '<p>Karşı tarafı dinle. <strong>Frekanstaki konuşma İngilizce</strong>; soru ve şıkların anlamı Türkçe.</p>',
  configuration = configuration || '{"stage":4,"question":"Kim hazır?","options":["Catering","Pushback","İtfaiye köpüğü"],"correctOption":"İtfaiye köpüğü"}'::jsonb
 WHERE slug = 'plt4-foam';
UPDATE learning_steps SET
  title = 'Senaryo: kule her şeyi sordu',
  description = 'Üç sayıyı bir cümlede ver.',
  content_html = '<p>Durumu oku. Doğru cümleyi seç; <strong>şıklar İngilizce kule/pilot konuşması</strong>.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-full';
UPDATE learning_steps SET
  title = 'Konuş: yolcu yakıt kargo',
  description = 'Tek nefeste cevapla.',
  content_html = '<p>Mikrofonu aç. <strong>Söyleyeceğin kalıp İngilizce</strong> — ekranda yazılı. Yüzde 50 yakınsa geçer.</p>',
  configuration = configuration || '{"stage":4}'::jsonb
 WHERE slug = 'plt4-full-say';

UPDATE learning_steps SET configuration = coalesce(configuration, '{}'::jsonb) || '{"stage":1}'::jsonb
 WHERE slug IN ('kule-kimdir','turkiyede-atc','ivao-rating','twr-alfabe','plt-alfabe')
   AND status = 'PUBLISHED';
