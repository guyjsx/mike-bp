-- First, create the attendees table if it doesn't exist
CREATE TABLE IF NOT EXISTS attendees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  arrival_time TIMESTAMP,
  departure_time TIMESTAMP,
  dietary_restrictions TEXT,
  golf_handicap INTEGER,
  emergency_contact VARCHAR(255),
  venmo_handle VARCHAR(100),
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Then insert the test data
INSERT INTO attendees (name, phone, golf_handicap, dietary_restrictions, venmo_handle) VALUES
('John Smith (Groom)', '555-0100', 10, 'None', '@john-smith'),
('Mike Johnson', '555-0101', 15, 'Vegetarian', '@mike-j'),
('Chris Williams', '555-0102', 8, 'None', '@chris-w'),
('David Brown', '555-0103', 20, 'Gluten-free', '@david-b'),
('James Davis', '555-0104', 12, 'None', '@james-d'),
('Robert Miller', '555-0105', 18, 'None', '@robert-m'),
('William Wilson', '555-0106', 25, 'Dairy-free', '@william-w'),
('Richard Moore', '555-0107', 14, 'None', '@richard-m');

-- Verify the data was inserted
SELECT COUNT(*) as total_attendees FROM attendees;
SELECT name FROM attendees ORDER BY name;