-- ICAO A-Z alfabesi (kule + pilot) ve kisa konusma gruplari.

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Havacılık alfabesi', 'twr-alfabe', 'ICAO A-Z. Aksanla da söyle.', 'CONTENT',
'<p>Her harf bir kelime. Mükemmel İngilizce gerekmez: Alfa, Charli, Julie, Viski geçer.</p>
<ul>
<li><strong>A</strong> Alpha (Alfa)</li><li><strong>B</strong> Bravo</li><li><strong>C</strong> Charlie (Charli)</li>
<li><strong>D</strong> Delta</li><li><strong>E</strong> Echo (Eko)</li><li><strong>F</strong> Foxtrot (Fox)</li>
<li><strong>G</strong> Golf</li><li><strong>H</strong> Hotel (Otel)</li><li><strong>I</strong> India</li>
<li><strong>J</strong> Juliet (Julie)</li><li><strong>K</strong> Kilo</li><li><strong>L</strong> Lima</li>
<li><strong>M</strong> Mike</li><li><strong>N</strong> November</li><li><strong>O</strong> Oscar</li>
<li><strong>P</strong> Papa</li><li><strong>Q</strong> Quebec (Kebek)</li><li><strong>R</strong> Romeo</li>
<li><strong>S</strong> Sierra</li><li><strong>T</strong> Tango</li><li><strong>U</strong> Uniform</li>
<li><strong>V</strong> Victor</li><li><strong>W</strong> Whiskey (Viski)</li><li><strong>X</strong> X-ray</li>
<li><strong>Y</strong> Yankee</li><li><strong>Z</strong> Zulu</li>
</ul>',
NULL, 26, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-alfabe');

