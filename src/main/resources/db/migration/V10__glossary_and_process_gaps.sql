-- Kaynak: IVAO wiki (rating saat/sınav), SHGM eğitim süreci, ICAO Doc 9432 fraseoloji.
-- Mevcut adımlara eksik "bu bu demek" terimleri eklenir; sıra bozulmaz.

UPDATE learning_steps
   SET content_html = content_html || '<p><strong>IVAO notu:</strong> Observer saati ATC saatine sayılmaz. AS3 teorik kayıtın 2 hafta sonrası + 25 saat. ADC için AS3 üzerinden 60 gün, teorik+pratik en az 75/100, aktif division.</p>'
 WHERE slug = 'ivao-rating';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Observer saati', 'Frekansı dinlemek ATC saatine sayılmaz; ADC için Aurora’da aktif kule saati gerekir.', 4 FROM learning_steps WHERE slug = 'ivao-rating';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, '75/100', 'IVAO ileri sınavlarda teorik VE pratik en az 75.', 5 FROM learning_steps WHERE slug = 'ivao-rating';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, '60 gün AS3', 'ADC pratik sınavına başvurmak için AS3 üzerinden en az 60 gün.', 6 FROM learning_steps WHERE slug = 'ivao-rating';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Affirm', 'Evet. "Yes" veya "affirmative" kullanılmaz (negative ile karışmasın).', 4 FROM learning_steps WHERE slug = 'dinle-genel-rt';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Negative', 'Hayır / izin yok / doğru değil.', 5 FROM learning_steps WHERE slug = 'dinle-genel-rt';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Roger ≠ read-back', 'Roger sadece "mesajı aldım". Talimat tekrarı (pist, irtifa, squawk) değildir.', 6 FROM learning_steps WHERE slug = 'dinle-genel-rt';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Unable', 'Uymuyorum / yapamıyorum — gerekçe ile.', 7 FROM learning_steps WHERE slug = 'dinle-genel-rt';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Contact vs Monitor', 'Contact = o birimle konuş. Monitor = sadece dinle, henüz konuşma.', 8 FROM learning_steps WHERE slug = 'dinle-genel-rt';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Give way', 'Şu uçağa yol ver.', 3 FROM learning_steps WHERE slug = 'konus-ground';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Cross runway', 'Pisti geçme izni — TWR verir.', 4 FROM learning_steps WHERE slug = 'konus-ground';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Cancel take-off clearance', 'Kalkış izni iptal (acil).', 3 FROM learning_steps WHERE slug = 'kalkis-line-up';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Wake turbulence', 'Öndeki büyük uçağın iz türbülansı uyarısı.', 4 FROM learning_steps WHERE slug = 'kalkis-line-up';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Report final', 'Final ayağında bildir.', 3 FROM learning_steps WHERE slug = 'senaryo-inis';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Expedite vacating', 'Pisti hızlı boşalt.', 4 FROM learning_steps WHERE slug = 'senaryo-inis';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'QFE', 'Pist seviyesine göre basınç (QNH değil).', 3 FROM learning_steps WHERE slug = 'kalkis-diyalogu';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'METAR / TAF', 'Anlık hava raporu / tahmin.', 4 FROM learning_steps WHERE slug = 'kalkis-diyalogu';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'NOTAM', 'Havacılara geçici bildirge.', 5 FROM learning_steps WHERE slug = 'kalkis-diyalogu';

-- Pilot: SHGM gerçeği (SPL, Class 2 PPL, Türkiye EASA ülkesi değil)
UPDATE learning_steps
   SET content_html = content_html || '<p><strong>SHGM notu:</strong> Türkiye EASA ülkesi değildir; lisans SHT-FCL ile EASA’ya benzer ama otomatik EASA lisansı değildir. PPL için Sınıf 2 sağlık, CPL/ATPL için Sınıf 1. PPL asgari 45 saat, CPL 200 (modüler), ATPL 1500 saat. ATPL teorisi 14 ders, geçme 75.</p>'
 WHERE slug = 'turkiyede-lisans';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'SPL', 'Öğrenci Pilot Lisansı — solo öncesi / öğretmen gözetimi.', 6 FROM learning_steps WHERE slug = 'turkiyede-lisans';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Sınıf 1 / Sınıf 2', 'CPL-ATPL: Sınıf 1 sağlık. PPL: Sınıf 2. Class 1 en başta kariyer için kritik.', 7 FROM learning_steps WHERE slug = 'turkiyede-lisans';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'SHT-FCL ≠ EASA lisansı', 'Türkiye mevzuatı EASA’ya benzer; EASA tescilli uçağa binmek için ayrıca çevrim gerekir.', 8 FROM learning_steps WHERE slug = 'turkiyede-lisans';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, '45 / 200 / 1500 saat', 'PPL / CPL (modüler) / ATPL asgari uçuş tecrübesi (SHGM).', 9 FROM learning_steps WHERE slug = 'turkiyede-lisans';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'FS3 2 hafta', 'İlk teorik (FS3) kayıtın en az 2 hafta sonrası + 25 saat.', 3 FROM learning_steps WHERE slug = 'ivao-pilot-rating';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Pilot saati ≠ ATC saati', 'PP sınavı için IVAO’da pilot saati; kule saati sayılmaz.', 4 FROM learning_steps WHERE slug = 'ivao-pilot-rating';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Say again', 'Tekrar söyle — "repeat" denmez.', 3 FROM learning_steps WHERE slug = 'dinle-ilk-cagri-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'With you', 'Bazı bölgelerde "sizinle bağlıyım"; ICAO standardı değildir.', 4 FROM learning_steps WHERE slug = 'dinle-ilk-cagri-pilot';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Niner / Tree / Fife', 'ICAO rakam: 9 niner, 3 tree, 5 fife (karışmasın diye).', 2 FROM learning_steps WHERE slug = 'konus-pushback';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Squawk 7700', 'Genel acil durum transponder kodu.', 3 FROM learning_steps WHERE slug = 'acil-durum';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Squawk 7600', 'Radyo arızası (NORDO).', 4 FROM learning_steps WHERE slug = 'acil-durum';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Squawk 7500', 'Korsanlık — sözlü teyit etme.', 5 FROM learning_steps WHERE slug = 'acil-durum';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, '121.5', 'Acil durum VHF frekansı.', 6 FROM learning_steps WHERE slug = 'acil-durum';

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Hold / holding', 'Bekleme deseni.', 4 FROM learning_steps WHERE slug = 'canli-pratik-ivao-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Diversion', 'Alternatif meydana sapma.', 5 FROM learning_steps WHERE slug = 'canli-pratik-ivao-pilot';
INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT id, 'Circuit', 'Meydan trafik turu (VFR pratik).', 6 FROM learning_steps WHERE slug = 'canli-pratik-ivao-pilot';
