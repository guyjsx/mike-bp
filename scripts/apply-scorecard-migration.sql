-- Add golf course data table
CREATE TABLE IF NOT EXISTS golf_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  par_total INTEGER DEFAULT 72,
  yardage_total INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add hole data table
CREATE TABLE IF NOT EXISTS golf_holes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES golf_courses(id) ON DELETE CASCADE,
  hole_number INTEGER NOT NULL CHECK (hole_number >= 1 AND hole_number <= 18),
  par INTEGER NOT NULL CHECK (par >= 3 AND par <= 5),
  handicap INTEGER NOT NULL CHECK (handicap >= 1 AND handicap <= 18),
  -- Yardages for different tees
  yardage_fuzzy INTEGER,
  yardage_white INTEGER,
  yardage_gray INTEGER,
  yardage_red INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(course_id, hole_number)
);

-- Add scorecard table
CREATE TABLE IF NOT EXISTS golf_scorecards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  round_id UUID REFERENCES golf_rounds(id) ON DELETE CASCADE,
  attendee_id UUID REFERENCES attendees(id) ON DELETE CASCADE,
  course_id UUID REFERENCES golf_courses(id) ON DELETE CASCADE,
  tee_selection VARCHAR(20) DEFAULT 'white' CHECK (tee_selection IN ('fuzzy', 'white', 'gray', 'red')),
  is_completed BOOLEAN DEFAULT FALSE,
  total_score INTEGER,
  total_putts INTEGER,
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(round_id, attendee_id)
);

-- Add hole scores table
CREATE TABLE IF NOT EXISTS golf_hole_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  scorecard_id UUID REFERENCES golf_scorecards(id) ON DELETE CASCADE,
  hole_id UUID REFERENCES golf_holes(id) ON DELETE CASCADE,
  strokes INTEGER CHECK (strokes >= 1 AND strokes <= 15),
  putts INTEGER CHECK (putts >= 0 AND putts <= 15),
  notes TEXT,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(scorecard_id, hole_id)
);

-- Insert Champions Point Golf Club data (only if not exists)
INSERT INTO golf_courses (id, name, address, par_total, yardage_total) 
SELECT '11111111-1111-1111-1111-111111111111', 'Champions Pointe Golf Club', '3325 Champions Way, Henryville, IN 47126', 72, 7174
WHERE NOT EXISTS (SELECT 1 FROM golf_courses WHERE name = 'Champions Pointe Golf Club');

-- Insert hole data for Champions Point (only if not exists)
INSERT INTO golf_holes (course_id, hole_number, par, handicap, yardage_fuzzy, yardage_white, yardage_gray, yardage_red) 
SELECT '11111111-1111-1111-1111-111111111111', hole_num, par_val, hcp_val, fuzzy_val, white_val, gray_val, red_val
FROM (VALUES
  (1, 4, 17, 408, 357, 324, 292),
  (2, 3, 13, 190, 169, 145, 121),
  (3, 5, 5, 565, 515, 475, 447),
  (4, 3, 9, 434, 398, 366, 339),
  (5, 4, 15, 420, 382, 341, 303),
  (6, 3, 11, 209, 171, 153, 122),
  (7, 5, 1, 597, 548, 514, 421),
  (8, 4, 3, 383, 346, 304, 280),
  (9, 4, 7, 451, 431, 421, 300),
  (10, 4, 14, 408, 357, 324, 292),
  (11, 3, 16, 190, 169, 145, 121),
  (12, 5, 8, 565, 515, 475, 447),
  (13, 4, 6, 434, 398, 366, 339),
  (14, 4, 10, 420, 382, 341, 303),
  (15, 3, 12, 209, 171, 153, 122),
  (16, 5, 4, 597, 548, 514, 421),
  (17, 4, 18, 383, 346, 304, 280),
  (18, 4, 2, 451, 431, 421, 300)
) AS holes_data(hole_num, par_val, hcp_val, fuzzy_val, white_val, gray_val, red_val)
WHERE NOT EXISTS (
  SELECT 1 FROM golf_holes 
  WHERE course_id = '11111111-1111-1111-1111-111111111111' 
  AND hole_number = holes_data.hole_num
);

-- Create indexes for better performance (if not exists)
CREATE INDEX IF NOT EXISTS idx_golf_holes_course_hole ON golf_holes(course_id, hole_number);
CREATE INDEX IF NOT EXISTS idx_golf_scorecards_round_attendee ON golf_scorecards(round_id, attendee_id);
CREATE INDEX IF NOT EXISTS idx_golf_hole_scores_scorecard ON golf_hole_scores(scorecard_id);
CREATE INDEX IF NOT EXISTS idx_golf_hole_scores_hole ON golf_hole_scores(hole_id);

-- Add updated_at trigger for hole scores (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_golf_hole_scores_updated_at ON golf_hole_scores;
CREATE TRIGGER update_golf_hole_scores_updated_at 
    BEFORE UPDATE ON golf_hole_scores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();