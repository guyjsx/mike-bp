-- Add golf pairings for the real attendees
-- First, get some attendee IDs to work with

-- Insert golf pairings for Champions Pointe (Round 1)
WITH attendee_ids AS (
  SELECT id, name, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM attendees 
  LIMIT 8
)
INSERT INTO golf_pairings (round_id, group_number, attendee_ids)
SELECT 
  '11111111-1111-1111-1111-111111111111',
  CASE 
    WHEN rn <= 4 THEN 1
    ELSE 2
  END,
  ARRAY_AGG(id) OVER (
    PARTITION BY CASE WHEN rn <= 4 THEN 1 ELSE 2 END
    ORDER BY rn
    ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
  )
FROM attendee_ids
GROUP BY 
  CASE WHEN rn <= 4 THEN 1 ELSE 2 END,
  CASE WHEN rn <= 4 THEN 1 ELSE 2 END;

-- Simpler approach - let's just manually create the pairings
DELETE FROM golf_pairings;

-- Get first 8 attendees for pairings
WITH first_eight AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM attendees 
  ORDER BY name
  LIMIT 8
),
group1 AS (
  SELECT ARRAY_AGG(id) as ids FROM first_eight WHERE rn <= 4
),
group2 AS (
  SELECT ARRAY_AGG(id) as ids FROM first_eight WHERE rn > 4
)
INSERT INTO golf_pairings (round_id, group_number, attendee_ids)
SELECT '11111111-1111-1111-1111-111111111111', 1, ids FROM group1
UNION ALL
SELECT '11111111-1111-1111-1111-111111111111', 2, ids FROM group2;

-- Add pairings for Fuzzy Zoeller (Round 2) - mix up the groups
WITH first_eight AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM attendees 
  ORDER BY name
  LIMIT 8
),
mixed_group1 AS (
  SELECT ARRAY_AGG(id) as ids FROM first_eight WHERE rn IN (1, 3, 5, 7)
),
mixed_group2 AS (
  SELECT ARRAY_AGG(id) as ids FROM first_eight WHERE rn IN (2, 4, 6, 8)
)
INSERT INTO golf_pairings (round_id, group_number, attendee_ids)
SELECT '22222222-2222-2222-2222-222222222222', 1, ids FROM mixed_group1
UNION ALL
SELECT '22222222-2222-2222-2222-222222222222', 2, ids FROM mixed_group2;