-- Çağrı işaretlerini çeşitlendir + Charlie / Juliet konuşması.

UPDATE learning_steps
   SET configuration = replace(configuration::text, 'Turkish 123', 'Turkish 941')::jsonb
 WHERE slug IN (
   'twr-hold-short', 'konus-ground', 'konus-pushback', 'dinle-genel-rt',
   'kalkis-line-up', 'dinle-ilk-cagri-pilot', 'acil-durum'
 );

UPDATE learning_steps
   SET configuration = replace(configuration::text, 'Turkish 123', 'Turkish 1452')::jsonb
 WHERE slug IN (
   'twr-contact-tower', 'twr-cross', 'plt-taxi', 'plt-ready',
   'twr-dinle-taxi', 'readback-taksi', 'konus-line-up', 'plt-to-rb'
 );

UPDATE learning_steps
   SET configuration = replace(configuration::text, 'Turkish 123', 'Turkish 102J')::jsonb
 WHERE slug IN (
   'twr-vacate', 'twr-extend', 'plt-downwind', 'plt-final', 'plt-vacated',
   'plt-land-rb', 'plt-number2'
 );

UPDATE learning_steps
   SET configuration = replace(configuration::text, 'Turkish 123', 'Turkish 773')::jsonb
 WHERE slug IN (
   'twr-ident', 'twr-after-dep', 'plt-going-around', 'twr-downwind',
   'plt-dinle-taxi', 'twr-climb', 'plt-ga-listen', 'plt-mayday'
 );

UPDATE learning_steps
   SET configuration = replace(configuration::text, 'THY123', 'THY 941')::jsonb
 WHERE configuration::text LIKE '%THY123%';

UPDATE learning_steps
   SET content_html = replace(content_html, 'THY123', 'THY 941')
 WHERE content_html LIKE '%THY123%';

UPDATE learning_steps
   SET configuration = replace(configuration::text, 'Turkish 123', 'Turkish 941')::jsonb
 WHERE configuration::text LIKE '%Turkish 123%';

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: taxiway Charlie', 'twr-dinle-charlie', 'Havacılık alfabesi: Charlie.', 'LISTEN',
'<p>Charlie = C. Charli / Charley de aynı harf.</p>',
'{"promptText":"Turkish 102J, taxi via Charlie, hold short runway 03.","question":"Uçak hangi taxiway ile gidecek?","options":["Charlie","Alpha","Bravo"],"correctOption":"Charlie"}'::jsonb,
24, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-dinle-charlie');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: taxiway Charlie', 'twr-charlie', 'Charlie de, charli de geçer.', 'SPEAK',
'<p>Taxiway C = Charlie. Mikrofonu aç, Charlie de Charli de kabul.</p>',
'{"promptText":"Ground, Turkish 102J, request taxi.","expectedPhrase":"Turkish 102J taxi via Charlie hold short runway 03","acceptedPhrases":["taxi via charlie","taxi via charli","via charlie","charlie","charli","thy 102 juliet taxi via charlie"],"replyText":"Taxi via Charlie, hold short 03, Turkish 102J."}'::jsonb,
25, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-charlie');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: callsign 102 Juliet', 'plt-juliet', '102J = one zero two Juliet.', 'SPEAK',
'<p>Çağrı işaretin Turkish 102J. Juliet / Julie / J yeter.</p>',
'{"promptText":"You are Turkish 102J at stand 14.","expectedPhrase":"Ground Turkish 102J request taxi via Charlie","acceptedPhrases":["turkish 102 juliet request taxi charlie","thy 102 juliet taxi charlie","taxi via charlie","charlie","charli"],"replyText":"Turkish 102J, taxi via Charlie."}'::jsonb,
23, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'plt-juliet');
