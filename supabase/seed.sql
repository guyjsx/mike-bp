-- Seed data for development

-- Insert test attendees
INSERT INTO attendees (name, phone, golf_handicap, dietary_restrictions, venmo_handle) VALUES
('John Smith (Groom)', '555-0100', 10, 'None', '@john-smith'),
('Mike Johnson', '555-0101', 15, 'Vegetarian', '@mike-j'),
('Chris Williams', '555-0102', 8, 'None', '@chris-w'),
('David Brown', '555-0103', 20, 'Gluten-free', '@david-b'),
('James Davis', '555-0104', 12, 'None', '@james-d'),
('Robert Miller', '555-0105', 18, 'None', '@robert-m'),
('William Wilson', '555-0106', 25, 'Dairy-free', '@william-w'),
('Richard Moore', '555-0107', 14, 'None', '@richard-m');

-- Get attendee IDs for reference
DO $$
DECLARE
  john_id UUID;
  mike_id UUID;
  chris_id UUID;
  david_id UUID;
  james_id UUID;
  robert_id UUID;
  william_id UUID;
  richard_id UUID;
BEGIN
  SELECT id INTO john_id FROM attendees WHERE name = 'John Smith (Groom)';
  SELECT id INTO mike_id FROM attendees WHERE name = 'Mike Johnson';
  SELECT id INTO chris_id FROM attendees WHERE name = 'Chris Williams';
  SELECT id INTO david_id FROM attendees WHERE name = 'David Brown';
  SELECT id INTO james_id FROM attendees WHERE name = 'James Davis';
  SELECT id INTO robert_id FROM attendees WHERE name = 'Robert Miller';
  SELECT id INTO william_id FROM attendees WHERE name = 'William Wilson';
  SELECT id INTO richard_id FROM attendees WHERE name = 'Richard Moore';

  -- Insert events
  INSERT INTO events (day, start_time, end_time, title, location, attendee_ids) VALUES
  ('2024-05-10', '15:00', '16:00', 'Hotel Check-in', 'Caesars Southern Indiana', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('2024-05-10', '18:00', '20:00', 'Welcome Dinner', 'The Steakhouse', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('2024-05-10', '20:30', '23:00', 'Casino Night', 'Casino Floor', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id]),
  ('2024-05-11', '08:00', '09:00', 'Breakfast', 'Hotel Restaurant', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('2024-05-11', '10:00', '14:00', 'Golf Round 1', 'Champions Pointe Golf Club', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('2024-05-11', '15:00', '16:00', 'Free Time', 'Hotel', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('2024-05-11', '18:30', '21:00', 'BBQ Dinner', 'Local BBQ Joint', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('2024-05-12', '09:00', '13:00', 'Golf Round 2', 'Fuzzy Zoeller Golf Course', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id]),
  ('2024-05-12', '14:00', '15:00', 'Farewell Lunch', 'Hotel Restaurant', ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]);

  -- Insert rooms
  INSERT INTO rooms (room_number, check_in_name, capacity, attendee_ids) VALUES
  ('201', 'John Smith', 2, ARRAY[john_id, mike_id]),
  ('202', 'Chris Williams', 2, ARRAY[chris_id, david_id]),
  ('203', 'James Davis', 2, ARRAY[james_id, robert_id]),
  ('204', 'William Wilson', 2, ARRAY[william_id, richard_id]);

  -- Insert golf rounds
  INSERT INTO golf_rounds (id, day, tee_time, course_name, course_address, dress_code) VALUES
  ('11111111-1111-1111-1111-111111111111', '2024-05-11', '10:00', 'Champions Pointe Golf Club', '3325 Champions Way, Henryville, IN 47126', 'Collared shirt required'),
  ('22222222-2222-2222-2222-222222222222', '2024-05-12', '09:00', 'Fuzzy Zoeller Golf Course', '7900 Covered Bridge Rd, Sellersburg, IN 47172', 'Proper golf attire');

  -- Insert golf pairings
  INSERT INTO golf_pairings (round_id, group_number, attendee_ids) VALUES
  ('11111111-1111-1111-1111-111111111111', 1, ARRAY[john_id, mike_id, chris_id, david_id]),
  ('11111111-1111-1111-1111-111111111111', 2, ARRAY[james_id, robert_id, william_id, richard_id]),
  ('22222222-2222-2222-2222-222222222222', 1, ARRAY[john_id, chris_id, james_id, william_id]),
  ('22222222-2222-2222-2222-222222222222', 2, ARRAY[mike_id, david_id, robert_id]);

  -- Insert expenses
  INSERT INTO expenses (title, total_amount, category, split_type, paid_by_id, split_between_ids) VALUES
  ('Hotel Rooms (4 nights)', 1600.00, 'Accommodation', 'equal', john_id, ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('Welcome Dinner', 480.00, 'Food', 'equal', mike_id, ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('Golf Round 1', 800.00, 'Activities', 'equal', chris_id, ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]),
  ('BBQ Dinner', 360.00, 'Food', 'equal', david_id, ARRAY[john_id, mike_id, chris_id, david_id, james_id, robert_id, william_id, richard_id]);

  -- Insert announcements
  INSERT INTO announcements (message, is_active) VALUES
  ('Remember to bring your golf clubs and proper attire for the courses!', true),
  ('Casino night is optional - feel free to head to bed early if you need rest for golf!', true);

  -- Insert settings
  INSERT INTO settings (key, value) VALUES
  ('event_details', '{"eventTitle": "John''s Bachelor Party", "eventDates": {"start": "2024-05-10", "end": "2024-05-12"}, "hotel": {"name": "Caesars Southern Indiana", "address": "11999 Casino Center Drive, Elizabeth, IN 47117", "checkIn": "4:00 PM", "checkOut": "11:00 AM", "phone": "(812) 969-5000"}}');

END $$;