-- Clear existing attendees and add real people
DELETE FROM attendees;

-- Reset the sequence
ALTER SEQUENCE attendees_id_seq RESTART WITH 1;

-- Insert real attendees for Mike's Bachelor Party  
INSERT INTO attendees (name, phone, golf_handicap, dietary_restrictions, venmo_handle) VALUES
('Ryan Daub', NULL, 12, 'None', '@ryan-daub'),
('Michael McCullough', NULL, 8, 'None', '@mike-mccullough'),
('Guy Stitt', NULL, 15, 'None', '@guy-stitt'),
('Jake Higdon', NULL, 20, 'None', '@jake-higdon'),
('Zack Higdon', NULL, 18, 'None', '@zack-higdon'),
('Dave Hess', NULL, 10, 'None', '@dave-hess'),
('Nigel Dick', NULL, 25, 'None', '@nigel-dick'),
('Greg Smith', NULL, 14, 'None', '@greg-smith'),
('Burak Aslan', NULL, 22, 'None', '@burak-aslan'),
('Choongwon Jin', NULL, 16, 'None', '@choongwon-jin'),
('Damien Babin', NULL, 11, 'None', '@damien-babin');

-- Clear existing room assignments since attendee IDs will change
UPDATE rooms SET attendee_ids = '{}';

-- Clear existing golf pairings since attendee IDs will change  
DELETE FROM golf_pairings;