INSERT INTO learning_step_terms (step_id, term, meaning, sort_index)
SELECT s.id, v.term, v.meaning, v.sort_index
FROM learning_steps s
CROSS JOIN (VALUES
    ('Alpha', 'A', 0), ('Bravo', 'B', 1), ('Charlie', 'C — Charli de ayni', 2),
    ('Delta', 'D', 3), ('Echo', 'E — Eko', 4), ('Foxtrot', 'F — Fox', 5),
    ('Golf', 'G', 6), ('Hotel', 'H — Otel', 7), ('India', 'I', 8),
    ('Juliet', 'J — Julie', 9), ('Kilo', 'K', 10), ('Lima', 'L', 11),
    ('Mike', 'M', 12), ('November', 'N', 13), ('Oscar', 'O', 14),
    ('Papa', 'P', 15), ('Quebec', 'Q — Kebek', 16), ('Romeo', 'R', 17),
    ('Sierra', 'S', 18), ('Tango', 'T', 19), ('Uniform', 'U', 20),
    ('Victor', 'V', 21), ('Whiskey', 'W — Viski', 22), ('X-ray', 'X', 23),
    ('Yankee', 'Y', 24), ('Zulu', 'Z', 25)
) AS v(term, meaning, sort_index)
WHERE s.slug = 'twr-alfabe'
AND NOT EXISTS (SELECT 1 FROM learning_step_terms t WHERE t.step_id = s.id AND t.term = v.term);

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: taxiway Delta', 'twr-dinle-delta', 'Alfabeyi kulakta ayır.', 'LISTEN',
'<p>Delta = D. Delte de aynı harf.</p>',
'{"promptText":"Turkish 941, taxi via Delta, hold short runway 03.","question":"Hangi taxiway?","options":["Delta","Echo","Golf"],"correctOption":"Delta"}'::jsonb,
27, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-dinle-delta');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Dinle: hold short Whiskey', 'twr-dinle-whiskey', 'W = Whiskey / Viski.', 'LISTEN',
'<p>Whiskey harfi W. Viski de geçer.</p>',
'{"promptText":"Turkish 1452, hold short Whiskey.","question":"Nerede bekleyecek?","options":["Whiskey","Yankee","Zulu"],"correctOption":"Whiskey"}'::jsonb,
28, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-dinle-whiskey');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Alpha Bravo Charlie', 'twr-abc', 'A B C. Alfa / Charli yeter.', 'SPEAK',
'<p>Üç harf. İkisini net söylersen geçer (%60).</p>',
'{"promptText":"Say taxiway letters A, B and C.","expectedPhrase":"Alpha Bravo Charlie","acceptedPhrases":["alfa bravo charli","alpha bravo","alfa charli"],"replyText":"Alpha Bravo Charlie, roger."}'::jsonb,
29, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-abc');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Delta Echo Foxtrot Golf', 'twr-defg', 'D E F G.', 'SPEAK',
'<p>Delta, Echo (Eko), Foxtrot (Fox), Golf.</p>',
'{"promptText":"Say D E F G.","expectedPhrase":"Delta Echo Foxtrot Golf","acceptedPhrases":["delte eko fox golf","delta echo fox"],"replyText":"Delta Echo Foxtrot Golf."}'::jsonb,
30, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-defg');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Hotel India Juliet Kilo', 'twr-hijk', 'H I J K. Otel / Julie yeter.', 'SPEAK',
'<p>Hotel, India, Juliet, Kilo.</p>',
'{"promptText":"Say H I J K.","expectedPhrase":"Hotel India Juliet Kilo","acceptedPhrases":["otel indya julie kilo","hotel juliet kilo"],"replyText":"Hotel India Juliet Kilo."}'::jsonb,
31, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-hijk');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Lima Mike November Oscar', 'twr-lmno', 'L M N O.', 'SPEAK',
'<p>Lima, Mike, November, Oscar.</p>',
'{"promptText":"Say L M N O.","expectedPhrase":"Lima Mike November Oscar","acceptedPhrases":["lima mayk november oskar","lima mike oscar"],"replyText":"Lima Mike November Oscar."}'::jsonb,
32, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-lmno');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Papa Quebec Romeo Sierra', 'twr-pqrs', 'P Q R S. Kebek yeter.', 'SPEAK',
'<p>Papa, Quebec, Romeo, Sierra.</p>',
'{"promptText":"Say P Q R S.","expectedPhrase":"Papa Quebec Romeo Sierra","acceptedPhrases":["papa kebek romeo siera","papa quebec sierra"],"replyText":"Papa Quebec Romeo Sierra."}'::jsonb,
33, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-pqrs');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Tango Uniform Victor', 'twr-tuv', 'T U V.', 'SPEAK',
'<p>Tango, Uniform, Victor (Viktor).</p>',
'{"promptText":"Say T U V.","expectedPhrase":"Tango Uniform Victor","acceptedPhrases":["tango unifom viktor","tango victor"],"replyText":"Tango Uniform Victor."}'::jsonb,
34, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-tuv');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Whiskey X-ray Yankee Zulu', 'twr-wxyz', 'W X Y Z. Viski / Yanki yeter.', 'SPEAK',
'<p>Whiskey, X-ray, Yankee, Zulu.</p>',
'{"promptText":"Say W X Y Z.","expectedPhrase":"Whiskey Xray Yankee Zulu","acceptedPhrases":["viski eksray yanki zulu","whiskey yankee zulu"],"replyText":"Whiskey X-ray Yankee Zulu."}'::jsonb,
35, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'kule-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'twr-wxyz');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Havacılık alfabesi', 'plt-alfabe', 'ICAO A-Z, çağrı işareti harfleri.', 'CONTENT',
'<p>Çağrı işaretindeki harf bu kelimedir: 102J = Juliet. THY 45C = Charlie.</p>
<ul>
<li><strong>A</strong> Alpha</li><li><strong>B</strong> Bravo</li><li><strong>C</strong> Charlie</li>
<li><strong>D</strong> Delta</li><li><strong>E</strong> Echo</li><li><strong>F</strong> Foxtrot</li>
<li><strong>G</strong> Golf</li><li><strong>H</strong> Hotel</li><li><strong>I</strong> India</li>
<li><strong>J</strong> Juliet</li><li><strong>K</strong> Kilo</li><li><strong>L</strong> Lima</li>
<li><strong>M</strong> Mike</li><li><strong>N</strong> November</li><li><strong>O</strong> Oscar</li>
<li><strong>P</strong> Papa</li><li><strong>Q</strong> Quebec</li><li><strong>R</strong> Romeo</li>
<li><strong>S</strong> Sierra</li><li><strong>T</strong> Tango</li><li><strong>U</strong> Uniform</li>
<li><strong>V</strong> Victor</li><li><strong>W</strong> Whiskey</li><li><strong>X</strong> X-ray</li>
<li><strong>Y</strong> Yankee</li><li><strong>Z</strong> Zulu</li>
</ul>',
NULL, 24, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'plt-alfabe');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Alpha Bravo Charlie', 'plt-abc', 'A B C.', 'SPEAK',
'<p>Alfa, Bravo, Charli. İkisi yetebilir.</p>',
'{"promptText":"You are on taxiway A, B then C. Say the letters.","expectedPhrase":"Alpha Bravo Charlie","acceptedPhrases":["alfa bravo charli","alpha bravo"],"replyText":"Taxi via Alpha Bravo Charlie."}'::jsonb,
25, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'plt-abc');

INSERT INTO learning_steps (path_id, title, slug, description, step_type, content_html, configuration, order_index, required, status)
SELECT id, 'Konuş: Whiskey Yankee Zulu', 'plt-wyz', 'W Y Z çağrı harfleri.', 'SPEAK',
'<p>Whiskey / Viski, Yankee, Zulu.</p>',
'{"promptText":"Callsign letters W, Y, Z.","expectedPhrase":"Whiskey Yankee Zulu","acceptedPhrases":["viski yanki zulu","whiskey yankee"],"replyText":"Whiskey Yankee Zulu, roger."}'::jsonb,
26, TRUE, 'PUBLISHED' FROM learning_paths WHERE slug = 'pilot-ol'
AND NOT EXISTS (SELECT 1 FROM learning_steps WHERE slug = 'plt-wyz');
