UPDATE learning_steps
   SET configuration = configuration || '{"replyText":"Turkish 123, roger, push and start approved, face north."}'::jsonb
 WHERE slug = 'konus-ground';

UPDATE learning_steps
   SET configuration = configuration || '{"replyText":"Turkish 123, roger."}'::jsonb
 WHERE slug IN ('konus-pushback', 'konus-line-up');

UPDATE learning_steps
   SET configuration = configuration || '{"replyText":"Turkish 45C, roger."}'::jsonb
 WHERE slug = 'senaryo-inis';

UPDATE learning_steps
   SET configuration = configuration || '{"replyText":"Turkish 123, lining up."}'::jsonb
 WHERE slug IN ('kalkis-diyalogu', 'senaryo-kalkis-izni');
