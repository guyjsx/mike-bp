export interface Attendee {
  id: string;
  name: string;
  phone?: string;
  arrival_time?: string;
  departure_time?: string;
  dietary_restrictions?: string;
  golf_handicap?: number;
  emergency_contact?: string;
  venmo_handle?: string;
  photo_url?: string;
  created_at: string;
}

export interface Event {
  id: string;
  day: string;
  start_time: string;
  end_time?: string;
  title: string;
  location?: string;
  map_link?: string;
  cost_per_person?: number;
  notes?: string;
  dress_code?: string;
  attendee_ids: string[];
  created_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  check_in_name?: string;
  capacity: number;
  attendee_ids: string[];
  notes?: string;
  created_at: string;
}

export interface Expense {
  id: string;
  title: string;
  total_amount: number;
  category?: string;
  split_type: 'equal' | 'custom' | 'by_attendance';
  paid_by_id: string;
  split_between_ids: string[];
  notes?: string;
  created_at: string;
}

export interface ExpensePayment {
  id: string;
  expense_id: string;
  from_attendee_id: string;
  to_attendee_id: string;
  amount: number;
  is_paid: boolean;
  paid_at?: string;
  created_at: string;
}

export interface GolfRound {
  id: string;
  day: string;
  tee_time: string;
  course_name: string;
  course_address?: string;
  course_phone?: string;
  dress_code?: string;
  notes?: string;
  created_at: string;
}

export interface GolfPairing {
  id: string;
  round_id: string;
  group_number: number;
  attendee_ids: string[];
  created_at: string;
}

export interface Announcement {
  id: string;
  message: string;
  is_active: boolean;
  created_at: string;
}

export interface GolfCourse {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  par_total: number;
  yardage_total: number;
  created_at: string;
}

export interface GolfHole {
  id: string;
  course_id: string;
  hole_number: number;
  par: number;
  handicap: number;
  yardage_fuzzy?: number;
  yardage_white?: number;
  yardage_gray?: number;
  yardage_red?: number;
  created_at: string;
}

export interface GolfScorecard {
  id: string;
  round_id: string;
  attendee_id: string;
  course_id: string;
  tee_selection: 'fuzzy' | 'white' | 'gray' | 'red';
  is_completed: boolean;
  total_score?: number;
  total_putts?: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface GolfHoleScore {
  id: string;
  scorecard_id: string;
  hole_id: string;
  strokes?: number;
  putts?: number;
  notes?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  eventTitle: string;
  eventDates: {
    start: string;
    end: string;
  };
  hotel: {
    name: string;
    address: string;
    checkIn: string;
    checkOut: string;
    phone: string;
  };
}