INSERT INTO training_simulations (aircraft_id, code, title, description, sim_type, config)
SELECT id, 'C172-COLD-START', 'C172 soğuk start',
       'Eğitim uçağı: batarya, yakıt, karışım, magneto. Yanlış sıra motoru öldürür veya kazaya götürür.',
       'TUTORIAL',
       '{"expected":[{"part":"C172-001","value":"ON","hint":"Önce Master BAT/ALT aç."},{"part":"C172-003","value":"BOTH","hint":"Yakıt seçici BOTH."},{"part":"C172-005","value":"RICH","hint":"Karışım tam zengin (ileri)."},{"part":"C172-006","value":"OFF","hint":"Karbüratör ısı şimdilik OFF."},{"part":"C172-002","value":"BOTH","hint":"Magneto BOTH, sonra START."}],"crash":[{"when":{"C172-024":"ON","C172-004":"FULL"},"message":"Park freni açıkken tam gaz. Uçak gitmez, lastik dumanı — senaryo CRASH."},{"when":{"C172-005":"CUTOFF","C172-002":"BOTH"},"message":"Karışım IDLE CUT-OFF iken magneto BOTH. Motor ölür."}]}'::jsonb
FROM aircraft WHERE code = 'C172';

INSERT INTO training_simulations (aircraft_id, code, title, description, sim_type, config)
SELECT id, 'C172-SHORT-CIRCUIT', 'C172 kısa meydan turu',
       'Flap, trim, gaz, gear yok (sabit takım). Yanlış flap/hızda stall — düşüş.',
       'SHORT_FLIGHT',
       '{"expected":[{"part":"C172-024","value":"OFF","hint":"Park frenini bırak."},{"part":"C172-007","value":"10","hint":"Kalkış flap 10."},{"part":"C172-004","value":"FULL","hint":"Tam gaz, rotate."},{"part":"C172-007","value":"0","hint":"Pozitif tırmanışta flap yukarı."},{"part":"C172-007","value":"20","hint":"Finalde flap 20."},{"part":"C172-004","value":"IDLE","hint":"Yere yakın gaz kes, flare."}],"crash":[{"when":{"C172-004":"IDLE","C172-007":"0"},"message":"Finalde flapsız ve gaz kesik. Stall — uçak düştü."}]}'::jsonb
FROM aircraft WHERE code = 'C172';

INSERT INTO training_simulations (aircraft_id, code, title, description, sim_type, config)
SELECT id, 'B737-COLD-START', '737 cold and dark',
       'Batarya, yakıt pompaları, APU, motor start. Yerde gear up = burun çöker.',
       'TUTORIAL',
       '{"expected":[{"part":"B737-001","value":"ON","hint":"Electrical: BAT/GEN hazır."},{"part":"B737-003","value":"ON","hint":"Fuel pompaları ON."},{"part":"B737-006","value":"ON","hint":"APU çalıştır."},{"part":"B737-007","value":"GRD","hint":"Engine start GRD."},{"part":"B737-028","value":"IDLE","hint":"İtki idle, motorlar dönüyor."}],"crash":[{"when":{"B737-039":"UP"},"message":"Yerde landing gear UP. Burun çöktü — CRASH."},{"when":{"B737-032":"ON","B737-028":"TOGA"},"message":"Park freni ON iken TOGA. Lastikler ve kuyruk — CRASH."}]}'::jsonb
FROM aircraft WHERE code = 'B737';

INSERT INTO training_simulations (aircraft_id, code, title, description, sim_type, config)
SELECT id, 'B737-SHORT-FLIGHT', '737 kısa uçuş',
       'Flap, trim, thrust, gear. Pozitif rate sonra gear up; yerde gear up yasak.',
       'SHORT_FLIGHT',
       '{"expected":[{"part":"B737-032","value":"OFF","hint":"Park freni OFF."},{"part":"B737-030","value":"5","hint":"Kalkış flap 5."},{"part":"B737-028","value":"TOGA","hint":"Takeoff thrust."},{"part":"B737-039","value":"UP","hint":"Pozitif rate, gear up."},{"part":"B737-039","value":"DOWN","hint":"Finalde gear down."},{"part":"B737-030","value":"30","hint":"İniş flap."}],"crash":[{"when":{"B737-039":"UP","B737-028":"IDLE"},"message":"Düşük itki ve gear up düşük irtifada. Stall — düştü."}]}'::jsonb
FROM aircraft WHERE code = 'B737';

INSERT INTO training_simulations (aircraft_id, code, title, description, sim_type, config)
SELECT id, 'B737-ENGINE-FIRE', '737 motor yangını',
       'Yangın panelini kullan. Yanlış sırada söndürücü bitmeden kesme — başarısız.',
       'FAILURE',
       '{"expected":[{"part":"B737-009","value":"DISCHARGE","hint":"Engine fire: master kes, discharge."},{"part":"B737-028","value":"IDLE","hint":"Etkilenen taraf itki idle/cut."}],"crash":[{"when":{"B737-028":"TOGA"},"message":"Yangında TOGA. Yangın yayıldı — CRASH."}]}'::jsonb
FROM aircraft WHERE code = 'B737';

INSERT INTO training_simulations (aircraft_id, code, title, description, sim_type, config)
SELECT id, 'A350-COLD-START', 'A350 elektrik ve APU',
       'Airbus: BAT, APU MASTER+START, ENG MASTER. Side-stick felsefesi; yerde gear up yine ölüm.',
       'TUTORIAL',
       '{"expected":[{"part":"A350-001","value":"ON","hint":"ELEC: BAT ve GEN."},{"part":"A350-003","value":"ON","hint":"Fuel pompaları."},{"part":"A350-006","value":"START","hint":"APU MASTER sonra START."},{"part":"A350-007","value":"ON","hint":"ENG MASTER 1/2."},{"part":"A350-026","value":"IDLE","hint":"Thrust idle (FADEC)."}],"crash":[{"when":{"A350-037":"UP"},"message":"Yerde gear up. Airbus da yerçekimine yenik — CRASH."}]}'::jsonb
FROM aircraft WHERE code = 'A350';

INSERT INTO training_simulations (aircraft_id, code, title, description, sim_type, config)
SELECT id, 'A350-SHORT-FLIGHT', 'A350 kısa uçuş',
       'Flap/slat, thrust, gear. Yanlış konfigürasyon düşürür.',
       'SHORT_FLIGHT',
       '{"expected":[{"part":"A350-029","value":"OFF","hint":"Park freni OFF."},{"part":"A350-028","value":"1+F","hint":"Kalkış flap/slat."},{"part":"A350-026","value":"FLX","hint":"Kalkış itki (FLX/TOGA)."},{"part":"A350-037","value":"UP","hint":"Positive climb, gear up."},{"part":"A350-037","value":"DOWN","hint":"Final gear down."},{"part":"A350-028","value":"FULL","hint":"İniş flap full."}],"crash":[{"when":{"A350-026":"IDLE","A350-028":"0"},"message":"Yapılandırılmamış alçalış. Stall — düştü."}]}'::jsonb
FROM aircraft WHERE code = 'A350';
