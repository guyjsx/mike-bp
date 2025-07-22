-- Add golf course data table
CREATE TABLE golf_courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  phone VARCHAR(20),
  par_total INTEGER DEFAULT 72,
  yardage_total INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add hole data table
CREATE TABLE golf_holes (
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
CREATE TABLE golf_scorecards (
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
CREATE TABLE golf_hole_scores (
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

-- Insert Champions Point Golf Club data
INSERT INTO golf_courses (id, name, address, par_total, yardage_total) VALUES
('11111111-1111-1111-1111-111111111111', 'Champions Pointe Golf Club', '3325 Champions Way, Henryville, IN 47126', 72, 7174);

-- Insert hole data for Champions Point (based on the scorecard image)
INSERT INTO golf_holes (course_id, hole_number, par, handicap, yardage_fuzzy, yardage_white, yardage_gray, yardage_red) VALUES
('11111111-1111-1111-1111-111111111111', 1, 4, 17, 408, 357, 324, 292),
('11111111-1111-1111-1111-111111111111', 2, 3, 13, 190, 169, 145, 121),
('11111111-1111-1111-1111-111111111111', 3, 5, 5, 565, 515, 475, 447),
('11111111-1111-1111-1111-111111111111', 4, 3, 9, 434, 398, 366, 339),
('11111111-1111-1111-1111-111111111111', 5, 4, 15, 420, 382, 341, 303),
('11111111-1111-1111-1111-111111111111', 6, 3, 11, 209, 171, 153, 122),
('11111111-1111-1111-1111-111111111111', 7, 5, 1, 597, 548, 514, 421),
('11111111-1111-1111-1111-111111111111', 8, 4, 3, 383, 346, 304, 280),
('11111111-1111-1111-1111-111111111111', 9, 4, 7, 451, 431, 421, 300),
('11111111-1111-1111-1111-111111111111', 10, 4, 14, 408, 357, 324, 292),
('11111111-1111-1111-1111-111111111111', 11, 3, 16, 190, 169, 145, 121),
('11111111-1111-1111-1111-111111111111', 12, 5, 8, 565, 515, 475, 447),
('11111111-1111-1111-1111-111111111111', 13, 4, 6, 434, 398, 366, 339),
('11111111-1111-1111-1111-111111111111', 14, 4, 10, 420, 382, 341, 303),
('11111111-1111-1111-1111-111111111111', 15, 3, 12, 209, 171, 153, 122),
('11111111-1111-1111-1111-111111111111', 16, 5, 4, 597, 548, 514, 421),
('11111111-1111-1111-1111-111111111111', 17, 4, 18, 383, 346, 304, 280),
('11111111-1111-1111-1111-111111111111', 18, 4, 2, 451, 431, 421, 300);

-- Create indexes for better performance
CREATE INDEX idx_golf_holes_course_hole ON golf_holes(course_id, hole_number);
CREATE INDEX idx_golf_scorecards_round_attendee ON golf_scorecards(round_id, attendee_id);
CREATE INDEX idx_golf_hole_scores_scorecard ON golf_hole_scores(scorecard_id);
CREATE INDEX idx_golf_hole_scores_hole ON golf_hole_scores(hole_id);

-- Add updated_at trigger for hole scores
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_golf_hole_scores_updated_at 
    BEFORE UPDATE ON golf_hole_scores 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();