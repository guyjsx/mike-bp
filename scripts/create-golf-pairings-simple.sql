-- Create golf pairings with real attendees
-- Clear existing pairings first
DELETE FROM golf_pairings;

-- Get the first 8 attendee IDs (sorted by name)
-- Round 1: Champions Pointe - Group 1 (first 4 people)
INSERT INTO golf_pairings (round_id, group_number, attendee_ids)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  1,
  ARRAY(SELECT id FROM attendees ORDER BY name LIMIT 4)
WHERE EXISTS (SELECT 1 FROM attendees LIMIT 4);

-- Round 1: Champions Pointe - Group 2 (next 4 people)  
INSERT INTO golf_pairings (round_id, group_number, attendee_ids)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  2,
  ARRAY(SELECT id FROM attendees ORDER BY name OFFSET 4 LIMIT 4)
WHERE EXISTS (SELECT 1 FROM attendees OFFSET 4 LIMIT 4);

-- Round 2: Fuzzy Zoeller - Group 1 (mixed: 1st, 3rd, 5th, 7th people)
INSERT INTO golf_pairings (round_id, group_number, attendee_ids)
WITH numbered_attendees AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM attendees
)
SELECT 
  '22222222-2222-2222-2222-222222222222',
  1,
  ARRAY_AGG(id)
FROM numbered_attendees 
WHERE rn IN (1, 3, 5, 7);

-- Round 2: Fuzzy Zoeller - Group 2 (mixed: 2nd, 4th, 6th, 8th people)
INSERT INTO golf_pairings (round_id, group_number, attendee_ids)
WITH numbered_attendees AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM attendees
)
SELECT 
  '22222222-2222-2222-2222-222222222222',
  2,
  ARRAY_AGG(id)
FROM numbered_attendees 
WHERE rn IN (2, 4, 6, 8);