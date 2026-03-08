export type UserRole = 'super_admin' | 'admin' | 'secretary' | 'instructor' | 'student';

export type LicenseStage = 
  | 'theory_pending'
  | 'theory_passed'
  | 'practical_pending'
  | 'practical_passed'
  | 'graduated';

export type SessionStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show';

export type ExamStatus = 'pending' | 'in_progress' | 'passed' | 'failed' | 'expired';

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export type DocStatus = 'pending' | 'approved' | 'rejected';

export type DocType = 'national_id' | 'photo' | 'medical_cert' | 'birth_cert' | 'residence_cert';

export interface School {
  id: string;
  name: string;
  address?: string;
  license_no: string;
  wilaya: string;
  phone?: string;
  logo_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: string;
  school_id: string | null;
  role: UserRole;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProfile {
  user_id: string;
  national_id: string;
  birth_date: string;
  address?: string;
  license_stage: LicenseStage;
  package_id?: string;
  enrolled_at: string;
  graduated_at?: string;
}

export interface InstructorProfile {
  user_id: string;
  license_no: string;
  specializations: string[];
  hire_date?: string;
  rating?: number;
}

export interface Package {
  id: string;
  school_id: string;
  name: string;
  price: number;
  theory_hours: number;
  practical_hours: number;
  exam_attempts: number;
  description?: string;
  is_active: boolean;
}

export interface Vehicle {
  id: string;
  school_id: string;
  plate_no: string;
  make?: string;
  model?: string;
  year?: number;
  transmission: 'manual' | 'automatic';
  fuel_type: 'petrol' | 'diesel' | 'electric';
  is_active: boolean;
  last_service?: string;
  notes?: string;
  created_at: string;
}

export interface Session {
  id: string;
  school_id: string;
  student_id: string;
  instructor_id: string;
  vehicle_id: string;
  scheduled_at: string;
  duration_mins: number;
  status: SessionStatus;
  instructor_notes?: string;
  performance_score?: number;
  location?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
  // Joined data for UI
  instructor?: User;
  vehicle?: Vehicle;
}

export interface Exam {
  id: string;
  student_id: string;
  school_id: string;
  status: ExamStatus;
  score?: number;
  pass_threshold: number;
  total_questions: number;
  duration_mins: number;
  attempt_number: number;
  lang: string;
  started_at?: string;
  submitted_at?: string;
  expires_at?: string;
  created_at: string;
}

export interface ExamQuestion {
  id: string;
  exam_id: string;
  question_text: string;
  options: { label: string; text: string }[];
  correct_option: string;
  topic?: string;
  difficulty: number;
  explanation?: string;
  question_order: number;
}

export interface ExamAnswer {
  id: string;
  exam_id: string;
  question_id: string;
  chosen_option?: string;
  is_correct?: boolean;
  answered_at: string;
}

export interface Invoice {
  id: string;
  school_id: string;
  student_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date?: string;
  paid_at?: string;
  payment_method?: string;
  receipt_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentDocument {
  id: string;
  student_id: string;
  school_id: string;
  type: DocType;
  status: DocStatus;
  file_url: string;
  reviewed_by?: string;
  reviewed_at?: string;
  notes?: string;
  uploaded_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'session' | 'exam' | 'document' | 'invoice' | 'school';
  is_read: boolean;
  created_at: string;
}
