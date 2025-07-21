-- Attendees table
CREATE TABLE attendees (
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

-- Events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  map_link TEXT,
  cost_per_person DECIMAL(10,2),
  notes TEXT,
  dress_code VARCHAR(100),
  attendee_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rooms table
CREATE TABLE rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  room_number VARCHAR(20) NOT NULL,
  check_in_name VARCHAR(255),
  capacity INTEGER DEFAULT 2,
  attendee_ids UUID[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expenses table
CREATE TABLE expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(50),
  split_type VARCHAR(20) DEFAULT 'equal', -- 'equal', 'custom', 'by_attendance'
  paid_by_id UUID REFERENCES attendees(id),
  split_between_ids UUID[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Expense payments tracking
CREATE TABLE expense_payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  expense_id UUID REFERENCES expenses(id) ON DELETE CASCADE,
  from_attendee_id UUID REFERENCES attendees(id),
  to_attendee_id UUID REFERENCES attendees(id),
  amount DECIMAL(10,2) NOT NULL,
  is_paid BOOLEAN DEFAULT FALSE,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Golf rounds table
CREATE TABLE golf_rounds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day DATE NOT NULL,
  tee_time TIME NOT NULL,
  course_name VARCHAR(255) NOT NULL,
  course_address TEXT,
  course_phone VARCHAR(20),
  dress_code VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Golf pairings table
CREATE TABLE golf_pairings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  round_id UUID REFERENCES golf_rounds(id) ON DELETE CASCADE,
  group_number INTEGER NOT NULL,
  attendee_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Announcements table
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Settings table (for storing event details)
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_day ON events(day);
CREATE INDEX idx_events_attendee_ids ON events USING GIN(attendee_ids);
CREATE INDEX idx_rooms_attendee_ids ON rooms USING GIN(attendee_ids);
CREATE INDEX idx_expenses_paid_by ON expenses(paid_by_id);
CREATE INDEX idx_expenses_split_between ON expenses USING GIN(split_between_ids);
CREATE INDEX idx_expense_payments_expense ON expense_payments(expense_id);
CREATE INDEX idx_expense_payments_from ON expense_payments(from_attendee_id);
CREATE INDEX idx_expense_payments_to ON expense_payments(to_attendee_id);
CREATE INDEX idx_golf_rounds_day ON golf_rounds(day);
CREATE INDEX idx_golf_pairings_round ON golf_pairings(round_id);
CREATE INDEX idx_announcements_active ON announcements(is_active);
CREATE INDEX idx_settings_key ON settings(key);